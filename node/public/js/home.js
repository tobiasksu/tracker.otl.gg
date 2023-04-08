//  #   #                         ###
//  #   #                           #
//  #   #   ###   ## #    ###       #   ###
//  #####  #   #  # # #  #   #      #  #
//  #   #  #   #  # # #  #####      #   ###
//  #   #  #   #  # # #  #      #   #      #
//  #   #   ###   #   #   ###    ###   ####
/**
 * A class that provides functions for the home page.
 */
class HomeJs {
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
        HomeJs.Time.loadTimeAgo();

        const el = /** @type {HTMLAnchorElement} */(document.getElementById("live-updates")); // eslint-disable-line no-extra-parens

        if (HomeJs.Time.live) {
            HomeJs.ws = new HomeJs.WebSocketClient(`ws${window.location.protocol === "https:" ? "s" : ""}://${window.location.host}`);
            HomeJs.ws.instance.onmessage = HomeJs.onmessage;
            HomeJs.ws.open();
            el.innerText = "Disable Live Updates";
            el.href = `${window.location.href.replace(/[?&]live=on/, "")}${window.location.href.replace(/[?&]live=on/, "").indexOf("?") === -1 ? "?" : "&"}live=off`;
        } else {
            el.innerText = "Enable Live Updates";
            el.href = `${window.location.href.replace(/[?&]live=off/, "")}${window.location.href.replace(/[?&]live=off/, "").indexOf("?") === -1 ? "?" : "&"}live=on`;
        }
    }

    //  ##   ###   # #    ##    ###    ###    ###   ###   ##
    // #  #  #  #  ####  # ##  ##     ##     #  #  #  #  # ##
    // #  #  #  #  #  #  ##      ##     ##   # ##   ##   ##
    //  ##   #  #  #  #   ##   ###    ###     # #  #      ##
    //                                              ###
    /**
     * Handles incoming messages.
     * @param {MessageEvent} ev The data received.
     * @returns {void}
     */
    static onmessage(ev) {
        const {ip, data} = JSON.parse(ev.data),
            game = HomeJs.Game.getGame(ip);

        switch (data.name) {
            case "Stats":
                switch (data.type) {
                    case "StartGame":
                    case "LobbyStatus":
                        HomeJs.startGame(ip, data);
                        break;
                    case "Kill":
                        HomeJs.kill(ip, data);
                        break;
                    case "Goal":
                        HomeJs.goal(ip, data);
                        break;
                    case "Blunder":
                        HomeJs.blunder(ip, data);
                        break;
                    case "CTF":
                        HomeJs.ctf(ip, data);
                        break;
                    case "Connect":
                        HomeJs.connect(ip, data);
                        break;
                    case "Disconnect":
                        HomeJs.disconnect(ip, data);
                        break;
                    case "TeamChange":
                        HomeJs.teamChange(ip, data);
                }

                document.getElementById(`game-${ip}`).querySelector(".scores").innerHTML = HomeJs.CommonScoreView.get(game);
                document.getElementById(`game-${ip}`).querySelector(".playerCount").innerHTML = HomeJs.CommonPlayerCountView.get(game);

                if (data.type === "EndGame") {
                    HomeJs.endGame(ip, data);
                }
                if (data.type === "LobbyExit") {
                    HomeJs.exitGame(ip);
                }
                break;
            case "Server": {
                const oldServer = HomeJs.servers.find((s) => s.ip === ip);
                if (oldServer) {
                    HomeJs.servers.splice(HomeJs.servers.indexOf(oldServer), 1);
                }

                if (data.visible) {
                    HomeJs.servers.push(data.server);
                }

                document.getElementById("browser").innerHTML = HomeJs.HomeServersView.get(HomeJs.servers);
                HomeJs.Time.loadTimeAgo();

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
     * @param {{time: number, scorer: string, scorerTeam: string, assisted: string, blunder: boolean}} data The blunder data.
     * @returns {void}
     */
    static blunder(ip, data) {
        const {scorer, scorerTeam} = data,
            game = HomeJs.Game.getGame(ip);

        if (!game.settings) {
            game.settings = {matchMode: "MONSTERBALL", friendlyFire: false};
        }

        if (!game.settings.matchMode) {
            game.settings.matchMode = "ANARCHY";
        }

        if (game.settings.matchMode !== "MONSTERBALL") {
            game.settings.matchMode = "MONSTERBALL";
            game.teamScore = {"BLUE": 0, "ORANGE": 0};
            /** @type {HTMLDivElement} */(document.getElementById(`game-${ip}`).querySelector(".map")).innerText = game.settings.matchMode; // eslint-disable-line no-extra-parens
        }

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
     * @param {{time: number, player: string, description: string}} data The connect data.
     * @returns {void}
     */
    static connect(ip, data) {
        const game = HomeJs.Game.getGame(ip),
            player = game.getPlayer(data.player);

        player.disconnected = false;
        player.connected = true;
        data.description = `${data.player} connected.`;
        game.events.push(data);
    }

    //        #      #
    //        #     # #
    //  ##   ###    #
    // #      #    ###
    // #      #     #
    //  ##     ##   #
    /**
     * Process the CTF stat.
     * @param {string} ip The IP address of the server to update.
     * @param {{time: number, event: string, scorer: string, scorerTeam: string}} data The CTF data.
     * @returns {void}
     */
    static ctf(ip, data) {
        const {event, scorer, scorerTeam} = data,
            game = HomeJs.Game.getGame(ip);

        if (!game.settings) {
            game.settings = {matchMode: "CTF", friendlyFire: false};
        }

        if (!game.settings.matchMode) {
            game.settings.matchMode = "ANARCHY";
        }

        if (game.settings.matchMode !== "CTF") {
            game.settings.matchMode = "CTF";
            game.teamScore = {"BLUE": 0, "ORANGE": 0};
            /** @type {HTMLDivElement} */(document.getElementById(`game-${ip}`).querySelector(".map")).innerText = game.settings.matchMode; // eslint-disable-line no-extra-parens
        }

        if (event === "Return" && !scorer) {
            game.flagStats.push(data);
            game.events.push(data);
            return;
        }

        game.events.push(data);
        game.flagStats.push(data);

        const scorerPlayer = game.getPlayer(scorer);

        scorerPlayer.team = scorerTeam;

        switch (event) {
            case "Return":
                scorerPlayer.returns++;
                break;
            case "Pickup":
                scorerPlayer.pickups++;
                break;
            case "Capture":
                scorerPlayer.captures++;

                if (game.teamScore[scorerTeam]) {
                    game.teamScore[scorerTeam]++;
                } else {
                    game.teamScore[scorerTeam] = 1;
                }

                break;
            case "CarrierKill":
                scorerPlayer.carrierKills++;
                break;
        }
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
     * @param {{time: number, player: string, description: string}} data The connect data.
     * @returns {void}
     */
    static disconnect(ip, data) {
        const game = HomeJs.Game.getGame(ip),
            player = game.getPlayer(data.player);

        if (!game.end) {
            player.disconnected = true;
            player.connected = false;
            data.description = `${data.player} disconnected.`;
            game.events.push(data);
        }
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
     * @param {{id: number, start: Date, end: Date, damage: object[], kills: object[], goals: object[], flagStats: object[], players: object[], teamScore: object}} data The end game data.
     * @returns {void}
     */
    static endGame(ip, data) {
        const {id, start, end, damage, kills, goals, flagStats, players, teamScore} = data,
            game = HomeJs.Game.getGame(ip);

        game.start = new Date(start);
        game.end = new Date(end);
        game.damage = damage;
        game.kills = kills;
        game.goals = goals;
        game.flagStats = flagStats;
        game.players = players;
        game.teamScore = teamScore;

        const gameEl = document.getElementById(`game-${ip}`);
        gameEl.parentNode.removeChild(gameEl);

        const gameId = `completed-${HomeJs.uuidv4()}`;

        document.getElementById("completed").insertAdjacentHTML("beforeend", /* html */`
            <div class="game" id="${gameId}">
                ${HomeJs.CommonCompletedDetailsView.get(game, true, id)}
            </div>
        `);

        HomeJs.Time.loadTimeAgo();

        game.remove();

        setTimeout(() => {
            const completedEl = document.getElementById(gameId);
            completedEl.parentNode.removeChild(completedEl);
        }, 3600000);
    }

    //              #     #     ##
    //                    #    #  #
    //  ##   #  #  ##    ###   #      ###  # #    ##
    // # ##   ##    #     #    # ##  #  #  ####  # ##
    // ##     ##    #     #    #  #  # ##  #  #  ##
    //  ##   #  #  ###     ##   ###   # #  #  #   ##
    /**
     * Removes a game.
     * @param {string} ip The IP address of the game to remove.
     * @returns {void}
     */
    static exitGame(ip) {
        const game = HomeJs.Game.getGame(ip);

        const gameEl = document.getElementById(`game-${ip}`);
        gameEl.parentNode.removeChild(gameEl);

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
     * @param {{time: number, scorer: string, scorerTeam: string, assisted: string, blunder: boolean}} data The goal data.
     * @returns {void}
     */
    static goal(ip, data) {
        const {scorer, scorerTeam, assisted} = data,
            game = HomeJs.Game.getGame(ip);

        if (!game.settings) {
            game.settings = {matchMode: "MONSTERBALL", friendlyFire: false};
        }

        if (!game.settings.matchMode) {
            game.settings.matchMode = "ANARCHY";
        }

        if (game.settings.matchMode !== "MONSTERBALL") {
            game.settings.matchMode = "MONSTERBALL";
            game.teamScore = {"BLUE": 0, "ORANGE": 0};
            /** @type {HTMLDivElement} */(document.getElementById(`game-${ip}`).querySelector(".map")).innerText = game.settings.matchMode; // eslint-disable-line no-extra-parens
        }

        game.events.push(data);
        game.goals.push(data);

        const scorerPlayer = game.getPlayer(scorer),
            assistedPlayer = game.getPlayer(assisted);

        scorerPlayer.team = scorerTeam;
        if (assistedPlayer) {
            assistedPlayer.team = scorerTeam;
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
            game = HomeJs.Game.getGame(ip);

        if (!game.settings) {
            game.settings = {matchMode: "ANARCHY", friendlyFire: false};
        }

        if (!game.settings.matchMode) {
            game.settings.matchMode = "ANARCHY";
        }

        if (game.settings.matchMode === "ANARCHY" && (attackerTeam || defenderTeam)) {
            game.settings.matchMode = "TEAM ANARCHY";
            /** @type {HTMLDivElement} */(document.getElementById(`game-${ip}`).querySelector(".map")).innerText = game.settings.matchMode; // eslint-disable-line no-extra-parens
        }

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

        if (attackerTeam && !game.teamScore[attackerTeam]) {
            game.teamScore[attackerTeam] = 0;
        }
        if (defenderTeam && !game.teamScore[defenderTeam]) {
            game.teamScore[defenderTeam] = 0;
        }

        if (attackerTeam && attackerTeam !== "ANARCHY" && attackerTeam === defenderTeam || attacker === defender) {
            attackerPlayer.kills--;
            defenderPlayer.deaths++;

            if ((!game.settings || !game.settings.matchMode || game.settings.matchMode !== "MONSTERBALL" && game.settings.matchMode !== "CTF") && attackerTeam && attackerTeam !== "ANARCHY") {
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

            if ((!game.settings || !game.settings.matchMode || game.settings.matchMode !== "MONSTERBALL" && game.settings.matchMode !== "CTF") && attackerTeam && attackerTeam !== "ANARCHY") {
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
        const game = HomeJs.Game.getGame(ip);

        game.server = data.server;
        game.settings = data;
        game.inLobby = data.type === "LobbyStatus";
        game.players = data.players && data.players.map((player) => new HomeJs.Player({
            name: player,
            kills: 0,
            assists: 0,
            deaths: 0,
            goals: 0,
            goalAssists: 0,
            blunders: 0,
            returns: 0,
            pickups: 0,
            captures: 0,
            carrierKills: 0,
            connected: data.time
        })) || [];
        game.countdown = data.countdown;
        game.elapsed = data.elapsed;

        let gameEl = document.getElementById(`game-${ip}`);

        if (!gameEl) {
            document.getElementById("games").insertAdjacentHTML("beforeend", /* html */`
                <div class="game" id="game-${ip}">
                </div>
            `);
            gameEl = document.getElementById(`game-${ip}`);
        }

        gameEl.innerHTML = HomeJs.CommonDetailsView.get(game, true);

        const el = gameEl.querySelector(".timer");

        if (!game.inLobby) {
            if (game.countdown) {
                new HomeJs.Countdown(game.countdown, el);
            } else if (game.elapsed || game.elapsed === 0) {
                new HomeJs.Elapsed(game.elapsed, el);
            }
        }
    }

    //  #                       ##   #
    //  #                      #  #  #
    // ###    ##    ###  # #   #     ###    ###  ###    ###   ##
    //  #    # ##  #  #  ####  #     #  #  #  #  #  #  #  #  # ##
    //  #    ##    # ##  #  #  #  #  #  #  # ##  #  #   ##   ##
    //   ##   ##    # #  #  #   ##   #  #   # #  #  #  #      ##
    //                                                  ###
    /**
     *
     * @param {string} ip The IP address of the server to update.
     * @param {{time: number, playerName: string, previousTeam: string, currentTeam: string}} data The teamChange data.
     * @returns {void}
     */
    static teamChange(ip, data) {
        const game = HomeJs.Game.getGame(ip);

        game.events.push(data);
        game.teamChanges.push(data);
    }

    //              #       #          #
    //                      #         ##
    // #  #  #  #  ##     ###  # #   # #
    // #  #  #  #   #    #  #  # #   ####
    // #  #  #  #   #    #  #  # #     #
    //  ###   ###  ###    ###   #      #
    /**
     * Gets a unique UUID.
     * @returns {string} The UUID.
     */
    static uuidv4() {
        return (1e7.toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
    }
}

document.addEventListener("DOMContentLoaded", HomeJs.DOMContentLoaded);

/** @type {object[]} */
HomeJs.servers = null;

/** @type {import("./common/websocketclient")} */
HomeJs.ws = null;

/** @type {typeof import("../views/common/completedDetails")} */
// @ts-ignore
HomeJs.CommonCompletedDetailsView = typeof CommonCompletedDetailsView === "undefined" ? require("../views/common/completedDetails") : CommonCompletedDetailsView; // eslint-disable-line no-undef

/** @type {typeof import("../views/common/details")} */
// @ts-ignore
HomeJs.CommonDetailsView = typeof CommonDetailsView === "undefined" ? require("../views/common/details") : CommonDetailsView; // eslint-disable-line no-undef

/** @type {typeof import("../views/common/playerCount")} */
// @ts-ignore
HomeJs.CommonPlayerCountView = typeof CommonPlayerCountView === "undefined" ? require("../views/common/playerCount") : CommonPlayerCountView; // eslint-disable-line no-undef

/** @type {typeof import("../views/common/score")} */
// @ts-ignore
HomeJs.CommonScoreView = typeof CommonScoreView === "undefined" ? require("../views/common/score") : CommonScoreView; // eslint-disable-line no-undef

/** @type {typeof import("./common/countdown")} */
// @ts-ignore
HomeJs.Countdown = typeof Countdown === "undefined" ? require("./common/countdown") : Countdown; // eslint-disable-line no-undef

/** @type {typeof import("./common/elapsed")} */
// @ts-ignore
HomeJs.Elapsed = typeof Elapsed === "undefined" ? require("./common/elapsed") : Elapsed; // eslint-disable-line no-undef

/** @type {typeof import("./common/game")} */
// @ts-ignore
HomeJs.Game = typeof Game === "undefined" ? require("./common/game") : Game; // eslint-disable-line no-undef

/** @type {typeof import("../views/home/servers")} */
// @ts-ignore
HomeJs.HomeServersView = typeof HomeServersView === "undefined" ? require("../views/home/servers") : HomeServersView; // eslint-disable-line no-undef

/** @type {typeof import("./common/player")} */
// @ts-ignore
HomeJs.Player = typeof Player === "undefined" ? require("./common/player") : Player; // eslint-disable-line no-undef

/** @type {typeof import("./common/time")} */
// @ts-ignore
HomeJs.Time = typeof Time === "undefined" ? require("./common/time") : Time; // eslint-disable-line no-undef

/** @type {typeof import("./common/websocketclient")} */
// @ts-ignore
HomeJs.WebSocketClient = typeof WebSocketClient === "undefined" ? require("./common/websocketclient") : WebSocketClient; // eslint-disable-line no-undef
