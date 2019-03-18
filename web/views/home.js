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
     * @returns {Promise} A promise that resolves when the request is complete.
     */
    static async get(req, res) {
        const servers = (await Servers.servers).filter((s) => s.name),
            now = new Date();

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
                ${Object.keys(servers).filter((s) => now.getTime() - new Date(servers[s].lastSeen).getTime() <= 60 * 60 * 1000).sort((a, b) => servers[a].name.localeCompare(servers[b].name)).map((s) => /* html */`
                    <div>${Common.htmlEncode(servers[s].name)}</div>
                    <div>${servers[s].ip}</div>
                    <div>
                        ${servers[s].map && servers[s].map.length > 0 ? /* html */`
                            <a target="_blank" href="https://overloadmaps.com/${encodeURI(servers[s].map.toLowerCase().replace(/[ _]/g, "-"))}">${Common.htmlEncode(servers[s].map)}</a>
                        ` : ""}
                    </div>
                    <div>${Common.htmlEncode(servers[s].mode)}</div>
                    <div>${servers[s].numPlayers || 0}/${servers[s].maxNumPlayers || 0}</div>
                    <div><time class="timeago" datetime="${new Date(servers[s].lastSeen).toISOString()}">${new Date(servers[s].lastSeen)}</time></div>
                    <div>
                        ${servers[s].gameStarted ? /* html */`
                            <time class="timeago" datetime="${new Date(servers[s].gameStarted).toISOString()}">${new Date(servers[s].gameStarted)}</time>
                        ` : ""}
                    </div>
                    <div>${Common.htmlEncode(servers[s].notes)}</div>
                `).join("")}
                ${Object.keys(servers).filter((s) => now.getTime() - new Date(servers[s].lastSeen).getTime() > 60 * 60 * 1000).sort((a, b) => servers[a].name.localeCompare(servers[b].name)).map((s) => /* html */`
                    <div class="old">${Common.htmlEncode(servers[s].name)}</div>
                    <div class="old">${servers[s].ip}</div>
                    <div class="old">
                        ${servers[s].map && servers[s].map.length > 0 ? /* html */`
                            <a target="_blank" href="https://overloadmaps.com/${encodeURI(servers[s].map.toLowerCase().replace(/[ _]/g, "-"))}">${Common.htmlEncode(servers[s].map)}</a>
                        ` : ""}
                    </div>
                    <div class="old">${Common.htmlEncode(servers[s].mode)}</div>
                    <div class="old">${servers[s].numPlayers || 0}/${servers[s].maxNumPlayers || 0}</div>
                    <div class="old"><time class="timeago" datetime="${new Date(servers[s].lastSeen).toISOString()}">${new Date(servers[s].lastSeen)}</time></div>
                    <div class="old">
                        ${servers[s].gameStarted ? /* html */`
                            <time class="timeago" datetime="${new Date(servers[s].gameStarted).toISOString()}">${new Date(servers[s].gameStarted)}</time>
                        ` : ""}
                    </div>
                    <div class="old">${Common.htmlEncode(servers[s].notes)}</div>
                `).join("")}
            </div>
        `, req);

        res.status(200).send(HtmlMinifier.minify(html, settings.HtmlMinifier));
    }
}

Home.route = {
    path: "/"
};

module.exports = Home;
