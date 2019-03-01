const Servers = require("../servers");

/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

//    #             #
//   # #
//  #   #  # ##    ##
//  #   #  ##  #    #
//  #####  ##  #    #
//  #   #  # ##     #
//  #   #  #       ###
//         #
//         #
/**
 * A class that handles calls to the website's API.
 */
class Api {
    //                     #
    //                     #
    // ###    ##    ###   ###
    // #  #  #  #  ##      #
    // #  #  #  #    ##    #
    // ###    ##   ###      ##
    // #
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {void} A promise that resolves when the request is complete.
     */
    static post(req, res) {
        if (!req.body) {
            res.status(400).send("400 - Bad Request - Invalid body.");
            return;
        }

        Servers.update(req.headers["x-forwarded-for"] || req.ip, req.body);

        res.status(204).send();
    }
}

module.exports = Api.post;
