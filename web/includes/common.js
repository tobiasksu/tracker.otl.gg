const pjson = require("../../package.json"),

    nameAngledBracketTagStart = /^<.*> /,
    nameBraceTagStart = /^\{.*\} /,
    nameBracketTagStart = /^\[.*\] /,
    nameDesignaterEnd = / - .*$/,
    nameParenthesisTagStart = /^\(.*\) /;

/**
 * @typedef {import("express").Request} Express.Request
 */

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
class Common {
    // ###    ###   ###   ##
    // #  #  #  #  #  #  # ##
    // #  #  # ##   ##   ##
    // ###    # #  #      ##
    // #            ###
    /**
     * Generates a webpage from the provided HTML using a common template.
     * @param {string} head The HTML to insert into the header.
     * @param {string} html The HTML to make a full web page from.
     * @param {Express.Request} req The request of the page.
     * @returns {string} The HTML of the full web page.
     */
    static page(head, html, req) {
        const year = new Date().getFullYear();

        return /* html */`
            <html>
                <head>
                    <title>Overload Game Browser</title>
                    <meta name="og:title" content="Overload Game Browser" />
                    <meta name="og:type" content="website" />
                    <meta name="og:url" content="${req.protocol}://${req.get("host")}${req.originalUrl}" />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:creator" content="@roncli" />
                    <link rel="stylesheet" href="/css/reset.css" />
                    <link rel="stylesheet" href="/css/common.css" />
                    <script src="/js/common.js"></script>
                    ${head}
                </head>
                <body>
                    <div id="page">
                        <div id="menu">
                            <ol style="fon">
                                <li><a href="/">Home</a></li>
                                <li><a href="/download">Download olproxy</a></li>
                                <li><a href="/about">About</a></li>
                            </ol>
                        </div>
                        <div id="header">Overload Game Browser</div>
                        ${html}
                        <div id="copyright">
                            <div class="left">
                                Website Version ${pjson.version}, &copy;${+year > 2019 ? "2019-" : ""}${year} roncli Productions<br />
                                olproxy, &copy;${+year > 2019 ? "2019-" : ""}${year} Arne de Bruijn
                            </div>
                            <div class="right">
                                Bugs with the website?  <a href="https://github.com/roncli/olproxy.otl.gg/issues" target="_blank">Report on GitHub</a><br />
                                Bugs with olproxy?  <a href="https://github.com/arbruijn/olproxy/issues" target="_blank">Report on GitHub</a><br />
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `;
    }

    // #      #          ##    ####                       #
    // #      #           #    #                          #
    // ###   ###   # #    #    ###   ###    ##    ##    ###   ##
    // #  #   #    ####   #    #     #  #  #     #  #  #  #  # ##
    // #  #   #    #  #   #    #     #  #  #     #  #  #  #  ##
    // #  #    ##  #  #  ###   ####  #  #   ##    ##    ###   ##
    /**
     * HTML-encodes a string.
     * @param {string} str The string.
     * @returns {string} The encoded string.
     */
    static htmlEncode(str) {
        return str.replace(/[\u0080-\uFFFF<>&]/gim, (i) => `&#${i.charCodeAt(0)};`);
    }

    //   #          ####                       #
    //              #                          #
    //   #    ###   ###   ###    ##    ##    ###   ##
    //   #   ##     #     #  #  #     #  #  #  #  # ##
    //   #     ##   #     #  #  #     #  #  #  #  ##
    // # #   ###    ####  #  #   ##    ##    ###   ##
    //  #
    /**
     * Javascript-encodes a string.
     * @param {*} str The string.
     * @returns {string} The encoded string.
     */
    static jsEncode(str) {
        return str.replace(/"/gim, "\\\"");
    }

    //                               ##     #                #  #
    //                                #                      ## #
    // ###    ##   ###   # #    ###   #    ##    ####   ##   ## #   ###  # #    ##
    // #  #  #  #  #  #  ####  #  #   #     #      #   # ##  # ##  #  #  ####  # ##
    // #  #  #  #  #     #  #  # ##   #     #     #    ##    # ##  # ##  #  #  ##
    // #  #   ##   #     #  #   # #  ###   ###   ####   ##   #  #   # #  #  #   ##
    /**
     * Normalizes a player name so that it doesn't start with a tag or end with a position designater.
     * @param {string} name The player's name.
     * @param {string} tag The player's team tag.
     * @returns {string} The normalized name.
     */
    static normalizeName(name, tag) {
        if (tag && name.toLowerCase().startsWith(`${tag.toLowerCase()} `)) {
            name = name.substring(tag.length + 1);
        }

        return name.replace(nameParenthesisTagStart, "").replace(nameBracketTagStart, "").replace(nameBraceTagStart, "").replace(nameAngledBracketTagStart, "").replace(nameDesignaterEnd, "");
    }
}

Common.route = {
    include: true
};

module.exports = Common;
