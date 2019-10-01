/**
 * @typedef {{id: number, ip: string, data: object, date: Date, remaining?: number, server?: object}} CompletedGame
 */

const Db = require("../database/completed"),
    Game = require("./game"),
    ServersDb = require("../database/servers");

const weapons = [
    "none",
    "missile_alien_pod", // Not a multiplayer weapon
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
    "proj_alien_blaster", // Not a multiplayer weapon
    "proj_alien_vulcan", // Not a multiplayer weapon
    "proj_beam", // Lancer
    "proj_driller",
    "proj_driller_mini", // Not a multiplayer weapon
    "proj_enemy_blaster", // Not a multiplayer weapon
    "proj_enemy_core", // Not a multiplayer weapon
    "proj_enemy_vulcan", // Not a multiplayer weapon
    "proj_flak_cannon",
    "proj_flare",
    "proj_flare_sticky", // Not a multiplayer weapon
    "proj_impulse",
    "proj_melee", // Not a multiplayer weapon
    "proj_reflex",
    "proj_shotgun", // Crusher
    "proj_thunderbolt",
    "proj_vortex", // Cyclone
    "num"
];

const weaponNames = [
    "Miscellaneous",
    "Unknown", // Not a multiplayer weapon
    "Creeper",
    "Devastator",
    "Devastator",
    "Falcon",
    "Hunter",
    "Missile Pod",
    "Nova",
    "Nova",
    "Time Bomb",
    "Vortex",
    "Unknown", // Not a multiplayer weapon
    "Unknown", // Not a multiplayer weapon
    "Lancer", // Lancer
    "Driller",
    "Unknown", // Not a multiplayer weapon
    "Unknown", // Not a multiplayer weapon
    "Unknown", // Not a multiplayer weapon
    "Unknown", // Not a multiplayer weapon
    "Flak",
    "Flare",
    "Unknown", // Not a multiplayer weapon
    "Impulse",
    "Unknown", // Not a multiplayer weapon
    "Reflex",
    "Crusher", // Crusher
    "Thunderbolt",
    "Cyclone", // Cyclone
    "Unknown"
];

const orderedWeapons = [
    "Impulse",
    "Cyclone",
    "Reflex",
    "Crusher",
    "Driller",
    "Flak",
    "Thunderbolt",
    "Lancer",
    "Falcon",
    "Missile Pod",
    "Hunter",
    "Creeper",
    "Nova",
    "Devastator",
    "Time Bomb",
    "Vortex",
    "Flare",
    "Miscellaneous",
    "Unknown"
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
    //                #                       #  #  #
    //                #                       #  #  #
    //  ##   ###    ###   ##   ###    ##    ###  #  #   ##    ###  ###    ##   ###    ###
    // #  #  #  #  #  #  # ##  #  #  # ##  #  #  ####  # ##  #  #  #  #  #  #  #  #  ##
    // #  #  #     #  #  ##    #     ##    #  #  ####  ##    # ##  #  #  #  #  #  #    ##
    //  ##   #      ###   ##   #      ##    ###  #  #   ##    # #  ###    ##   #  #  ###
    //                                                             #
    /**
     * Returns the list of ordered weapons.
     * @returns {string[]} The list of ordered weapons.
     */
    static get orderedWeapons() {
        return orderedWeapons;
    }

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

        game.damage.forEach((stat) => {
            stat.weapon = weaponNames[weapons.indexOf(stat.weapon)];
        });

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
        return Db.update(id, data);
    }
}

module.exports = Completed;
