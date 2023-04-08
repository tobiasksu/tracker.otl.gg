const express = require("express"),
    Log = require("@roncli/node-application-insights-logger"),
    RouterBase = require("hot-router").RouterBase,
    Servers = require("../../src/models/servers");

//   ###              #                  #             #
//    #               #                 # #
//    #    # ##    ## #   ###   #   #  #   #  # ##    ##
//    #    ##  #  #  ##  #   #   # #   #   #  ##  #    #
//    #    #   #  #   #  #####    #    #####  ##  #    #
//    #    #   #  #  ##  #       # #   #   #  # ##     #
//   ###   #   #   ## #   ###   #   #  #   #  #       ###
//                                            #
//                                            #
/**
 * A class that handles calls to the website's base API.
 */
class IndexApi extends RouterBase {
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

        route.path = "/api";

        route.middleware = [express.json()];

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
            const servers = {},
                data = await Servers.getVisible();

            data.forEach((s) => {
                servers[s.ip] = s;
            });

            res.status(200).json(servers);
        } catch (err) {
            res.status(500).json({error: "Server error."});
            Log.error(`An error occurred while posting to ${req.method} ${IndexApi.route.path}.`, {err});
        }
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
     * @returns {void}
     */
    static post(req, res) {
        res.status(410).json({error: "As of v2.0, this API no longer exists.  Upgrade olmod on your server."});
    }
}

module.exports = IndexApi;
