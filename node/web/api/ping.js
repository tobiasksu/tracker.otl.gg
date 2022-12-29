const Servers = require("../../src/models/servers");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//  ####     #
//  #   #
//  #   #   ##    # ##    ## #
//  ####     #    ##  #  #  #
//  #        #    #   #   ##
//  #        #    #   #  #
//  #       ###   #   #   ###
//                       #   #
//                        ###
/**
 * A class that handles calls to the website's ping API.
 */
class Ping {
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
        if (!req.body) {
            res.status(400).send("400 - Bad Request - Invalid body.");
            return;
        }

        await Servers.update((req.headers["x-forwarded-for"] ? `${req.headers["x-forwarded-for"]}` : void 0) || req.ip, req.body, true);

        res.status(204).send();
    }
}

Ping.route = {
    path: "/api/ping"
};

module.exports = Ping;
