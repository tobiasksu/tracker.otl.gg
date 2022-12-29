const Common = require("../includes/common");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//  ####    ##
//  #   #    #
//  #   #    #     ###   #   #   ###   # ##
//  ####     #        #  #   #  #   #  ##  #
//  #        #     ####  #  ##  #####  #
//  #        #    #   #   ## #  #      #
//  #       ###    ####      #   ###   #
//                       #   #
//                        ###
/**
 * A class that represents the player page.
 */
class Player {
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
        const q = req.query.q || "";

        res.status(200).send(await Common.page(
            "",
            {
                js: [
                    "/views/gamelist/game.js",
                    "/views/gamelist/games.js",
                    "/js/search.js"
                ],
                css: ["/css/gamelist.css"]
            },
            PlayerView.get({q}),
            req
        ));
    }
}

Player.route = {
    path: "/player"
};

module.exports = Player;
