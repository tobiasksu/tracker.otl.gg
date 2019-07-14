/**
 * @typedef {import("./player")} Player
 * @typedef {{ip: string, settings?: object, server?: string, start?: Date, end?: Date, players: Player[], kills: object[], goals: object[], events: object[], damage?: object[], teamScore: Object<string, number>}} GameData
 */

const ServersDb = require("../database/servers");

/**
 * @type {Object<string, Game>}
 */
const games = {};

//   ###
//  #   #
//  #       ###   ## #    ###
//  #          #  # # #  #   #
//  #  ##   ####  # # #  #####
//  #   #  #   #  # # #  #
//   ###    ####  #   #   ###
/**
 * A class that represents a game.
 */
class Game {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * Creates a new game from the data provided.
     * @param {GameData} data The data to create the game with.
     */
    constructor(data) {
        this.ip = data.ip;
        this.settings = data.settings;
        this.server = data.server;
        this.start = data.start;
        this.end = data.end;
        this.players = data.players;
        this.kills = data.kills;
        this.goals = data.goals;
        this.events = data.events;
        this.damage = data.damage;
        this.teamScore = data.teamScore;
    }

    //              #     ##
    //              #    #  #
    //  ###   ##   ###   #      ###  # #    ##
    // #  #  # ##   #    # ##  #  #  ####  # ##
    //  ##   ##     #    #  #  # ##  #  #  ##
    // #      ##     ##   ###   # #  #  #   ##
    //  ###
    /**
     * Gets the game data for the specified IP, or creates it if it doesn't exit.
     * @param {string} ip The IP to get the game data for.
     * @returns {Promise<Game>} The game data.
     */
    static async getGame(ip) {
        if (!games[ip]) {
            games[ip] = new Game({
                ip,
                players: [],
                kills: [],
                goals: [],
                events: [],
                teamScore: {}
            });

            const server = await ServersDb.getByIp(ip);

            games[ip].setServer(server);
        }

        return games[ip];
    }

    //               #     ##
    //               #    #  #
    //  ###    ##   ###    #     ##   ###   # #    ##   ###
    // ##     # ##   #      #   # ##  #  #  # #   # ##  #  #
    //   ##   ##     #    #  #  ##    #     # #   ##    #
    // ###     ##     ##   ##    ##   #      #     ##   #
    /**
     * Sets the server for the game.
     * @param {string} server The server.
     * @returns {void}
     */
    setServer(server) {
        this.server = server;
    }
}

module.exports = Game;
