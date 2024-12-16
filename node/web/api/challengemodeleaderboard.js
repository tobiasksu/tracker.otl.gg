const ChallengeModeModel = require("../../src/models/challengemode");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const express = require("express"),
      RouterBase = require("hot-router").RouterBase;

/**
 * A class that handles calls to the website's challenge mode leaderboard API.
 */
class ChallengeModeLeaderboard extends RouterBase {
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

        route.path = "/api/challengemodeleaderboard";
        route.middleware = [express.json()];

        return route;
    }

    /**
     * Processes the request.
     * @param {express.Request} req The request.
     * @param {express.Response} res The response.
     * @returns {Promise} A promise that resolves when the request is complete.
     */
    static async get(req, res) {
        const data = await ChallengeModeModel.getLeaderboard(req.query.levelHash, req.query.difficultyLevelId, req.query.modeId);

        res.status(200).json(data);
    }
}

module.exports = ChallengeModeLeaderboard;