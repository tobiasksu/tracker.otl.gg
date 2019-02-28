const HtmlMinifier = require("html-minifier"),

    settings = require("../settings"),
    Servers = require("../servers");

/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

//   #   #
//   #   #
//   #   #   ###   ## #    ###
//   #####  #   #  # # #  #   #
//   #   #  #   #  # # #  #####
//   #   #  #   #  # # #  #
//   #   #   ###   #   #   ###
/**
 * A class that represents the home page.
 */
class Home {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {void} A promise that resolves when the request is complete.
     */
    static get(req, res) {
        const servers = Servers.servers;

        const html = /* html */`
            <html>
                <head>
                    <title>Overload Game Browser</title>
                    <meta name="og:title" content="Overload Game Browser" />
                    <meta name="og:type" content="website" />
                    <meta name="og:url" content="${req.protocol}://${req.get("host")}${req.originalUrl}" />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:creator" content="@roncli" />
                    <link rel="stylesheet" href="/css/reset.css" />
                    <link rel="stylesheet" href="/css/home.css" />
                </head>
                <body>
                    <h1>Overload Game Browser</h1>
                    <div>This is a list of Overload servers along with the last game played on each server.</div>
                    <div id="browser">
                        <div class="header">Name</div>
                        <div class="header">IP Address</div>
                        <div class="header">Map</div>
                        <div class="header">Mode</div>
                        <div class="header">Players</div>
                        <div class="header">Last Updated</div>
                        <div class="header">Last Game Started</div>
                        <div class="header">Notes</div>
                        ${Object.keys(servers).map((s) => /* html */`
                            <div>${servers[s].name}</div>
                            <div>${s}</div>
                            <div>${servers[s].map}</div>
                            <div>${servers[s].mode}</div>
                            <div>${servers[s].numPlayers}/${servers[s].maxNumPlayers}</div>
                            <div>${servers[s].lastSeen}</div>
                            <div>${servers[s].gameStarted}</div>
                            <div>${servers[s].notes}</div>
                        `).join("")}
                    </div>
                </body>
            </html>
        `;

        res.status(200).send(HtmlMinifier.minify(html, settings.HtmlMinifier));
    }
}

module.exports = Home.get;
