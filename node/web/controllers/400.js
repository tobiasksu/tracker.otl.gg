const Common = require("../includes/common"),
    BadRequestView = require("../../public/views/400");

/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

//  ####              #  ####                                       #
//   #  #             #  #   #                                      #
//   #  #   ###    ## #  #   #   ###    ## #  #   #   ###    ###   ####
//   ###       #  #  ##  ####   #   #  #  ##  #   #  #   #  #       #
//   #  #   ####  #   #  # #    #####  #  ##  #   #  #####   ###    #
//   #  #  #   #  #  ##  #  #   #       ## #  #  ##  #          #   #  #
//  ####    ####   ## #  #   #   ###       #   ## #   ###   ####     ##
//                                         #
//                                         #
/**
 * A class that represents the 400 page.
 */
class BadRequest {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {Promise} A promise that resolves when the request is processed
     */
    static async get(req, res) {
        res.status(400).send(await Common.page(
            "",
            {
                css: ["/css/error.css"]
            },
            BadRequestView.get({message: "This page does not exist."}),
            req
        ));
    }
}

BadRequest.route = {
    path: "/400"
};

module.exports = BadRequest;
