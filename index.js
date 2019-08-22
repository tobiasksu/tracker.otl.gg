const compression = require("compression"),
    express = require("express"),
    minify = require("express-minify"),
    morgan = require("morgan"),
    morganExtensions = require("./src/extensions/morgan.extensions"),

    Log = require("./src/logging/log"),
    Router = require("./src/router"),
    settings = require("./settings"),
    Websocket = require("./src/websocket"),

    app = express();

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
    console.log("Starting up...");

    let router;
    try {
        router = await Router.getRouter();
    } catch (err) {
        console.log(err);
        return;
    }

    if (process.platform === "win32") {
        process.title = "Overload Game Browser";
    } else {
        process.stdout.write("\x1b]2;Overload Game Browser\x1b\x5c");
    }

    // Add morgan extensions.
    morganExtensions(morgan);

    // Initialize middleware stack.
    app.use(express.json({
        limit: "1mb"
    }));
    app.use(compression());
    app.use(morgan(":colorstatus \x1b[30m\x1b[0m:method\x1b[0m :url\x1b[30m\x1b[0m:newline    Date :date[iso]    IP :req[ip]    Time :colorresponse ms"));
    app.use(minify());

    // Web server routes.
    app.use(express.static("public"));

    app.get("/js/common/timeago.min.js", (req, res) => {
        res.sendFile(`${__dirname}/node_modules/timeago.js/dist/timeago.min.js`);
    });

    app.use("/", router);

    // Startup websockets.
    const server = Websocket.start();

    // Startup webserver.
    const port = +(process.env.PORT || settings.express.port);

    server.on("request", app);
    server.listen(port, () => {
        console.log(`Web server and websockets listening on port ${port}.`);
    });
}());

process.on("unhandledRejection", (reason) => {
    Log.exception("Unhandled promise rejection caught.", reason);
});
