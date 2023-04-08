/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

const Game = require("../../src/models/game"),
    Log = require("@roncli/node-application-insights-logger"),
    RouterBase = require("hot-router").RouterBase,
    Servers = require("../../src/models/servers");

//  ####                                               #             #
//   #  #                                             # #
//   #  #  # ##    ###   #   #   ###    ###   # ##   #   #  # ##    ##
//   ###   ##  #  #   #  #   #  #      #   #  ##  #  #   #  ##  #    #
//   #  #  #      #   #  # # #   ###   #####  #      #####  ##  #    #
//   #  #  #      #   #  # # #      #  #      #      #   #  # ##     #
//  ####   #       ###    # #   ####    ###   #      #   #  #       ###
//                                                          #
//                                                          #
/**
 * A class that handles calls to the browser API.
 */
class BrowserApi extends RouterBase {
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

        route.path = "/api/browser";

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
        try {
            /** @type {Game[]} */
            const games = JSON.parse(JSON.stringify(Game.getAll())),
                servers = await Servers.getVisible();

            res.status(200).json(servers.map((s) => {
                const result = {
                    server: {
                        ip: s.ip,
                        name: s.name,
                        serverNotes: s.notes,
                        lastSeen: s.lastSeen,
                        online: !s.old,
                        version: s.version
                    }
                };

                const game = games.find((g) => g.ip === s.ip);

                if (game) {
                    result.game = {
                        gameStarted: s.gameStarted,
                        currentPlayers: game.players.filter((p) => p.connected).length,
                        maxPlayers: game.settings && game.settings.maxPlayers || 0,
                        matchLength: game.settings && game.settings.timeLimit && game.settings.timeLimit || 0,
                        mapName: game.settings && game.settings.level || "",
                        mode: game.settings && game.settings.matchMode || "",
                        jip: game.settings && game.settings.joinInProgress || false,
                        hasPassword: game.settings && game.settings.hasPassword || false,
                        matchNotes: game.settings && game.settings.matchNotes || "",
                        inLobby: game.inLobby,
                        creator: game.settings && game.settings.creator || ""
                    };
                }

                return result;
            }));
        } catch (err) {
            res.status(500).json({error: "Server error."});
            Log.error(`An error occurred while posting to ${req.method} ${BrowserApi.route.path}.`, {err});
        }
    }
}

module.exports = BrowserApi;
