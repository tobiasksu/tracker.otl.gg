/**
 * @typedef {import("../../../types/node/gameTypes").GameData} GameTypes.GameData
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
     * @param {GameTypes.GameData} data The data to create the game with.
     */
    constructor(data) {
        this.ip = data.ip;
        this.settings = data.settings;
        this.server = data.server;
        this.start = data.start;
        this.end = data.end;
        this.players = data.players || [];
        this.kills = data.kills || [];
        this.goals = data.goals || [];
        this.flagStats = data.flagStats || [];
        this.events = data.events || [];
        this.damage = data.damage || [];
        this.teamScore = data.teamScore || {};
        this.teamChanges = data.teamChanges || [];
        this.countdown = data.countdown;
        this.elapsed = /** @type {number} */(void 0); // eslint-disable-line no-extra-parens
        this.inLobby = /** @type {boolean} */(void 0); // eslint-disable-line no-extra-parens
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
     * @returns {Game} The game data.
     */
    static getGame(ip) {
        let game = Game.games.find((g) => g.ip === ip);
        if (!game) {
            Game.games.push(game = new Game({ip}));
        }

        return game;
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
     * @returns {InstanceType<Game.Player>} The player. // TODO: Fix return type.
     */
    getPlayer(name) {
        if (!name) {
            return void 0;
        }

        const players = this.players.find((p) => p.name === name);

        if (!players) {
            const player = new Game.Player({
                name,
                kills: 0,
                assists: 0,
                deaths: 0,
                goals: 0,
                goalAssists: 0,
                blunders: 0,
                returns: 0,
                pickups: 0,
                captures: 0,
                carrierKills: 0
            });
            this.players.push(player);
            return player;
        }

        return void 0;
    }

    // ###    ##   # #    ##   # #    ##
    // #  #  # ##  ####  #  #  # #   # ##
    // #     ##    #  #  #  #  # #   ##
    // #      ##   #  #   ##    #     ##
    /**
     * Removes a game from the list of games.
     * @returns {void}
     */
    remove() {
        Game.games.splice(Game.games.indexOf(this), 1);
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

/** @type {Game[]} */
Game.games = [];

/** @type {typeof import("./player")} */
// @ts-ignore
Game.Player = typeof Player === "undefined" ? require("./player") : Player; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.Game = Game;
} else {
    module.exports = Game; // eslint-disable-line no-undef
}
