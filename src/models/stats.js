const Db = require("../database/completed"),
    Game = require("./game"),
    Player = require("./player"),
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
    // #     ##                   #
    // #      #                   #
    // ###    #    #  #  ###    ###   ##   ###
    // #  #   #    #  #  #  #  #  #  # ##  #  #
    // #  #   #    #  #  #  #  #  #  ##    #
    // ###   ###    ###  #  #   ###   ##   #
    /**
     * Processes the blunder stat.
     * @param {string} ip The IP address of the server to update.
     * @param {object} data The blunder data.
     * @returns {Promise} A promise that resolves when the stat has been processed.
     */
    static async blunder(ip, data) {
        const {scorer, scorerTeam} = data,
            game = await Game.getGame(ip);

        const scorerPlayer = game.getPlayer(scorer);

        scorerPlayer.team = scorerTeam;

        scorerPlayer.blunders++;

        const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";

        if (game.teamScore[otherTeam]) {
            game.teamScore[otherTeam]++;
        } else {
            game.teamScore[otherTeam] = 1;
        }

        game.goals.push(data);
        data.description = `BLUNDER! ${scorer} own goals for ${otherTeam}!`;
        game.events.push(data);
    }

    //                                      #
    //                                      #
    //  ##    ##   ###   ###    ##    ##   ###
    // #     #  #  #  #  #  #  # ##  #      #
    // #     #  #  #  #  #  #  ##    #      #
    //  ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Processes the connect stat.
     * @param {string} ip The IP address of the server to update.
     * @param {object} data The connect data.
     * @returns {Promise} A promise that resolves when the stat has been processed.
     */
    static async connect(ip, data) {
        const game = await Game.getGame(ip);

        data.description = `${data.player} connected.`;
        game.events.push(data);
    }

    //    #   #                                                #
    //    #                                                    #
    //  ###  ##     ###    ##    ##   ###   ###    ##    ##   ###
    // #  #   #    ##     #     #  #  #  #  #  #  # ##  #      #
    // #  #   #      ##   #     #  #  #  #  #  #  ##    #      #
    //  ###  ###   ###     ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Processes the disconnect stat.
     * @param {string} ip The IP address of the server to update.
     * @param {object} data The connect data.
     * @returns {Promise} A promise that resolves when the stat has been processed.
     */
    static async disconnect(ip, data) {
        const game = await Game.getGame(ip);

        data.description = `${data.player} disconnected.`;
        game.events.push(data);
    }

    //                #   ##
    //                #  #  #
    //  ##   ###    ###  #      ###  # #    ##
    // # ##  #  #  #  #  # ##  #  #  ####  # ##
    // ##    #  #  #  #  #  #  # ##  #  #  ##
    //  ##   #  #   ###   ###   # #  #  #   ##
    /**
     * Processes the end game stat.
     * @param {string} ip The IP address of the server to update.
     * @param {{start: Date, end: Date, damage: object[], kills: object[], goals: object[]}} data The end game data.
     * @returns {Promise} A promise that resolves when the stat has been processed.
     */
    static async endGame(ip, data) {
        const {start, end, damage, kills, goals} = data,
            game = await Game.getGame(ip);

        game.start = start;
        game.end = end;
        game.damage = damage;
        game.kills = kills;
        game.goals = goals;

        await Db.add(ip, game);

        game.remove();
    }

    //                   ##
    //                    #
    //  ###   ##    ###   #
    // #  #  #  #  #  #   #
    //  ##   #  #  # ##   #
    // #      ##    # #  ###
    //  ###
    /**
     * Processes the goal stat.
     * @param {string} ip The IP address of the server to update.
     * @param {object} data The goal data.
     * @returns {Promise} A promise that resolves when the stat has been processed.
     */
    static async goal(ip, data) {
        const {scorer, scorerTeam, assisted, assistedTeam} = data,
            game = await Game.getGame(ip);


        const scorerPlayer = game.getPlayer(scorer),
            assistedPlayer = game.getPlayer(assisted);

        scorerPlayer.team = scorerTeam;
        if (assistedPlayer) {
            assistedPlayer.team = assistedTeam;
        }

        scorerPlayer.goals++;
        if (assistedPlayer) {
            assistedPlayer.goalAssists++;
        }

        if (game.teamScore[scorerTeam]) {
            game.teamScore[scorerTeam]++;
        } else {
            game.teamScore[scorerTeam] = 1;
        }

        game.goals.push(data);
        data.description = `GOAL! ${scorer} scored for ${scorerTeam}! Assisted by ${assisted}.`;
        game.events.push(data);
    }

    // #      #    ##    ##
    // #            #     #
    // # #   ##     #     #
    // ##     #     #     #
    // # #    #     #     #
    // #  #  ###   ###   ###
    /**
     * Processes the kill stat.
     * @param {string} ip The IP address of the server to update.
     * @param {object} data The kill data.
     * @returns {Promise} A promise that resolves when the stat has been processed.
     */
    static async kill(ip, data) {
        const {attacker, attackerTeam, defender, defenderTeam, assisted, assistedTeam, weapon} = data,
            game = await Game.getGame(ip);

        const attackerPlayer = game.getPlayer(attacker),
            defenderPlayer = game.getPlayer(defender),
            assistedPlayer = game.getPlayer(assisted);

        attackerPlayer.team = attackerTeam;
        defenderPlayer.team = defenderTeam;
        if (assistedPlayer) {
            assistedPlayer.team = assistedTeam;
        }

        if (attackerTeam && attackerTeam !== "ANARCHY" && attackerTeam === defenderTeam) {
            attackerPlayer.kills--;
            defenderPlayer.deaths++;

            if ((!game.settings.matchMode || game.settings.matchMode !== "MONSTERBALL") && attackerTeam && attackerTeam !== "ANARCHY") {
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

            if ((!game.settings.matchMode || game.settings.matchMode !== "MONSTERBALL") && attackerTeam && attackerTeam !== "ANARCHY") {
                if (game.teamScore[attackerTeam]) {
                    game.teamScore[attackerTeam]++;
                } else {
                    game.teamScore[attackerTeam] = 1;
                }
            }
        }

        game.kills.push(data);
        data.description = `${attacker} killed ${defender} with ${weapon}.${assisted ? ` Assisted by ${assisted}.` : ""}`;
        game.events.push(data);
    }

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
        if (data.name === "Stats") {
            switch (data.type) {
                case "StartGame":
                    await Stats.startGame(ip, data);
                    break;
                case "Kill":
                    await Stats.kill(ip, data);
                    break;
                case "Goal":
                    await Stats.goal(ip, data);
                    break;
                case "Blunder":
                    await Stats.blunder(ip, data);
                    break;
                case "Connect":
                    await Stats.connect(ip, data);
                    break;
                case "Disconect":
                    await Stats.disconnect(ip, data);
                    break;
                case "EndGame":
                    await Stats.endGame(ip, data);
                    break;
            }

            Websocket.broadcast({ip, data});
        }
    }

    //         #                 #     ##
    //         #                 #    #  #
    //  ###   ###    ###  ###   ###   #      ###  # #    ##
    // ##      #    #  #  #  #   #    # ##  #  #  ####  # ##
    //   ##    #    # ##  #      #    #  #  # ##  #  #  ##
    // ###      ##   # #  #       ##   ###   # #  #  #   ##
    /**
     * Processes the start game stat.
     * @param {string} ip The IP address of the server to update.
     * @param {object} data The start game data.
     * @returns {Promise} A promise that resolves when the stat has been processed.
     */
    static async startGame(ip, data) {
        const game = await Game.getGame(ip);

        game.settings = data;
        game.players = data.players.map((player) => new Player({
            name: player,
            kills: 0,
            assists: 0,
            deaths: 0,
            goals: 0,
            goalAssists: 0,
            blunders: 0,
            connected: data.time
        }));

        if (game.settings.timeLimit) {
            game.projectedEnd = new Date();
            game.projectedEnd.setSeconds = game.projectedEnd.getSeconds() + game.settings.timeLimit;
        } else {
            game.startTime = new Date();
        }

        data.server = game.server;
        data.condition = Game.getCondition(game);
    }
}

module.exports = Stats;
