const Common = require("../includes/common"),
    HomeView = require("../../public/views/home"),
    Servers = require("../../src/models/servers");

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
        const servers = (await Servers.getVisible()).filter((s) => s.name);

        res.status(200).send(Common.page(/* html */`
            <link rel="stylesheet" href="/css/home.css" />
            <script src="/js/timeago.min.js"></script>
            <script src="/views/home/server.js"></script>
            <script src="/views/home/servers.js"></script>
            <script src="/js/home.js"></script>
            <meta http-equiv="refresh" content="60" />
        `, HomeView.get(servers), req));
    }
}

Home.route = {
    path: "/"
};

module.exports = Home;
