/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const Common = require("../includes/common"),
    Completed = require("../../src/models/completed"),
    GameListView = require("../../public/views/gamelist"),
    RouterBase = require("hot-router").RouterBase;

//   ###                        #        #            #
//  #   #                       #                     #
//  #       ###   ## #    ###   #       ##     ###   ####
//  #          #  # # #  #   #  #        #    #       #
//  #  ##   ####  # # #  #####  #        #     ###    #
//  #   #  #   #  # # #  #      #        #        #   #  #
//   ###    ####  #   #   ###   #####   ###   ####     ##
/**
 * A class that represents the game list page.
 */
class GameList extends RouterBase {
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

        route.path = "/gamelist";

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
     * @returns {Promise} A promise that resolves when the request is complete.
     */
    static async get(req, res) {
        const {games, count} = await Completed.getList(1);

        res.status(200).send(await Common.page(
            "",
            {
                js: [
                    "/js/common/timeago.min.js",
                    "/js/common/encoding.js",
                    "/js/common/template.js",
                    "/js/common/time.js",
                    "/views/gamelist/game.js",
                    "/views/gamelist/games.js",
                    "/js/gamelist.js"
                ],
                css: ["/css/gamelist.css"]
            },
            GameListView.get({games, count}),
            req
        ));
    }
}

module.exports = GameList;
