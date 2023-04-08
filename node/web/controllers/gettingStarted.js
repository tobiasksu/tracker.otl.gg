/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const Common = require("../includes/common"),
    GettingStartedView = require("../../public/views/gettingStarted"),
    RouterBase = require("hot-router").RouterBase;

//   ###           #      #       #                   ###    #                    #                #
//  #   #          #      #                          #   #   #                    #                #
//  #       ###   ####   ####    ##    # ##    ## #  #      ####    ###   # ##   ####    ###    ## #
//  #      #   #   #      #       #    ##  #  #  #    ###    #         #  ##  #   #     #   #  #  ##
//  #  ##  #####   #      #       #    #   #   ##        #   #      ####  #       #     #####  #   #
//  #   #  #       #  #   #  #    #    #   #  #      #   #   #  #  #   #  #       #  #  #      #  ##
//   ###    ###     ##     ##    ###   #   #   ###    ###     ##    ####  #        ##    ###    ## #
//                                            #   #
//                                             ###
/**
 * A class that represents the getting started page.
 */
class GettingStarted extends RouterBase {
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

        route.path = "/getting-started";

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
     * @returns {Promise} A promise that resolves when the request is processed
     */
    static async get(req, res) {
        res.status(200).send(await Common.page("", {}, GettingStartedView.get(), req));
    }
}

module.exports = GettingStarted;
