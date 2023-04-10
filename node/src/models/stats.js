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
     * @param {object} data The stat data.
     * @returns {Promise} A promise that resolves when the stat has been processed.
     */
    static async processStat(ip, data) {
        let game = Game.getByIp(ip);

        if (!game && data.type !== "StartGame" && data.type !== "LobbyStatus") {
            if (data.type === "LobbyExit" || data.type === "Disconnect") {
                return;
            }

            game = Game.getGame(ip);

            game.startGame({settings: {matchMode: "ANARCHY"}});

            Websocket.broadcast({ip, data: {
                matchMode: "ANARCHY",
                name: "Stats",
                type: "StartGame"
            }});
        }

        if (!game.server) {
            game.server = await ServersDb.getByIp(ip);
        }

        if (data.name === "Stats") {
            switch (data.type) {
                case "StartGame":
                case "LobbyStatus":
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

                    game.damage.forEach((stat) => {
                        stat.weapon = Weapon.weaponNames[Weapon.weapons.indexOf(stat.weapon)];
                    });

                    // Regenerate players and teamScore arrays in case our data is out of sync from the server due to dropped packets, restarted tracker, etc.
                    game.players = [];

                    const hasEvents = game.events.length > 0;

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
                            const ev = JSON.parse(JSON.stringify(kill));
                            ev.description = `${kill.attacker} killed ${kill.defender} with ${kill.weapon}.${kill.assisted ? ` Assisted by ${kill.assisted}.` : ""}`;
                            game.events.push(ev);
                        }
                    });

                    game.teamChanges.forEach((teamChange) => {
                        if (!hasEvents) {
                            const ev = JSON.parse(JSON.stringify(teamChange));
                            ev.description = `${teamChange.playerName} changed from ${teamChange.previousTeam} to ${teamChange.currentTeam} team`;
                            game.events.push(ev);
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

                                    game.events.push(ev);
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
                                    const ev = JSON.parse(JSON.stringify(flag));

                                    switch (flag.event) {
                                        case "Return":
                                            ev.description = `${flag.scorer} returned the ${flag.scorerTeam} flag.`;
                                            break;
                                        case "Pickup": {
                                            const otherTeam = flag.scorerTeam === "BLUE" ? "ORANGE" : "BLUE";
                                            ev.description = `${flag.scorer} picked up the ${otherTeam} flag.`;
                                            break;
                                        } case "Capture":
                                            ev.description = `${flag.scorer} scores for ${flag.scorerTeam}!`;
                                            break;
                                        case "CarrierKill": {
                                            const otherTeam = flag.scorerTeam === "BLUE" ? "ORANGE" : "BLUE";
                                            ev.description = `${flag.scorer} killed the ${otherTeam} flag carrier!`;
                                            break;
                                        }
                                    }

                                    game.events.push(ev);
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
