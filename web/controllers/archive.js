const Common = require("../includes/common"),
    Completed = require("../../src/models/completed"),
    NotFoundView = require("../../public/views/404");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//    #                  #        #
//   # #                 #
//  #   #  # ##    ###   # ##    ##    #   #   ###
//  #   #  ##  #  #   #  ##  #    #    #   #  #   #
//  #####  #      #      #   #    #     # #   #####
//  #   #  #      #   #  #   #    #     # #   #
//  #   #  #       ###   #   #   ###     #     ###
/**
 * A class that represents an archived game's page.
 */
class Archive {
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
        if (isNaN(Number.parseInt(req.params.id, 10))) {
            res.status(404).send(Common.page("", NotFoundView.get({message: "Game not found."}), req));
            return;
        }

        const game = await Completed.getById(Number.parseInt(req.params.id, 10));

        if (!game) {
            res.status(404).send(Common.page("", NotFoundView.get({message: "Game not found."}), req));
            return;
        }

        res.status(200).send(game);
        //res.status(200).send(Common.page("", DownloadView.get(), req));
    }
}

Archive.route = {
    path: "/archive/:id"
};

module.exports = Archive;
