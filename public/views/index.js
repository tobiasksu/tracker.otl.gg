/**
 * @typedef {import("express").Request} Express.Request
 */

//   ###              #                #   #    #
//    #               #                #   #
//    #    # ##    ## #   ###   #   #  #   #   ##     ###   #   #
//    #    ##  #  #  ##  #   #   # #    # #     #    #   #  #   #
//    #    #   #  #   #  #####    #     # #     #    #####  # # #
//    #    #   #  #  ##  #       # #    # #     #    #      # # #
//   ###   #   #   ## #   ###   #   #    #     ###    ###    # #
/**
 * A class that represents the general website template.
 */
class IndexView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered page template.
     * @param {{head: string, html: string, protocol: string, host: string, originalUrl: string, year: number, version: string}} data The data to render the page with.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        const {head, html, protocol, host, originalUrl, year, version} = data;

        return /* html */`
            <html>
                <head>
                    <title>Overload Game Browser</title>
                    <meta name="og:title" content="Overload Game Browser" />
                    <meta name="og:type" content="website" />
                    <meta name="og:url" content="${protocol}://${host}${originalUrl}" />
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
                                <li><a href="/server">Server Setup</a></li>
                                <li><a href="/links">Links</a></li>
                                <li><a href="/about">About</a></li>
                            </ol>
                        </div>
                        <div id="header">Overload Game Browser</div>
                        ${html}
                        <div id="copyright">
                            <div class="left">
                                Website Version ${version}, &copy;${+year > 2019 ? "2019-" : ""}${year} roncli Productions<br />
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
}

// @ts-ignore
IndexView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = IndexView; // eslint-disable-line no-undef
}
