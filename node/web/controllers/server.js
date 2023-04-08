/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const Common = require("../includes/common"),
    RouterBase = require("hot-router").RouterBase,
    ServerView = require("../../public/views/server");

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
class Server extends RouterBase {
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

        route.path = "/server";

        return route;
    }

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

module.exports = Server;
