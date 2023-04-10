/**
 * @typedef {{id: number, ip: string, data: object, date: Date, remaining?: number, server?: object}} CompletedGame
 */

const Db = require("../database/completed"),
    Game = require("../../public/js/common/game"),
    ServersDb = require("../database/servers");

//   ###                         ##            #                #
//  #   #                         #            #                #
//  #       ###   ## #   # ##     #     ###   ####    ###    ## #
//  #      #   #  # # #  ##  #    #    #   #   #     #   #  #  ##
//  #      #   #  # # #  ##  #    #    #####   #     #####  #   #
//  #   #  #   #  # # #  # ##     #    #       #  #  #      #  ##
//   ###    ###   #   #  #       ###    ###     ##    ###    ## #
//                       #
//                       #
/**
 * A class that represents completed games.
 */
class Completed {
    //              #     ##   ##    ##    ###      #
    //              #    #  #   #     #     #       #
    //  ###   ##   ###   #  #   #     #     #     ###   ###
    // #  #  # ##   #    ####   #     #     #    #  #  ##
    //  ##   ##     #    #  #   #     #     #    #  #    ##
    // #      ##     ##  #  #  ###   ###   ###    ###  ###
    //  ###
    /**
     * Gets all IDs for completed games.
     * @returns {Promise<number[]>} A promise that resolves with the list of completed IDs.
     */
    static getAllIds() {
        return Db.getAllIds();
    }

    //              #    ###         ###      #
    //              #    #  #         #       #
    //  ###   ##   ###   ###   #  #   #     ###
    // #  #  # ##   #    #  #  #  #   #    #  #
    //  ##   ##     #    #  #   # #   #    #  #
    // #      ##     ##  ###     #   ###    ###
    //  ###                     #
    /**
     * Gets a completed game by ID.
     * @param {number} id The Game ID.
     * @param {boolean} [includeServer] Whether to include server information.  Defaults to true.
     * @returns {Promise<Game>} A promise that resolves with the game.
     */
    static async getById(id, includeServer = true) {
        /**
         * @type {CompletedGame}
         */
        const completedGame = await Db.getById(id);

        /**
         * @type {Game}
         */
        let game;

        if (completedGame) {
            completedGame.data = JSON.parse(completedGame.data);
            if (includeServer) {
                completedGame.server = await ServersDb.getByIp(completedGame.ip);
            }

            game = new Game({
                ip: completedGame.ip,
                server: completedGame.server,
                settings: completedGame.data.settings,
                start: completedGame.data.start,
                end: completedGame.data.end,
                players: completedGame.data.players,
                kills: completedGame.data.kills,
                goals: completedGame.data.goals,
                flagStats: completedGame.data.flagStats,
                events: completedGame.data.events,
                damage: completedGame.data.damage,
                teamScore: completedGame.data.teamScore,
                teamChanges: completedGame.data.teamChanges
            });

            if (game.events) {
                game.events.sort((a, b) => a.time - b.time);
            }

            const damage = [];

            game.damage.forEach((dmg) => {
                const stat = damage.find((d) => d.attacker === dmg.attacker && d.defender === dmg.defender && d.weapon === dmg.weapon);

                if (stat) {
                    stat.damage += dmg.damage;
                } else {
                    damage.push({
                        attacker: dmg.attacker,
                        defender: dmg.defender,
                        weapon: dmg.weapon,
                        damage: dmg.damage
                    });
                }
            });

            game.damage = damage;

            if (!includeServer) {
                delete game.server;
            }
        }

        return game;
    }

    //              #    ###               ###         ###      #
    //              #    #  #              #  #         #       #
    //  ###   ##   ###   #  #   ###  #  #  ###   #  #   #     ###
    // #  #  # ##   #    ###   #  #  #  #  #  #  #  #   #    #  #
    //  ##   ##     #    # #   # ##  ####  #  #   # #   #    #  #
    // #      ##     ##  #  #   # #  ####  ###     #   ###    ###
    //  ###                                       #
    /**
     * Gets a completed game's raw data by ID.
     * @param {number} id The Game ID.
     * @returns {Promise<object>} A promise that resolves with the raw game data.
     */
    static getRawById(id) {
        return Db.getById(id);
    }

