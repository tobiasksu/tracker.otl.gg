const Completed = require("../../src/models/completed");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//   ###                        #        #            #
//  #   #                       #                     #
//  #       ###   ## #    ###   #       ##     ###   ####
//  #          #  # # #  #   #  #        #    #       #
//  #  ##   ####  # # #  #####  #        #     ###    #
//  #   #  #   #  # # #  #      #        #        #   #  #
//   ###    ####  #   #   ###   #####   ###   ####     ##
/**
 * A class that handles calls to the website's game list API.
 */
class GameList {
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
        const page = Number.parseInt(req.query.page, 10);
        if (isNaN(page)) {
            res.status(400).send("400 - Bad Request - Invalid querystring.");
            return;
        }

        if (!page) {
            res.status(400).send("400 - Bad Request - Invalid querystring.");
            return;
        }

        const games = await Completed.getList(page);

        res.status(200).json({games});
    }
}

GameList.route = {
    path: "/api/gamelist"
};

module.exports = GameList;
