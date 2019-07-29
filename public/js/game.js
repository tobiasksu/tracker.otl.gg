/* global DetailsView, EventsView, PlayersView, WebSocketClient */

//   ###
//  #   #
//  #       ###   ## #    ###
//  #          #  # # #  #   #
//  #  ##   ####  # # #  #####
//  #   #  #   #  # # #  #
//   ###    ####  #   #   ###
/**
 * A class that provides functions for the game page.
 */
class Game {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Makes sure all timeago fields are rendered and starts the websocket.
     * @returns {void}
     */
    static DOMContentLoaded() {
        Game.ws = new WebSocketClient();
        Game.ws.onmessage = Game.onmessage;
        Game.ws.open(window.location.protocol + "//" + window.location.host + "/game/" + Game.game.ip);
    }

    //  ##   ###   # #    ##    ###    ###    ###   ###   ##
    // #  #  #  #  ####  # ##  ##     ##     #  #  #  #  # ##
    // #  #  #  #  #  #  ##      ##     ##   # ##   ##   ##
    //  ##   #  #  #  #   ##   ###    ###     # #  #      ##
    //                                              ###
    /**
     * Handles incoming messages.
     * @param {string} message The data received.
     * @returns {void}
     */
    static onmessage(message) {
        const {data} = JSON.parse(message);

        switch (data.name) {
            case "Stats": {
                switch (data.type) {
                    case "Kill":
                        Game.kill(data);
                        break;
                    case "Goal":
                        Game.goal(data);
                        break;
                    case "Blunder":
                        Game.blunder(data);
                        break;
                    case "Connect":
                        Game.connect(data);
                        break;
                    case "Disconect":
                        Game.disconnect(data);
                        break;
                    case "EndGame":
                        Game.endGame(data);
                        break;
                }

                document.getElementById("events").innerHTML = EventsView.get(Game.game);

                break;
            }
        }
    }

    // #     ##                   #
    // #      #                   #
    // ###    #    #  #  ###    ###   ##   ###
    // #  #   #    #  #  #  #  #  #  # ##  #  #
    // #  #   #    #  #  #  #  #  #  ##    #
    // ###   ###    ###  #  #   ###   ##   #
    /**
     * Processes the blunder stat.
     * @param {{time: number, scorer: string, scorerTeam: string}} data The blunder data.
     * @returns {void}
     */
    static blunder(data) {
        const {scorer, scorerTeam} = data;

        Game.game.events.push(data);
        Game.game.goals.push(data);

        const scorerPlayer = Game.game.getPlayer(scorer);

        scorerPlayer.team = scorerTeam;

        scorerPlayer.blunders++;

        const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";

        if (Game.game.teamScore[otherTeam]) {
            Game.game.teamScore[otherTeam]++;
        } else {
            Game.game.teamScore[otherTeam] = 1;
        }

        document.getElementById("game").innerHTML = DetailsView.get(Game.game);
        document.getElementById("players").innerHTML = PlayersView.get(Game.game);
    }

    //                                      #
    //                                      #
    //  ##    ##   ###   ###    ##    ##   ###
    // #     #  #  #  #  #  #  # ##  #      #
    // #     #  #  #  #  #  #  ##    #      #
    //  ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Processes the connect stat.
     * @param {{time: number, player: string}} data The connect data.
     * @returns {void}
     */
    static connect(data) {
        Game.game.events.push(data);
    }

    //    #   #                                                #
    //    #                                                    #
    //  ###  ##     ###    ##    ##   ###   ###    ##    ##   ###
    // #  #   #    ##     #     #  #  #  #  #  #  # ##  #      #
    // #  #   #      ##   #     #  #  #  #  #  #  ##    #      #
    //  ###  ###   ###     ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Processes the disconnect stat.
     * @param {{time: number, player: string}} data The connect data.
     * @returns {void}
     */
    static disconnect(data) {
        Game.game.events.push(data);
    }

