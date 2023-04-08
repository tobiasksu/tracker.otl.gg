/**
 * @typedef {express.Router} Express.Router
 */

const compression = require("compression"),
    express = require("express"),
    expressWs = require("express-ws"),
    HotRouter = require("hot-router"),
    Log = require("@roncli/node-application-insights-logger"),
    Minify = require("@roncli/node-minify"),
    path = require("path"),
    Redirects = require("./src/redirects"),
    Redis = require("@roncli/node-redis"),
    util = require("util"),

    Cache = Redis.Cache;

process.on("unhandledRejection", (reason) => {
    Log.error("Unhandled promise rejection caught.", {err: reason instanceof Error ? reason : new Error(util.inspect(reason))});
});

//         #                 #
//         #                 #
//  ###   ###    ###  ###   ###   #  #  ###
// ##      #    #  #  #  #   #    #  #  #  #
//   ##    #    # ##  #      #    #  #  #  #
// ###      ##   # #  #       ##   ###  ###
//                                      #
/**
 * Starts up the application.
 */
(async function startup() {
    // Setup application insights.
    if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY !== "") {
        Log.setupApplicationInsights(process.env.APPINSIGHTS_INSTRUMENTATIONKEY, {application: "sixgg", container: "sixgg-node"});
    }

    console.log("Starting up...");

    // Set title.
    if (process.platform === "win32") {
        process.title = "Overload Game Browser";
    } else {
        process.stdout.write("\x1b]2;Overload Game Browser\x1b\x5c");
    }

    // Setup Redis.
    Redis.setup({
        host: "redis",
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    });
    Redis.eventEmitter.on("error", (err) => {
        Log.error(`Redis error: ${err.message}`, {err: err.err});
    });
    await Cache.flush();

    // Setup express app.
    const app = express();

    // Remove powered by.
    app.disable("x-powered-by");

    // Startup websockets.
    expressWs(app);

    // Initialize middleware stack.
    app.use(compression());

    // Trust proxy to get correct IP from web server.
    app.enable("trust proxy");

    // Setup public redirects.
    app.use(/^(?!\/tsconfig\.json)/, express.static("public"));

    // Setup minification.
    Minify.setup({
        cssRoot: "/css/",
        jsRoot: "/js/",
        wwwRoot: path.join(__dirname, "public"),
        caching: process.env.MINIFY_CACHE ? {
            get: async (key) => {
                try {
                    return await Cache.get(key);
                } catch (err) {
                    Log.error("An error occurred while attempting to get a Minify cache.", {err, properties: {key}});
                    return void 0;
                }
            },
            set: (key, value) => {
                Cache.add(key, value, new Date(new Date().getTime() + 86400000)).catch((err) => {
                    Log.error("An error occurred while attempting to set a Minify cache.", {err, properties: {key}});
                });
            },
            prefix: process.env.REDIS_PREFIX
        } : void 0,
        redirects: Redirects,
        disableTagCombining: !process.env.MINIFY_ENABLED
    });
    app.get("/css", Minify.cssHandler);
    app.get("/js", Minify.jsHandler);

    // Setup redirect routes.
    app.get("*", (req, res, next) => {
        const redirect = Redirects[req.path];
        if (!redirect) {
            next();
            return;
        }

        res.status(200).contentType(redirect.contentType).sendFile(`${redirect.path}`);
    });

    // Setup hot-router.
    const router = new HotRouter.Router();
    router.on("error", (data) => {
        Log.error(data.message, {err: data.err, req: data.req});
    });
    try {
        app.use("/", await router.getRouter(path.join(__dirname, "web"), {hot: false}));
    } catch (err) {
        Log.critical("Could not set up routes.", {err});
    }

    app.use((err, req, res, next) => {
        router.error(err, req, res, next);
    });

    // Startup webserver.
    const port = process.env.PORT || 3030;

    app.listen(port);

    Log.info(`Server PID ${process.pid} listening on port ${port}.`);
}());
