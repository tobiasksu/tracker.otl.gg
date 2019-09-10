const Common = require("../includes/common"),
    Completed = require("../../src/models/completed"),
    Game = require("../../src/models/game"),
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
        const completed = await Completed.getRecent(),
            games = JSON.parse(JSON.stringify(Game.getAll())),
            servers = (await Servers.getVisible()).filter((s) => s.name);

        games.forEach((game) => {
            if (game.projectedEnd) {
                game.countdown = new Date(game.projectedEnd).getTime() - new Date().getTime();
                delete game.projectedEnd;
            }

            if (game.startTime) {
                game.elapsed = new Date().getTime() - new Date(game.startTime).getTime();
                delete game.startTime;
            }

            game.condition = Game.getCondition(game);
        });

        completed.forEach((game) => {
            game.remaining = Math.max(new Date(game.data.end).getTime() + 3600000 - new Date().getTime(), 1000);

            game.data.condition = Game.getCondition(game.data);
        });

        res.setHeader("Cache-Control", "no-cache, max-age=0, must-revalidate, no-store");

        res.status(200).send(Common.page(/* html */`
            <link rel="stylesheet" href="/css/home.css" />
            <script src="/js/common/timeago.min.js"></script>
            <script src="/views/common/score.js"></script>
            <script src="/views/common/details.js"></script>
            <script src="/views/home/games.js"></script>
            <script src="/views/common/completedDetails.js"></script>
            <script src="/views/home/completedGames.js"></script>
            <script src="/views/home/server.js"></script>
            <script src="/views/home/servers.js"></script>
            <script src="/js/common/websocketclient.js"></script>
            <script src="/js/common/countdown.js"></script>
            <script src="/js/common/elapsed.js"></script>
            <script src="/js/common/player.js"></script>
            <script src="/js/common/game.js"></script>
            <script src="/js/home.js"></script>
        `, HomeView.get(completed, games, servers), req));
    }
}

Home.route = {
    path: "/"
};

module.exports = Home;