    //                #   ##
    //                #  #  #
    //  ##   ###    ###  #      ###  # #    ##
    // # ##  #  #  #  #  # ##  #  #  ####  # ##
    // ##    #  #  #  #  #  #  # ##  #  #  ##
    //  ##   #  #   ###   ###   # #  #  #   ##
    /**
     * Processes the end game stat.
     * @param {{start: Date, end: Date, damage: object[], kills: object[], goals: object[]}} data The end game data.
     * @returns {void}
     */
    static endGame(data) {
        const {start, end, damage, kills, goals} = data;

        Game.game.start = new Date(start);
        Game.game.end = new Date(end);
        Game.game.damage = damage;
        Game.game.kills = kills;
        Game.game.goals = goals;

        Game.ws.close();

        document.getElementById("game").innerHTML = DetailsView.get(Game.game);
        document.getElementById("players").innerHTML = PlayersView.get(Game.game);
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
     * @param {{time: number, scorer: string, scorerTeam: string, assisted: string, assistedTeam: string}} data The goal data.
     * @returns {void}
     */
    static goal(data) {
        const {scorer, scorerTeam, assisted, assistedTeam} = data;

        Game.game.events.push(data);
        Game.game.goals.push(data);

        const scorerPlayer = Game.game.getPlayer(scorer),
            assistedPlayer = Game.game.getPlayer(assisted);

        scorerPlayer.team = scorerTeam;
        if (assistedPlayer) {
            assistedPlayer.team = assistedTeam;
        }

        scorerPlayer.goals++;
        if (assistedPlayer) {
            assistedPlayer.goalAssists++;
        }

        if (Game.game.teamScore[scorerTeam]) {
            Game.game.teamScore[scorerTeam]++;
        } else {
            Game.game.teamScore[scorerTeam] = 1;
        }

        document.getElementById("game").innerHTML = DetailsView.get(Game.game);
        document.getElementById("players").innerHTML = PlayersView.get(Game.game);
    }

    // #      #    ##    ##
    // #            #     #
    // # #   ##     #     #
    // ##     #     #     #
    // # #    #     #     #
    // #  #  ###   ###   ###
    /**
     * Processes the kill stat.
     * @param {{time: number, attacker: string, attackerTeam: string, defender: string, defenderTeam: string, assisted: string, assistedTeam: string, weapon: string}} data The kill data.
     * @returns {void}
     */
    static kill(data) {
        const {attacker, attackerTeam, defender, defenderTeam, assisted, assistedTeam} = data;

        Game.game.events.push(data);
        Game.game.kills.push(data);

        const attackerPlayer = Game.game.getPlayer(attacker),
            defenderPlayer = Game.game.getPlayer(defender),
            assistedPlayer = Game.game.getPlayer(assisted);

        attackerPlayer.team = attackerTeam;
        defenderPlayer.team = defenderTeam;
        if (assistedPlayer) {
            assistedPlayer.team = assistedTeam;
        }

        if (attackerTeam && attackerTeam !== "ANARCHY" && attackerTeam === defenderTeam) {
            attackerPlayer.kills--;
            defenderPlayer.deaths++;

            if ((!Game.game.settings || Game.game.settings.matchMode !== "MONSTERBALL") && attackerTeam && attackerTeam !== "ANARCHY") {
                if (Game.game.teamScore[attackerTeam]) {
                    Game.game.teamScore[attackerTeam]--;
                } else {
                    Game.game.teamScore[attackerTeam] = -1;
                }
            }
        } else {
            attackerPlayer.kills++;
            defenderPlayer.deaths++;
            if (assistedPlayer) {
                assistedPlayer.assists++;
            }

            if ((!Game.game.settings || Game.game.settings.matchMode !== "MONSTERBALL") && Game.game.settings.matchMode !== "MONSTERBALL" && attackerTeam && attackerTeam !== "ANARCHY") {
                if (Game.game.teamScore[attackerTeam]) {
                    Game.game.teamScore[attackerTeam]++;
                } else {
                    Game.game.teamScore[attackerTeam] = 1;
                }
            }
        }

        document.getElementById("game").innerHTML = DetailsView.get(Game.game);
        document.getElementById("players").innerHTML = PlayersView.get(Game.game);
    }
}

document.addEventListener("DOMContentLoaded", Game.DOMContentLoaded);
