/**
 * @typedef {import("../../public/js/common/game")} Game
 */

const Db = require("../database/completed"),
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
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets a completed game by ID.
     * @param {number} id The Game ID.
     * @param {boolean} [includeServer] Whether to include server information.  Defaults to true.
     * @returns {Promise<Game>} A promise that resolves with the game.
     */
    static async get(id, includeServer = true) {
        const game = await Db.get(id);

        if (game) {
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
     * @returns {Promise<{games: Game[], count: number}>} A promise that resolves with the recent games.
     */
    static async getList(page) {
        const gamesList = await Db.getList(page, 25);

        const games = gamesList.games.map((game) => {
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

            return game;
        });

        const count = gamesList.count,
            servers = {};

        for (const game of games) {
            Object.keys(game).forEach((key) => {
                if (["settings", "teamScore", "players"].indexOf(key) === -1) {
                    delete game[key];
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
     * @returns {Promise<Game[]>} A promise that resolves with the recent games.
     */
    static async getRecent() {
        const gamesList = await Db.getRecent();

        const games = gamesList.map((game) => {
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

            return game;
        });

        const servers = {};

        for (const game of games) {
            servers[game.ip] ||= await ServersDb.getByIp(game.ip);
            game.server = servers[game.ip];
        }

        return games.filter((g) => g.events && g.events.length && g.events.length > 0);
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
     * @returns {Promise<{games: Game[], count: number}>} A promise that resolves with the recent games.
     */
    static async search(query, page) {
        const gamesList = await Db.search(query, page, 25);

        const games = gamesList.games.map((game) => {
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

            return game;
        });

        const count = gamesList.count,
            servers = {};

        for (const game of games) {
            servers[game.ip] ||= await ServersDb.getByIp(game.ip);
            game.server = servers[game.ip];
        }

        return {games, count};
    }
}

module.exports = Completed;