const Common = require("../includes/common"),
    ServerView = require("../../public/views/server");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//   ###
//  #   #
//  #       ###   # ##   #   #   ###   # ##
//   ###   #   #  ##  #  #   #  #   #  ##  #
//      #  #####  #       # #   #####  #
//  #   #  #      #       # #   #      #
//   ###    ###   #        #     ###   #
/**
 * A class that represents the server setup page.
 */
class Server {
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
     * @returns {Promise} A promise that resolves when the request is processed
     */
    static async get(req, res) {
        res.status(200).send(await Common.page("", {}, ServerView.get(), req));
    }
}

Server.route = {
    path: "/server"
};

module.exports = Server;
