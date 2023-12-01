/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const Completed = require("../../src/models/completed"),
    Log = require("@roncli/node-application-insights-logger"),
    RouterBase = require("hot-router").RouterBase;

//   ###                               #        #             #
//  #   #                              #       # #
//  #       ###    ###   # ##    ###   # ##   #   #  # ##    ##
//   ###   #   #      #  ##  #  #   #  ##  #  #   #  ##  #    #
//      #  #####   ####  #      #      #   #  #####  ##  #    #
//  #   #  #      #   #  #      #   #  #   #  #   #  # ##     #
//   ###    ###    ####  #       ###   #   #  #   #  #       ###
//                                                   #
//                                                   #
/**
 * A class that handles calls to the website's game list API.
 */
class SearchApi extends RouterBase {
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

        route.path = "/api/search";

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
            const page = Number.parseInt(`${req.query.page}`, 10);
            if (isNaN(page)) {
                res.status(400).send("400 - Bad Request - Invalid querystring.");
                return;
            }

            if (!page) {
                res.status(400).send("400 - Bad Request - Invalid querystring.");
                return;
            }

            // Ensure the IPs, game types, players, maps, and scores are arrays, or return a 400.
            if (req.query.ips && !Array.isArray(req.query.ips)) {
                res.status(400).send("400 - Bad Request - Invalid querystring.");
                return;
            }

            if (req.query.gameTypes && !Array.isArray(req.query.gameTypes)) {
                res.status(400).send("400 - Bad Request - Invalid querystring.");
                return;
            }

            if (req.query.players && !Array.isArray(req.query.players)) {
                res.status(400).send("400 - Bad Request - Invalid querystring.");
                return;
            }

            if (req.query.maps && !Array.isArray(req.query.maps)) {
                res.status(400).send("400 - Bad Request - Invalid querystring.");
                return;
            }

            // Also ensure the scores are all numbers.
            if (req.query.scores && (!Array.isArray(req.query.scores) || /** @type {string[]} */(req.query.scores).some((s) => isNaN(+s)))) { // eslint-disable-line no-extra-parens
                res.status(400).send("400 - Bad Request - Invalid querystring.");
                return;
            }

            const ips = req.query.ips ? Array.from(new Set(/** @type {string[]} */(req.query.ips))) : []; // eslint-disable-line no-extra-parens
            const gameTypes = req.query.gameTypes ? Array.from(new Set(/** @type {string[]} */(req.query.gameTypes))) : []; // eslint-disable-line no-extra-parens
            const players = req.query.players ? Array.from(new Set(/** @type {string[]} */(req.query.players))) : []; // eslint-disable-line no-extra-parens
            const maps = req.query.maps ? Array.from(new Set(/** @type {string[]} */(req.query.maps))) : []; // eslint-disable-line no-extra-parens
            const scores = req.query.scores ? Array.from(new Set(/** @type {string[]} */(req.query.scores).map((s) => +s))) : []; // eslint-disable-line no-extra-parens

            if (ips.length > 5) {
                res.status(400).send("400 - Bad Request - Too many search parameters.");
                return;
            }

            if (gameTypes.length > 5) {
                res.status(400).send("400 - Bad Request - Too many search parameters.");
                return;
            }

            if (players.length > 8) {
                res.status(400).send("400 - Bad Request - Too many search parameters.");
                return;
            }

            if (maps.length > 5) {
                res.status(400).send("400 - Bad Request - Too many search parameters.");
                return;
            }

            if (scores.length > 2) {
                res.status(400).send("400 - Bad Request - Too many search parameters.");
                return;
            }

            const games = (await Completed.search(ips, gameTypes, players, maps, scores, req.query.page ? +req.query.page : void 0)).games;

            res.status(200).json({games});
        } catch (err) {
            res.status(500).json({error: "Server error."});
            Log.error(`An error occurred while posting to ${req.method} ${SearchApi.route.path}.`, {err});
        }
    }
}

module.exports = SearchApi;
