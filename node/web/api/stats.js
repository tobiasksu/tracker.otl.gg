const express = require("express"),
    Log = require("@roncli/node-application-insights-logger"),
    RouterBase = require("hot-router").RouterBase,
    Stats = require("../../src/models/stats");

//   ###    #             #              #             #
//  #   #   #             #             # #
//  #      ####    ###   ####    ###   #   #  # ##    ##
//   ###    #         #   #     #      #   #  ##  #    #
//      #   #      ####   #      ###   #####  ##  #    #
//  #   #   #  #  #   #   #  #      #  #   #  # ##     #
//   ###     ##    ####    ##   ####   #   #  #       ###
//                                            #
//                                            #
/**
 * A class that handles calls to the website's stats API.
 */
class StatsApi extends RouterBase {
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

        route.path = "/api/stats";

        route.middleware = [express.json()];

        return route;
    }

    //                     #
    //                     #
    // ###    ##    ###   ###
    // #  #  #  #  ##      #
    // #  #  #  #    ##    #
    // ###    ##   ###      ##
    // #
    /**
     * Processes the request.
     * @param {express.Request} req The request.
     * @param {express.Response} res The response.
     * @returns {Promise} A promise that resolves when the request is complete.
     */
    static async post(req, res) {
        try {
            if (!req.body) {
                res.status(400).send("400 - Bad Request - Invalid body.");
                return;
            }

            await Stats.processStat((req.headers["x-forwarded-for"] ? `${req.headers["x-forwarded-for"]}` : void 0) || req.ip, req.body);

            res.status(204).send();
        } catch (err) {
            res.status(500).json({error: "Server error."});
            Log.error(`An error occurred while posting to ${req.method} ${StatsApi.route.path}.`, {err});
        }
    }
}

module.exports = StatsApi;
