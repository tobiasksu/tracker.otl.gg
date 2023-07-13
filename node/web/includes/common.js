/**
 * @typedef {import("../../types/node/commonTypes").Files} CommonTypes.Files
 * @typedef {import("express").Request} Express.Request
 */

const url = require("url"),

    HtmlMinifierTerser = require("html-minifier-terser"),
    Minify = require("@roncli/node-minify"),
    pjson = require("../../package.json"),
    RouterBase = require("hot-router").RouterBase;

/**
 * @type {typeof import("../../public/views/index")}
 */
let IndexView;

//   ###
//  #   #
//  #       ###   ## #   ## #    ###   # ##
//  #      #   #  # # #  # # #  #   #  ##  #
//  #      #   #  # # #  # # #  #   #  #   #
//  #   #  #   #  # # #  # # #  #   #  #   #
//   ###    ###   #   #  #   #   ###   #   #
/**
 * A class that handles common web functions.
 */
class Common extends RouterBase {
    //                    #
    //                    #
    // ###    ##   #  #  ###    ##
    // #  #  #  #  #  #   #    # ##
    // #     #  #  #  #   #    ##
    // #      ##    ###    ##   ##
    /**
     * Retrieves the route parameters for the class.
     * @returns {RouterBase.Route} The route parameters.
     */
    static get route() {
        const route = {...super.route};

        route.include = true;

        return route;
    }

    // ###    ###   ###   ##
    // #  #  #  #  #  #  # ##
    // #  #  # ##   ##   ##
    // ###    # #  #      ##
    // #            ###
    /**
     * Generates a webpage from the provided HTML using a common template.
     * @param {string} head The HTML to insert into the header.
     * @param {CommonTypes.Files} files The files to combine and minify.
     * @param {string} html The HTML to make a full web page from.
     * @param {Express.Request} req The request of the page.
     * @returns {Promise<string>} The HTML of the full web page.
     */
    static page(head, files, html, req) {
        if (!IndexView) {
            IndexView = require("../../public/views/index");
        }

        if (!files) {
            files = {js: [], css: []};
        }

        if (!files.js) {
            files.js = [];
        }

        if (!files.css) {
            files.css = [];
        }

        files.css.unshift("/css/common.css");
        files.css.unshift("/css/reset.css");

        let live = req.query.live;

        if (!live) {
            if (req.get("Referrer")) {
                live = url.parse(req.get("Referrer"), true).query.live;
            }
        }

        head = /* html */`
            <script>Time.live=${live !== "off"};${live === "off" ? "if(window.location.href.indexOf(\"?live=off\")===-1)history.replaceState(null,\"\",window.location.href+(window.location.href.indexOf(\"?\")===-1?\"?\":\"&\")+\"live=off\");" : ""}</script>
            ${head}${Minify.combine(files.js, "js")}${Minify.combine(files.css, "css")}
        `;

        return HtmlMinifierTerser.minify(
            IndexView.get({
                head,
                html,
                protocol: req.protocol,
                host: req.get("host"),
                originalUrl: req.originalUrl,
                year: new Date().getFullYear(),
                version: pjson.version
            }),
            {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                decodeEntities: true,
                html5: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true,
                removeRedundantAttributes: true,
                useShortDoctype: true
            }
        );
    }
}

module.exports = Common;
