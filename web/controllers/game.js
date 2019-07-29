const Common = require("../includes/common"),
    GameModel = require("../../src/models/game"),
    GameView = require("../../public/views/game.js"),
    NotFoundView = require("../../public/views/404");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//   ###
//  #   #
//  #       ###   ## #    ###
//  #          #  # # #  #   #
//  #  ##   ####  # # #  #####
//  #   #  #   #  # # #  #
//   ###    ####  #   #   ###
/**
 * A class that represents the game page.
 */
class Game {
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
     * @returns {void}
     */
    static get(req, res) {
        const ip = req.params.ip,
            game = JSON.parse(JSON.stringify(GameModel.getByIp(ip)));

        if (!game) {
            res.status(404).send(Common.page("", NotFoundView.get({message: "Game not found."}), req));
            return;
        }

        game.condition = GameModel.getCondition(game);

        res.status(200).send(Common.page(/* html */`
            <link rel="stylesheet" href="/css/home.css" />
            <script src="/views/game/details.js"></script>
            <script src="/views/game/players.js"></script>
            <script src="/views/game/events.js"></script>
            <script src="/js/countdown.js"></script>
            <script src="/js/elapsed.js"></script>
            <script src="/js/game.js"></script>
            <meta http-equiv="refresh" content="60" />
        `, GameView.get(game), req));
    }
}

Game.route = {
    path: "/game/:ip"
};

module.exports = Game;
