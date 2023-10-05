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
            if (includeServer) {
                game.server = await ServersDb.getByIp(game.ip);
            }

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

            game.condition = Game.getCondition(game);

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
     * @returns {Promise<{games: Game[], count: number}>} A promise that resolves with the recent games and the total count of games.
     */
    static async getList(page) {
        const gamesList = await Db.getList(page, 25);

        const count = gamesList.count,
            servers = {};

        for (const game of gamesList.games) {
            servers[game.ip] ||= await ServersDb.getByIp(game.ip);
            game.server = servers[game.ip];
        }

        return {games: gamesList.games, count};
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
     * Searches completed games and returns a paginated list.
     * @param {string[]} ips The list of IP addresses to search for.
     * @param {string[]} gameTypes The list of game types to search for.
     * @param {string[]} players The list of players to search for.
     * @param {string[]} maps The list of maps to search for.
     * @param {number[]} scores The list of scores to search for.
     * @param {number} [page] The page number.
     * @returns {Promise<{games: Game[], count: number}>} A promise that resolves with the recent games and the total count of games that match the search.
     */
    static async search(ips, gameTypes, players, maps, scores, page) {
        const gamesList = await Db.search(ips, gameTypes, players, maps, scores, page, 25);

        const count = gamesList.count,
            servers = {};

        for (const game of gamesList.games) {
            servers[game.ip] ||= await ServersDb.getByIp(game.ip);
            game.server = servers[game.ip];
        }

        return {games: gamesList.games, count};
    }
}

module.exports = Completed;
