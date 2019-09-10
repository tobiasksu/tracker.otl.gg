/**
 * @typedef {{id: number, ip: string, data: object, date: Date, remaining?: number, server?: object}} CompletedGame
 */

const Db = require("../database/completed"),
    Game = require("./game"),
    ServersDb = require("../database/servers");

const weapons = [
    "none",
    "missile_alien_pod",
    "missile_creeper",
    "missile_devastator",
    "missile_devastator_mini",
    "missile_falcon",
    "missile_hunter",
    "missile_pod",
    "missile_smart",
    "missile_smart_mini",
    "missile_timebomb",
    "missile_vortex",
    "proj_alien_blaster",
    "proj_alien_vulcan",
    "proj_beam",
    "proj_driller",
    "proj_driller_mini",
    "proj_enemy_blaster",
    "proj_enemy_core",
    "proj_enemy_vulcan",
    "proj_flak_cannon",
    "proj_flare",
    "proj_flare_sticky",
    "proj_impulse",
    "proj_melee",
    "proj_reflex",
    "proj_shotgun",
    "proj_thunderbolt",
    "proj_vortex",
    "num"
];

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
     * @returns {Promise<Game>} A promise that resolves with the game.
     */
    static async getById(id) {
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
            completedGame.server = await ServersDb.getByIp(completedGame.ip);

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
                teamScore: completedGame.data.teamScore
            });

            if (game.events) {
                game.events.sort((a, b) => a.time - b.time);
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
        const games = await Db.getRecent();

        for (const game of games) {
            game.remaining = 3600000 + game.date.getTime() + new Date().getTime();
            game.data = JSON.parse(game.data);
            game.server = await ServersDb.getByIp(game.ip);
        }

        return games.filter((g) => g.data && g.data.events && g.data.events.length && g.data.events.length > 0);
    }
}

module.exports = Completed;
