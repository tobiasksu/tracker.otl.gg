/* global Common, CompletedGameView, Countdown, Elapsed, Game, GameView, Player, ScoreView, ServersView, timeago, WebSocketClient */

//  #   #
//  #   #
//  #   #   ###   ## #    ###
//  #####  #   #  # # #  #   #
//  #   #  #   #  # # #  #####
//  #   #  #   #  # # #  #
//  #   #   ###   #   #   ###
/**
 * A class that provides functions for the home page.
 */
class Home {
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
        timeago().render(document.querySelectorAll(".timeago"));

        Home.ws = new WebSocketClient();
        Home.ws.onmessage = Home.onmessage;
        Home.ws.open((window.location.protocol === "http:" ? "ws:" : window.location.protocol === "https:" ? "wss:" : window.location.protocol) + "//" + window.location.host);
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
        const {ip, data} = JSON.parse(message.data),
            game = Game.getGame(ip);

        switch (data.name) {
            case "Stats":
                switch (data.type) {
                    case "StartGame":
                        Home.startGame(ip, data);
                        break;
                    case "Kill":
                        Home.kill(ip, data);
                        break;
                    case "Goal":
                        Home.goal(ip, data);
                        break;
                    case "Blunder":
                        Home.blunder(ip, data);
                        break;
                    case "Connect":
                        Home.connect(ip, data);
                        break;
                    case "Disconect":
                        Home.disconnect(ip, data);
                        break;
                }

                // TODO: What happens if the first packet we receive isn't StartGame? 🤔
                document.getElementById(`game-${ip}`).querySelector(".scores").innerHTML = ScoreView.get(game);

                if (data.type === "EndGame") {
                    Home.endGame(ip, data);
                }
                break;
            case "Server": {
                const oldServer = Home.servers.find((s) => s.ip === ip);
                if (oldServer) {
                    Home.servers.splice(Home.servers.indexOf(oldServer), 1);
                }

                if (data.visible) {
                    Home.servers.push(data.server);
                }

                document.getElementById("browser").innerHTML = ServersView.get(Home.servers);
                timeago().render(document.querySelectorAll(".timeago"));

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
     * @param {string} ip The IP address of the server to update.
     * @param {{time: number, scorer: string, scorerTeam: string}} data The blunder data.
     * @returns {void}
     */
    static blunder(ip, data) {
        const {scorer, scorerTeam} = data,
            game = Game.getGame(ip);

        game.events.push(data);
        game.goals.push(data);

        const scorerPlayer = game.getPlayer(scorer);

        scorerPlayer.team = scorerTeam;

        scorerPlayer.blunders++;

        const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";

        if (game.teamScore[otherTeam]) {
            game.teamScore[otherTeam]++;
        } else {
            game.teamScore[otherTeam] = 1;
        }
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
     * @param {{time: number, player: string}} data The connect data.
     * @returns {void}
     */
    static connect(ip, data) {
        const game = Game.getGame(ip);

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
     * @param {{time: number, player: string}} data The connect data.
     * @returns {void}
     */
    static disconnect(ip, data) {
        const game = Game.getGame(ip);

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
     * @returns {void}
     */
    static endGame(ip, data) {
        const {start, end, damage, kills, goals} = data,
            game = Game.getGame(ip);

        game.start = new Date(start);
        game.end = new Date(end);
        game.damage = damage;
        game.kills = kills;
        game.goals = goals;

        const gameEl = document.getElementById(`game-${ip}`);
        gameEl.parentNode.removeChild(gameEl);

        const gameId = `completed-${Common.uuidv4()}`;

        document.getElementById("completed").insertAdjacentHTML("beforeend", /* html */`
            <div class="game" id="${gameId}">
                ${CompletedGameView.get(game)}
            </div>
        `);

        game.remove();

        setTimeout(() => {
            const completedEl = document.getElementById(gameId);
            completedEl.parentNode.removeChild(completedEl);
        }, 3600000);
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
     * @param {{time: number, scorer: string, scorerTeam: string, assisted: string, assistedTeam: string}} data The goal data.
     * @returns {void}
     */
    static goal(ip, data) {
        const {scorer, scorerTeam, assisted, assistedTeam} = data,
            game = Game.getGame(ip);

        game.events.push(data);
        game.goals.push(data);

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
     * @param {{time: number, attacker: string, attackerTeam: string, defender: string, defenderTeam: string, assisted: string, assistedTeam: string, weapon: string}} data The kill data.
     * @returns {void}
     */
    static kill(ip, data) {
        const {attacker, attackerTeam, defender, defenderTeam, assisted, assistedTeam} = data,
            game = Game.getGame(ip);

        game.events.push(data);
        game.kills.push(data);

        const attackerPlayer = game.getPlayer(attacker),
            defenderPlayer = game.getPlayer(defender),
            assistedPlayer = game.getPlayer(assisted);

        attackerPlayer.team = attackerTeam;
        defenderPlayer.team = defenderTeam;
        if (assistedPlayer) {
            assistedPlayer.team = assistedTeam;
        }

        if (attackerTeam && attackerTeam !== "ANARCHY" && attackerTeam === defenderTeam || attacker === defender) {
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
     * @returns {void}
     */
    static startGame(ip, data) {
        const game = Game.getGame(ip);

        game.server = data.server;
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
        game.countdown = data.countdown;
        game.elapsed = data.elapsed;

        document.getElementById("games").insertAdjacentHTML("beforeend", /* html */`
            <div class="game" id="game-${ip}">
                ${GameView.get(game)}
            </div>
        `);

        const el = document.getElementById(`game-${ip}`).querySelector(".time");

        if (game.countdown) {
            new Countdown(game.countdown, el);
        } else if (game.elapsed || game.elapsed === 0) {
            new Elapsed(game.elapsed, el);
        }
    }
}

document.addEventListener("DOMContentLoaded", Home.DOMContentLoaded);
