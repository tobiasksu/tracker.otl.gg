/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const Common = require("../includes/common"),
    Completed = require("../../src/models/completed"),
    Game = require("../../src/models/game"),
    RouterBase = require("hot-router").RouterBase,
    Servers = require("../../src/models/servers"),
    SummaryView = require("../../public/views/summary");

//   ###
//  #   #
//  #      #   #  ## #   ## #    ###   # ##   #   #
//   ###   #   #  # # #  # # #      #  ##  #  #   #
//      #  #   #  # # #  # # #   ####  #      #  ##
//  #   #  #  ##  # # #  # # #  #   #  #       ## #
//   ###    ## #  #   #  #   #   ####  #          #
//                                            #   #
//                                             ###
/**
 * A class that represents the summary page.
 */
class Summary extends RouterBase {
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

        route.path = "/summary";

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

        res.status(200).send(await Common.page(
            "",
            {
                js: [
                    "/js/common/timeago.min.js",
                    "/js/common/clipboard.min.js",
                    "/js/common/clipboardHandler.js",
                    "/js/summary.js"
                ],
                css: ["/css/summary.css"]
            },
            SummaryView.get(completed, games, servers),
            req
        ));
    }
}

module.exports = Summary;
