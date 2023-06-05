/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const Completed = require("../../src/models/completed"),
    Log = require("@roncli/node-application-insights-logger"),
    RouterBase = require("hot-router").RouterBase;

//   ###                          #             #
//  #   #                        # #
//  #       ###   ## #    ###   #   #  # ##    ##
//  #          #  # # #  #   #  #   #  ##  #    #
//  #  ##   ####  # # #  #####  #####  ##  #    #
//  #   #  #   #  # # #  #      #   #  # ##     #
//   ###    ####  #   #   ###   #   #  #       ###
//                                     #
//                                     #
/**
 * A class that handles calls to the game API.
 */
class GameApi extends RouterBase {
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

        route.path = "/api/game/:id";

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
        try {
            if (isNaN(Number.parseInt(req.params.id, 10))) {
                res.status(404).json({error: "Game not found."});
                return;
            }

            const game = await Completed.get(Number.parseInt(req.params.id, 10), false);

            if (!game) {
                res.status(404).json({error: "Game not found."});
                return;
            }

            delete game.events;

            res.status(200).json(game);
        } catch (err) {
            res.status(500).json({error: "Server error."});
            Log.error(`An error occurred while posting to ${req.method} ${GameApi.route.path}.`, {err});
        }
    }
}

module.exports = GameApi;
