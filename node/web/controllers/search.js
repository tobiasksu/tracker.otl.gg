const Common = require("../includes/common"),
    Completed = require("../../src/models/completed"),
    SearchView = require("../../public/views/search");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//   ###                               #
//  #   #                              #
//  #       ###    ###   # ##    ###   # ##
//   ###   #   #      #  ##  #  #   #  ##  #
//      #  #####   ####  #      #      #   #
//  #   #  #      #   #  #      #   #  #   #
//   ###    ###    ####  #       ###   #   #
/**
 * A class that represents the search page.
 */
class Search {
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
        const q = (`${req.query.q}` || "").substr(0, 100);

        let games, count;
        if (!q || q.trim().length === 0) {
            ({games, count} = await Completed.getList(1));
        } else {
            ({games, count} = await Completed.search(q, 1));
        }

        res.status(200).send(await Common.page(
            "",
            {
                js: [
                    "/views/gamelist/game.js",
                    "/views/gamelist/games.js",
                    "/js/search.js"
                ],
                css: ["/css/gamelist.css"]
            },
            SearchView.get({games, count, q}),
            req
        ));
    }
}

Search.route = {
    path: "/search"
};

module.exports = Search;
