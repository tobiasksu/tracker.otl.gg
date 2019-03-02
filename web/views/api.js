const Servers = require("../../servers");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
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
     * @returns {void} A promise that resolves when the request is complete.
     */
    static get(req, res) {
        res.status(200).send(Servers.servers);
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
     * @returns {void} A promise that resolves when the request is complete.
     */
    static post(req, res) {
        if (!req.body) {
            res.status(400).send("400 - Bad Request - Invalid body.");
            return;
        }

        console.log(req.headers["x-forwarded-for"]);
        console.log(req.ip);
        Servers.update((req.headers["x-forwarded-for"] ? `${req.headers["x-forwarded-for"]}` : void 0) || req.ip, req.body);

        res.status(204).send();
    }
}

Api.route = {
    path: "/api"
};

module.exports = Api;
