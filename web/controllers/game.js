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

        if (game.projectedEnd) {
            game.countdown = new Date(game.projectedEnd).getTime() - new Date().getTime();
            delete game.projectedEnd;
        }

        if (game.startTime) {
            game.elapsed = new Date().getTime() - new Date(game.startTime).getTime();
            delete game.startTime;
        }

        game.condition = GameModel.getCondition(game);

        res.setHeader("Cache-Control", "no-cache, max-age=0, must-revalidate, no-store");

        res.status(200).send(Common.page(/* html */`
            <link rel="stylesheet" href="/css/game.css" />
            <script src="/js/common/timeago.min.js"></script>
            <script src="/views/common/score.js"></script>
            <script src="/views/common/details.js"></script>
            <script src="/views/common/players.js"></script>
            <script src="/views/common/events.js"></script>
            <script src="/js/common/websocketclient.js"></script>
            <script src="/js/common/countdown.js"></script>
            <script src="/js/common/elapsed.js"></script>
            <script src="/js/common/player.js"></script>
            <script src="/js/common/game.js"></script>
            <script src="/js/game.js"></script>
        `, GameView.get(game), req));
    }
}

Game.route = {
    path: "/game/:ip"
};

module.exports = Game;
