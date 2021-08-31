const Common = require("../includes/common"),
    GettingStartedView = require("../../public/views/gettingStarted");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

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
class GettingStarted {
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

GettingStarted.route = {
    path: "/getting-started"
};

module.exports = GettingStarted;
