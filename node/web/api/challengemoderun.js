const ChallengeModeModel = require("../../src/models/challengemode");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const express = require("express"),
      RouterBase = require("hot-router").RouterBase;

/**
 * A class that handles calls to the website's challenge mode run API.
 */
class ChallengeModeRunApi extends RouterBase {
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

        route.path = "/api/challengemoderun";
        route.middleware = [express.json()];

        return route;
    }

    /**
     * Processes the request.
     * @param {express.Request} req The request.
     * @param {express.Response} res The response.
     * @returns {Promise} A promise that resolves when the request is complete.
     */
    static async post(req, res) {
        if (!req.body) {
            res.status(400).send("400 - Bad Request - Invalid body.");
            return;
        }
        await ChallengeModeModel.addRun(req.ip, req.body);

        res.status(204).send();
    }
}

module.exports = ChallengeModeRunApi;