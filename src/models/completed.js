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
                start: completedGame.data.start,
                end: completedGame.data.end,
                players: [],
                kills: completedGame.data.kills,
                goals: completedGame.data.goals,
                flagStats: completedGame.data.flagStats,
                events: completedGame.data.events,
                damage: completedGame.data.damage,
                teamScore: {}
            });

            let fillEvents = false;

            if (!game.events) {
                game.events = [];
                fillEvents = true;
            }

            if (game.goals) {
                game.teamScore = {"BLUE": 0, "ORANGE": 0};
                game.goals.forEach((goal) => {
                    const {scorer, scorerTeam, assisted, blunder} = goal,
                        scorerPlayer = game.getPlayer(scorer);

                    if (blunder) {
                        const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";

                        game.teamScore[otherTeam]++;
                        scorerPlayer.blunders++;
                        if (fillEvents) {
                            goal.description = `BLUNDER! ${scorer} own goals for ${otherTeam}!`;
                        }
                    } else {
                        game.teamScore[scorerTeam]++;
                        scorerPlayer.goals++;
                        if (fillEvents) {
                            goal.description = `GOAL! ${scorer} scored for ${scorerTeam}!${assisted ? ` Assisted by ${assisted}.` : ""}`;
                        }
                        if (assisted) {
                            const assistedPlayer = game.getPlayer(assisted);

                            assistedPlayer.goalAssists++;
                        }
                    }

                    if (fillEvents) {
                        game.events.push(goal);
                    }
                });
            }

            game.kills.forEach((kill) => {
                if (typeof kill.weapon === "number") {
                    kill.weapon = weapons[kill.weapon];
                }

                const {attacker, attackerTeam, defender, defenderTeam, assisted, assistedTeam, weapon} = kill,
                    attackerPlayer = game.getPlayer(attacker),
                    defenderPlayer = game.getPlayer(defender),
                    assistedPlayer = game.getPlayer(assisted);

                attackerPlayer.team = attackerTeam;
                defenderPlayer.team = defenderTeam;
                if (assistedPlayer) {
                    assistedPlayer.team = assistedTeam;
                }

                if (attackerTeam && !game.teamScore[attackerTeam]) {
                    game.teamScore[attackerTeam] = 0;
                }
                if (defenderTeam && !game.teamScore[defenderTeam]) {
                    game.teamScore[defenderTeam] = 0;
                }

                if (attackerTeam && attackerTeam !== "ANARCHY" && attackerTeam === defenderTeam || attacker === defender) {
                    attackerPlayer.kills--;
                    defenderPlayer.deaths++;

                    if (!game.goals && attackerTeam && attackerTeam !== "ANARCHY") {
                        if (game.teamScore[attackerTeam]) {
                            game.teamScore[attackerTeam]--;
                        } else {
                            game.teamScore[attackerTeam] = -1;
                        }
                    }
                } else {
                    attackerPlayer.kills++;
                    defenderPlayer.deaths++;
                    if (assistedPlayer) {
                        assistedPlayer.assists++;
                    }

                    if (!game.goals && attackerTeam && attackerTeam !== "ANARCHY") {
                        if (game.teamScore[attackerTeam]) {
                            game.teamScore[attackerTeam]++;
                        } else {
                            game.teamScore[attackerTeam] = 1;
                        }
                    }
                }

                if (fillEvents) {
                    kill.description = `${attacker} killed ${defender} with ${weapon}.${assisted ? ` Assisted by ${assisted}.` : ""}`;
                    game.events.push(kill);
                }
            });
        }

        game.events.sort((a, b) => a.time - b.time);

        return game;
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
