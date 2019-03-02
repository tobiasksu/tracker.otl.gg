const HtmlMinifier = require("html-minifier"),

    Common = require("../includes/common"),

    settings = require("../../settings"),
    Servers = require("../../servers");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
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
     * @param {express.Request} req The request.
     * @param {express.Response} res The response.
     * @returns {void} A promise that resolves when the request is complete.
     */
    static get(req, res) {
        const servers = Servers.servers;

        const html = Common.page(/* html */`
            <link rel="stylesheet" href="/css/home.css" />
            <script src="/js/timeago.min.js"></script>
            <script src="/js/home.js"></script>
            <meta http-equiv="refresh" content="60" />
        `, /* html */`
            <div id="notice">
                <div class="grey">Note: This page will automatically refresh every 60 seconds.</div>
            </div>
            <div id="browser">
                <div class="header">Name</div>
                <div class="header">IP Address</div>
                <div class="header">Map</div>
                <div class="header">Mode</div>
                <div class="header">Players</div>
                <div class="header">Last Updated</div>
                <div class="header">Last Game Started</div>
                <div class="header">Notes</div>
                ${Object.keys(servers).sort((a, b) => servers[a].name.localeCompare(servers[b].name)).map((s) => /* html */`
                    <div>${servers[s].name}</div>
                    <div>${s}</div>
                    <div>${servers[s].map}</div>
                    <div>${servers[s].mode}</div>
                    <div>${servers[s].numPlayers}/${servers[s].maxNumPlayers}</div>
                    <div><time class="timeago" datetime="${new Date(servers[s].lastSeen).toISOString()}">${new Date(servers[s].lastSeen)}</time></div>
                    <div><time class="timeago" datetime="${new Date(servers[s].gameStarted).toISOString()}">${new Date(servers[s].gameStarted)}</time></div>
                    <div>${servers[s].notes}</div>
                `).join("")}
            </div>
        `, req);

        res.status(200).send(HtmlMinifier.minify(html, settings.HtmlMinifier));
    }
}

module.exports = Home;
