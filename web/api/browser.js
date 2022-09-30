const Game = require("../../src/models/game"),
    Servers = require("../../src/models/servers");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//  ####
//   #  #
//   #  #  # ##    ###   #   #   ###   # ##
//   ###   ##  #  #   #  #   #  #   #  ##  #
//   #  #  #      #   #  # # #  #####  #
//   #  #  #      #   #  # # #  #      #
//  ####   #       ###    # #    ###   #
/**
 * A class that handles calls to the browser API.
 */
class Browser {
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
    }
}

Browser.route = {
    path: "/api/browser"
};

module.exports = Browser;
