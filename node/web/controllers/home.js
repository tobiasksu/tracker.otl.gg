/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const Common = require("../includes/common"),
    Completed = require("../../src/models/completed"),
    Game = require("../../public/js/common/game"),
    HomeView = require("../../public/views/home"),
    RouterBase = require("hot-router").RouterBase,
    Servers = require("../../src/models/servers");

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
class Home extends RouterBase {
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

        route.path = "/";

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
        const completed = await Completed.getRecent();

        /** @type {Game[]} */
        const games = JSON.parse(JSON.stringify(Game.getAll()));

        const servers = (await Servers.getVisible()).filter((s) => s.name);

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
            game.condition = Game.getCondition(game);
        });

        res.setHeader("Cache-Control", "no-cache, max-age=0, must-revalidate, no-store");

        res.status(200).send(await Common.page(
            "",
            {
                js: [
                    "/js/common/timeago.min.js",
                    "/js/common/clipboard.min.js",
                    "/js/common/clipboardHandler.js",
                    "/views/common/score.js",
                    "/views/common/playerCount.js",
                    "/views/common/details.js",
                    "/views/home/games.js",
                    "/views/common/completedDetails.js",
                    "/views/home/completedGames.js",
                    "/views/home/server.js",
                    "/views/home/servers.js",
                    "/js/common/websocketclient.js",
                    "/js/common/countdown.js",
                    "/js/common/elapsed.js",
                    "/js/common/player.js",
                    "/js/common/game.js",
                    "/js/home.js"
                ],
                css: ["/css/home.css"]
            },
            HomeView.get(completed, games, servers),
            req
        ));
    }
}

module.exports = Home;
