const Common = require("../includes/common"),
    DownloadView = require("../../public/views/download");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//  ####                         ##                      #
//   #  #                         #                      #
//   #  #   ###   #   #  # ##     #     ###    ###    ## #
//   #  #  #   #  #   #  ##  #    #    #   #      #  #  ##
//   #  #  #   #  # # #  #   #    #    #   #   ####  #   #
//   #  #  #   #  # # #  #   #    #    #   #  #   #  #  ##
//  ####    ###    # #   #   #   ###    ###    ####   ## #
/**
 * A class that represents the download page.
 */
class Download {
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
        res.status(200).send(Common.page("", DownloadView.get(), req));
    }
}

Download.route = {
    path: "/download"
};

module.exports = Download;
