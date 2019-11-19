const compression = require("compression"),
    express = require("express"),
    expressWs = require("express-ws"),
    minify = require("express-minify"),
    morgan = require("morgan"),
    morganExtensions = require("./src/extensions/morgan.extensions"),

    Log = require("./src/logging/log"),
    Router = require("./src/router"),
    settings = require("./settings");

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

    // Set title.
    if (process.platform === "win32") {
        process.title = "Overload Game Browser";
    } else {
        process.stdout.write("\x1b]2;Overload Game Browser\x1b\x5c");
    }

    // Setup express app.
    const app = express();

    // Startup websockets.
    expressWs(app);

    // Get the router.
    let router;
    try {
        router = await Router.getRouter();
    } catch (err) {
        console.log(err);
        return;
    }

    // Initialize middleware stack.
    app.use(express.json({
        limit: "10mb"
    }));
    app.use(compression());
    morganExtensions(morgan);
    app.use(morgan(":colorstatus \x1b[30m\x1b[0m:method\x1b[0m :url\x1b[30m\x1b[0m:newline    Date :date[iso]    IP :req[ip]    Time :colorresponse ms"));
    app.use(minify());

    // Web server routes.
    app.use(express.static("public"));

    app.get("/js/common/timeago.min.js", (req, res) => {
        res.sendFile(`${__dirname}/node_modules/timeago.js/dist/timeago.min.js`);
    });

    app.use("/", router);

    // Startup webserver.
    const port = process.env.PORT || settings.express.port;

    app.listen(port, () => {
        console.log(`Web server and websockets listening on port ${port}.`);
    });
}());

process.on("unhandledRejection", (reason) => {
    Log.exception("Unhandled promise rejection caught.", reason);
});
