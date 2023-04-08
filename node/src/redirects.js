const path = require("path");

/** @type {{[x: string]: {path: string, contentType: string}}} */
module.exports = {
    "/js/common/timeago.min.js": {
        path: path.join(__dirname, "../node_modules/timeago.js/dist/timeago.min.js"),
        contentType: "text/javascript"
    },
    "/js/common/clipboard.min.js": {
        path: path.join(__dirname, "../node_modules/clipboard/dist/clipboard.min.js"),
        contentType: "text/javascript"
    },
    "/js/common/chart.js": {
        path: path.join(__dirname, "../node_modules/chart.js/dist/chart.umd.js"),
        contentType: "text/javascript"
    }
};
