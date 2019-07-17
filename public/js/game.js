/* global Player */

/**
 * @typedef {import("./player")} Player
 * @typedef {{ip: string, settings?: object, server?: string, start?: Date, end?: Date, players: Player[], kills: object[], goals: object[], events: object[], damage?: object[], teamScore: Object<string, number>}} GameData
 */

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
    static getGame(ip) {
        if (!Game.games[ip]) {
            Game.games[ip] = new Game({
                ip,
                players: [],
                kills: [],
                goals: [],
                events: [],
                teamScore: {}
            });
        }

        return Game.games[ip];
    }

    //              #    ###   ##
    //              #    #  #   #
    //  ###   ##   ###   #  #   #     ###  #  #   ##   ###
    // #  #  # ##   #    ###    #    #  #  #  #  # ##  #  #
    //  ##   ##     #    #      #    # ##   # #  ##    #
    // #      ##     ##  #     ###    # #    #    ##   #
    //  ###                                 #
    /**
     * Retrieves a player from a game.
     * @param {string} name The name of the player.
     * @returns {Player} The player.
     */
    getPlayer(name) {
        if (!this.players.find((p) => p.name === name)) {
            this.players.push(new Player({
                name,
                kills: 0,
                assists: 0,
                deaths: 0,
                goals: 0,
                goalAssists: 0,
                blunders: 0
            }));
        }

        return this.players.find((p) => p.name === name);
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

/**
 * @type {Object<string, Game>}
 */
Game.games = {};
