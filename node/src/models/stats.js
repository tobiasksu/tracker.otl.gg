/**
 * @typedef {import("../../types/node/messageTypes").Message} MessageTypes.Message
 */

const Db = require("../database/completed"),
    Game = require("../../public/js/common/game"),
    ServersDb = require("../database/servers"),
    Weapon = require("./weapon"),
    Websocket = require("../websocket");

//   ###    #             #
//  #   #   #             #
//  #      ####    ###   ####    ###
//   ###    #         #   #     #
//      #   #      ####   #      ###
//  #   #   #  #  #   #   #  #      #
//   ###     ##    ####    ##   ####
/**
 * A class that represents statistics.
 */
class Stats {
    //                                              ##    #           #
    //                                             #  #   #           #
    // ###   ###    ##    ##    ##    ###    ###    #    ###    ###  ###
    // #  #  #  #  #  #  #     # ##  ##     ##       #    #    #  #   #
    // #  #  #     #  #  #     ##      ##     ##   #  #   #    # ##   #
    // ###   #      ##    ##    ##   ###    ###     ##     ##   # #    ##
    // #
    /**
     * Processes a stat sent from a server.
     * @param {string} ip The IP address of the server to update.
     * @param {MessageTypes.Message} data The stat data.
     * @returns {Promise} A promise that resolves when the stat has been processed.
     */
    static async processStat(ip, data) {
        if (data.name === "Stats") {
            let game = Game.getByIp(ip);

            if (!game && (data.type === "LobbyExit" || data.type === "Disconnect")) {
                return;
            }

            if (!game) {
                game = Game.getGame(ip);

                if (data.type !== "StartGame" && data.type !== "LobbyStatus") {
                    game.startGame({
                        type: "StartGame",
                        matchMode: "ANARCHY"
                    });

                    Websocket.broadcast({ip, data: {
                        matchMode: "ANARCHY",
                        name: "Stats",
                        type: "StartGame"
                    }});
                }
            }

            if (!game.server) {
                game.server = await ServersDb.getByIp(ip);
            }

            switch (data.type) {
                case "StartGame":
                case "LobbyStatus":
                    data.server = game.server;
                    game.startGame(data);
                    break;
                case "Kill":
                    data.weapon = Weapon.weaponNames[Weapon.weapons.indexOf(data.weapon)];
                    game.kill(data);
                    break;
                case "Goal":
                    game.goal(data);
                    break;
                case "Blunder":
                    game.blunder(data);
                    break;
                case "CTF":
                    game.ctf(data);
                    break;
                case "Connect":
                    game.connect(data);
                    break;
                case "Disconnect":
                    game.disconnect(data);
                    break;
                case "EndGame": {
                    game.endGame(data);

                    game.settings ||= {matchMode: "ANARCHY"};

                    // Set weapons.
                    game.damage.forEach((stat) => {
                        stat.weapon = Weapon.weaponNames[Weapon.weapons.indexOf(stat.weapon)];
                    });

                    game.kills.forEach((kill) => {
                        kill.weapon = Weapon.weaponNames[Weapon.weapons.indexOf(kill.weapon)];
                    });

                    // Remove duplicates from arrays that can have them.
                    const kills = [];
                    if (!game.kills) {
                        game.kills = [];
                    }
                    for (const kill of game.kills) {
                        if (kill.attacker && kill.defender && !kills.find((k) => k.time === kill.time && k.attacker === kill.attacker && k.attackerTeam === kill.attackerTeam && k.defender === kill.defender && k.defenderTeam === kill.defenderTeam && k.assisted === kill.assisted && k.assistedTeam === kill.assistedTeam && k.weapon === kill.weapon)) {
                            kills.push(kill);
                        }
                    }
                    game.kills = kills;

                    const flags = [];
                    if (!game.flagStats) {
                        game.flagStats = [];
                    }
                    for (const stat of game.flagStats) {
                        if (stat.scorer && !flags.find((f) => f.time === stat.time && f.event === stat.event && f.scorer === stat.scorer && f.scorerTeam === stat.scorerTeam)) {
                            flags.push(stat);
                        }
                    }
                    game.flagStats = flags;

                    const goals = [];
                    if (!game.goals) {
                        game.goals = [];
                    }
                    for (const goal of game.goals) {
                        if (goal.scorer && !goals.find((g) => g.time === goal.time && g.scorer === goal.scorer && g.scorerTeam === goal.scorerTeam && g.assisted === goal.assisted && g.assistedTeam === goal.assistedTeam && g.blunder === goal.blunder)) {
                            goals.push(goal);
                        }
                    }
                    game.goals = goals;

                    if (!game.events) {
                        game.events = [];
                    }
                    const hasEvents = game.events.length > 0;
                    if (hasEvents) {
                        const events = [];
                        for (const ev of game.events) {
                            const event = {
                                time: ev.time,
                                type: ev.type,
                                description: ev.description,
                                player: ev.player
                            };
                            if (!events.find((e) => e.time === event.time && e.type === event.type && e.description === ev.description && e.player === ev.player)) {
                                events.push(event);
                            }
                        }
                        game.events = events;
                    }

                    const damage = [];
                    if (!game.damage) {
                        game.damage = [];
                    }
                    for (const stat of game.damage) {
                        if (stat.attacker && stat.defender) {
                            const dmg = damage.find((d) => d.attacker === stat.attacker && d.defender === stat.defender && d.weapon === stat.weapon);
                            if (dmg) {
                                dmg.damage += stat.damage;
                            } else {
                                damage.push({
                                    attacker: stat.attacker,
                                    defender: stat.defender,
                                    weapon: stat.weapon,
                                    damage: stat.damage
                                });
                            }
                        }
                    }
                    game.damage = damage;

                    // Regenerate players and teamScore arrays in case our data is out of sync from the server due to dropped packets, restarted tracker, etc.
                    game.players = [];

                    game.kills.forEach((kill) => {
                        const attackerPlayer = game.getPlayer(kill.attacker, kill.attackerTeam),
                            defenderPlayer = game.getPlayer(kill.defender, kill.defenderTeam),
                            assistedPlayer = game.getPlayer(kill.assisted, kill.assistedTeam);

                        if (!attackerPlayer || !defenderPlayer) {
                            return;
                        }

                        if (kill.attacker === kill.defender || ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(game.settings.matchMode) !== -1 && kill.attackerTeam === kill.defenderTeam) {
                            attackerPlayer.kills--;
                        } else {
                            attackerPlayer.kills++;

                            if (assistedPlayer) {
                                assistedPlayer.assists++;
                            }
                        }
                        defenderPlayer.deaths++;

                        if (!hasEvents) {
                            game.events.push({
                                time: kill.time,
                                type: "Kill",
                                description: `${kill.attacker} killed ${kill.defender} with ${kill.weapon}.${kill.assisted ? ` Assisted by ${kill.assisted}.` : ""}`
                            });
                        }
                    });

                    if (!game.teamChanges) {
                        game.teamChanges = [];
                    }
                    game.teamChanges.forEach((teamChange) => {
                        if (!hasEvents) {
                            game.events.push({
                                time: teamChange.time,
                                type: "TeamChange",
                                description: `${teamChange.playerName} changed from ${teamChange.previousTeam} to ${teamChange.currentTeam} team`
                            });
                        }
                    });

                    switch (game.settings.matchMode) {
                        case "TEAM ANARCHY": {
                            game.teamScore = {};

                            const teams = game.kills.map((k) => k.attackerTeam).concat(game.kills.map((k) => k.defenderTeam)).concat(game.kills.map((k) => k.assistedTeam)).filter((k) => k).filter((k, index, self) => self.indexOf(k) === index);

                            teams.forEach((team) => {
                                game.teamScore[team] = game.kills.filter((k) => k.attackerTeam === team && k.defenderTeam !== team).length - game.kills.filter((k) => k.attackerTeam === team && k.defenderTeam === team).length;
                            });

                            break;
                        } case "MONSTERBALL":
                            game.teamScore = {
                                "BLUE": game.goals.filter((g) => g.scorerTeam === "BLUE" && !g.blunder || g.scorerTeam === "ORANGE" && g.blunder).length,
                                "ORANGE": game.goals.filter((g) => g.scorerTeam === "ORANGE" && !g.blunder || g.scorerTeam === "BLUE" && g.blunder).length
                            };

                            game.goals.forEach((goal) => {
                                const scorerPlayer = game.getPlayer(goal.scorer, goal.scorerTeam),
                                    assistedPlayer = game.getPlayer(goal.assisted, goal.assistedTeam);

                                if (goal.blunder) {
                                    scorerPlayer.blunders++;
                                } else {
                                    scorerPlayer.goals++;
                                }

                                if (assistedPlayer) {
                                    assistedPlayer.goalAssists++;
                                }

                                if (!hasEvents) {
                                    const ev = JSON.parse(JSON.stringify(goal));

                                    if (goal.blunder) {
                                        const otherTeam = goal.scorerTeam === "BLUE" ? "ORANGE" : "BLUE";
                                        ev.description = `BLUNDER! ${goal.scorer} own goals for ${otherTeam}!`;
                                    } else {
                                        ev.description = `GOAL! ${goal.scorer} scored for ${goal.scorerTeam}!${goal.assisted ? ` Assisted by ${goal.assisted}.` : ""}`;
                                    }

                                    game.events.push({
                                        time: goal.time,
                                        type: goal.blunder ? "Blunder" : "Goal",
                                        description: ev.description
                                    });
                                }
                            });

                            break;
                        case "CTF":
                            game.teamScore = {
                                "BLUE": game.flagStats.filter((f) => f.scorerTeam === "BLUE" && f.event === "Capture").length,
                                "ORANGE": game.flagStats.filter((f) => f.scorerTeam === "ORANGE" && f.event === "Capture").length
                            };

                            game.flagStats.forEach((flag) => {
                                if (!flag.scorer) {
                                    return;
                                }

                                const scorerPlayer = game.getPlayer(flag.scorer, flag.scorerTeam);

                                switch (flag.event) {
                                    case "Capture":
                                        scorerPlayer.captures++;
                                        break;
                                    case "Pickup":
                                        scorerPlayer.pickups++;
                                        break;
                                    case "CarrierKill":
                                        scorerPlayer.carrierKills++;
                                        break;
                                    case "Return":
                                        scorerPlayer.returns++;
                                        break;
                                }

                                if (!hasEvents) {
                                    let description;

                                    switch (flag.event) {
                                        case "Return":
                                            description = `${flag.scorer} returned the ${flag.scorerTeam} flag.`;
                                            break;
                                        case "Pickup": {
                                            const otherTeam = flag.scorerTeam === "BLUE" ? "ORANGE" : "BLUE";
                                            description = `${flag.scorer} picked up the ${otherTeam} flag.`;
                                            break;
                                        } case "Capture":
                                            description = `${flag.scorer} scores for ${flag.scorerTeam}!`;
                                            break;
                                        case "CarrierKill": {
                                            const otherTeam = flag.scorerTeam === "BLUE" ? "ORANGE" : "BLUE";
                                            description = `${flag.scorer} killed the ${otherTeam} flag carrier!`;
                                            break;
                                        }
                                    }

                                    game.events.push({
                                        time: flag.time,
                                        type: "CTF",
                                        description
                                    });
                                }
                            });

                            break;
                    }

                    data.teamScore = game.teamScore;
                    data.players = game.players;

                    if (game.teamChanges) {
                        game.teamChanges.forEach((change) => {
                            game.getPlayer(change.playerName, change.currentTeam).team = change.currentTeam;
                        });
                    }

                    // Clean up data.
                    if (!game.settings.matchNotes) {
                        game.settings.matchNotes = void 0;
                    }

                    if (game.server && !game.server.ip) {
                        game.server.ip = game.ip;
                    }

                    if (game.server && game.server.gameStarted) {
                        game.server.gameStarted = new Date(game.server.gameStarted);
                    }

                    if (game.server && game.server.lastSeen) {
                        game.server.lastSeen = new Date(game.server.lastSeen);
                    }

                    if (game.start) {
                        game.start = new Date(game.start);
                    }

                    if (game.end) {
                        game.end = new Date(game.end);
                    }

                    if (game.startTime) {
                        game.startTime = new Date(game.startTime);
                    }

                    if (game.projectedEnd) {
                        game.projectedEnd = new Date(game.projectedEnd);
                    }

                    if (game.date) {
                        game.date = new Date(game.date);
                    }

                    // Save game.
                    if (game.events.length > 0 && game.players.length > 0) {
                        data.id = await Db.add(ip, game);
                    }

                    game.remove();
                    break;
                }
                case "LobbyExit":
                    game.remove();
                    break;
                case "TeamChange":
                    game.teamChange(data);
                    break;
            }

            Websocket.broadcast({ip, data});
        }
    }
}

module.exports = Stats;
