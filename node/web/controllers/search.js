/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const BadRequestView = require("../../public/views/400"),
    Common = require("../includes/common"),
    Completed = require("../../src/models/completed"),
    RouterBase = require("hot-router").RouterBase,
    SearchView = require("../../public/views/search"),
    Servers = require("../../src/models/servers");

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
class Search extends RouterBase {
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

        route.path = "/search";

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
        let games, count, servers;

        if (Object.keys(req.query).length > 0) {
            // Ensure the IPs, game types, players, maps, and scores are arrays, or return a 400.
            if (req.query.ips && !Array.isArray(req.query.ips)) {
                res.status(400).send(await Common.page(
                    "",
                    {
                        css: ["/css/error.css"]
                    },
                    BadRequestView.get(),
                    req
                ));
                return;
            }

            if (req.query.maps && !Array.isArray(req.query.maps)) {
                res.status(400).send(await Common.page(
                    "",
                    {
                        css: ["/css/error.css"]
                    },
                    BadRequestView.get(),
                    req
                ));
                return;
            }

            if (req.query.players && !Array.isArray(req.query.players)) {
                res.status(400).send(await Common.page(
                    "",
                    {
                        css: ["/css/error.css"]
                    },
                    BadRequestView.get(),
                    req
                ));
                return;
            }

            if (req.query.gameTypes && !Array.isArray(req.query.gameTypes)) {
                res.status(400).send(await Common.page(
                    "",
                    {
                        css: ["/css/error.css"]
                    },
                    BadRequestView.get(),
                    req
                ));
                return;
            }

            // Also ensure the scores are all numbers.
            if (req.query.scores && (!Array.isArray(req.query.scores) || /** @type {string[]} */(req.query.scores).some((s) => isNaN(+s)))) { // eslint-disable-line no-extra-parens
                res.status(400).send(await Common.page(
                    "",
                    {
                        css: ["/css/error.css"]
                    },
                    BadRequestView.get(),
                    req
                ));
                return;
            }

            // Get the data for the page.
            [{games, count}, servers] = await Promise.all([
                Completed.search(/** @type {string[]}*/(req.query.ips), /** @type {string[]} */(req.query.gameTypes), /** @type {string[]} */(req.query.players), /** @type {string[]} */(req.query.maps), req.query.scores ? /** @type {string[]} */(req.query.scores).map((s) => +s) : [], req.query.page ? +req.query.page : void 0), // eslint-disable-line no-extra-parens
                Servers.getVisibleByNameAndIP()
            ]);
        } else {
            games = [];
            count = 0;
            servers = await Servers.getVisibleByNameAndIP();
        }

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
                    "/views/search/server.js",
                    "/js/search.js"
                ],
                css: ["/css/gamelist.css"]
            },
            SearchView.get({games, count, servers, ips: /** @type {string[]}*/(req.query.ips), maps: /** @type {string[]}*/(req.query.maps), players: /** @type {string[]}*/(req.query.players), gameTypes: /** @type {string[]}*/(req.query.gameTypes), scores: req.query.scores ? /** @type {string[]} */(req.query.scores).map((s) => +s) : []}), // eslint-disable-line no-extra-parens
            req
        ));
    }
}

module.exports = Search;
