const compression = require("compression"),
    express = require("express"),
    minify = require("express-minify"),

    router = require("./web/router"),

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
(function startup() {
    console.log("Starting up...");

    if (process.platform === "win32") {
        process.title = "Overload Game Browser";
    } else {
        process.stdout.write("\x1b]2;Overload Game Browser\x1b\x5c");
    }

    app.use(express.json());
    app.use(compression());
    app.use(minify());
    app.use(express.static("public"));

    // Web server routes.
    app.get("/js/timeago.min.js", (req, res) => {
        res.sendFile(`${__dirname}/node_modules/timeago.js/dist/timeago.min.js`);
    });

    app.use("/", router);

    // Startup web server.
    const port = process.env.PORT || 43434;

    app.listen(port);
    console.log(`Web server listening on port ${port}.`);
}());

process.on("unhandledRejection", (reason) => {
    console.log("Unhandled promise rejection caught.", reason);
});