    //              #    #      #            #
    //              #    #                   #
    //  ###   ##   ###   #     ##     ###   ###
    // #  #  # ##   #    #      #    ##      #
    //  ##   ##     #    #      #      ##    #
    // #      ##     ##  ####  ###   ###      ##
    //  ###
    /**
     * Gets the paginated list of games.
     * @param {number} page The page number.
     * @returns {Promise<{games: {id: number, ip: string, data: object, date: Date}[], count: number}>} A promise that resolves with the recent games.
     */
    static async getList(page) {
        const gamesList = await Db.getList(page, 25);

        /** @type {CompletedGame[]} */
        const games = gamesList.games;

        const count = gamesList.count,
            servers = {};

        for (const game of games) {
            game.data = JSON.parse(game.data);
            Object.keys(game.data).forEach((key) => {
                if (["settings", "teamScore", "players"].indexOf(key) === -1) {
                    delete game.data[key];
                }
            });
            servers[game.ip] ||= await ServersDb.getByIp(game.ip);
            game.server = servers[game.ip];
        }

        return {games, count};
    }

    //              #    ###                            #
    //              #    #  #                           #
    //  ###   ##   ###   #  #   ##    ##    ##   ###   ###
    // #  #  # ##   #    ###   # ##  #     # ##  #  #   #
    //  ##   ##     #    # #   ##    #     ##    #  #   #
    // #      ##     ##  #  #   ##    ##    ##   #  #    ##
    //  ###
    /**
     * Gets the games that completed within the past hour.
     * @returns {Promise<CompletedGame[]>} A promise that resolves with the recent games.
     */
    static async getRecent() {
        /**
         * @type {CompletedGame[]}
         */
        const games = await Db.getRecent(),
            servers = {};

        for (const game of games) {
            game.remaining = 3600000 + game.date.getTime() + new Date().getTime();
            game.data = JSON.parse(game.data);
            servers[game.ip] ||= await ServersDb.getByIp(game.ip);
            game.server = servers[game.ip];
        }

        return games.filter((g) => g.data && g.data.events && g.data.events.length && g.data.events.length > 0);
    }

    //                                #
    //                                #
    //  ###    ##    ###  ###    ##   ###
    // ##     # ##  #  #  #  #  #     #  #
    //   ##   ##    # ##  #     #     #  #
    // ###     ##    # #  #      ##   #  #
    /**
     * Gets the paginated list of games by user search.
     * @param {string} query The query.
     * @param {number} page The page number.
     * @returns {Promise<{games: {id: number, ip: string, data: object, date: Date}[], count: number}>} A promise that resolves with the recent games.
     */
    static async search(query, page) {
        const gamesList = await Db.search(query, page, 25);

        /** @type {CompletedGame[]} */
        const games = gamesList.games;

        const count = gamesList.count,
            servers = {};

        for (const game of games) {
            game.data = JSON.parse(game.data);
            servers[game.ip] ||= await ServersDb.getByIp(game.ip);
            game.server = servers[game.ip];
        }

        return {games, count};
    }

    //                #         #
    //                #         #
    // #  #  ###    ###   ###  ###    ##
    // #  #  #  #  #  #  #  #   #    # ##
    // #  #  #  #  #  #  # ##   #    ##
    //  ###  ###    ###   # #    ##   ##
    //       #
    /**
     * Updates a completed game's raw data.
     * @param {number} id The ID of the game to update.
     * @param {object} data The data to update the game with.
     * @returns {Promise} A promise that resolves when the game is updated.
     */
    static update(id, data) {
        return Db.update(id, data, data.end ? new Date(data.end) : void 0);
    }
}

module.exports = Completed;
