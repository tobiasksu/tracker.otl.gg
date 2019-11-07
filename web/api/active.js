const Game = require("../../src/models/game");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//   ###              #
//    #               #
//    #    # ##    ## #   ###   #   #
//    #    ##  #  #  ##  #   #   # #
//    #    #   #  #   #  #####    #
//    #    #   #  #  ##  #       # #
//   ###   #   #   ## #   ###   #   #
/**
 * A class that handles calls to the website's active API.
 */
class Active {
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
        res.status(200).json(Game.getAll());
    }
}

Active.route = {
    path: "/api/active"
};

module.exports = Active;
