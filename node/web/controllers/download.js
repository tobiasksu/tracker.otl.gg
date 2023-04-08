/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const RouterBase = require("hot-router").RouterBase;

//  ####                         ##                      #
//   #  #                         #                      #
//   #  #   ###   #   #  # ##     #     ###    ###    ## #
//   #  #  #   #  #   #  ##  #    #    #   #      #  #  ##
//   #  #  #   #  # # #  #   #    #    #   #   ####  #   #
//   #  #  #   #  # # #  #   #    #    #   #  #   #  #  ##
//  ####    ###    # #   #   #   ###    ###    ####   ## #
/**
 * A class that forwards to the getting started page.
 */
class Download extends RouterBase {
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

        route.path = "/download";

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
     * @returns {void} A promise that resolves when the request is complete.
     */
    static get(req, res) {
        res.redirect(301, "/getting-started");
    }
}

module.exports = Download;
