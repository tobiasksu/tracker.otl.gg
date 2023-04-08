//   ###                          ###
//  #   #                           #
//  #       ###   ## #    ###       #   ###
//  #          #  # # #  #   #      #  #
//  #  ##   ####  # # #  #####      #   ###
//  #   #  #   #  # # #  #      #   #      #
//   ###    ####  #   #   ###    ###   ####
/**
 * A class that provides functions for the game page.
 */
class GameJs {
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
        GameJs.Time.loadTimeAgo();

        const el = /** @type {HTMLAnchorElement} */(document.getElementById("live-updates")); // eslint-disable-line no-extra-parens

        if (GameJs.Time.live) {
            GameJs.ws = new GameJs.WebSocketClient(`ws${window.location.protocol === "https:" ? "s" : ""}://${window.location.host}/game/${GameJs.game.ip}`);
            GameJs.ws.instance.onmessage = GameJs.onmessage;
            GameJs.ws.open();
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
     * @returns {object} The return.
     */
    static onmessage(ev) {
        const {data} = JSON.parse(ev.data);

        switch (data.name) {
            case "Stats": {
                switch (data.type) {
                    case "StartGame":
                    case "LobbyStatus":
                        GameJs.startGame(data);
                        break;
                    case "Kill":
                        GameJs.kill(data);
                        break;
                    case "Goal":
                        GameJs.goal(data);
                        break;
                    case "Blunder":
                        GameJs.blunder(data);
                        break;
                    case "CTF":
                        GameJs.ctf(data);
                        break;
                    case "Connect":
                        GameJs.connect(data);
                        break;
                    case "Disconnect":
                        GameJs.disconnect(data);
                        break;
                    case "EndGame":
                        GameJs.endGame(data);
                        break;
                    case "TeamChange":
                        GameJs.teamChange(data);
                        break;
                }

                document.getElementById("game").querySelector(".scores").innerHTML = GameJs.CommonScoreView.get(GameJs.game);
                document.getElementById("game").querySelector(".playerCount").innerHTML = GameJs.CommonPlayerCountView.get(GameJs.game);
                document.getElementById("events").innerHTML = GameJs.CommonEventsView.get(GameJs.game);

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
     * @param {{time: number, scorer: string, scorerTeam: string, blunder: boolean, assisted: string}} data The blunder data.
     * @returns {void}
     */
    static blunder(data) {
        const {scorer, scorerTeam} = data;

        if (!GameJs.game.settings) {
            GameJs.game.settings = {matchMode: "MONSTERBALL", friendlyFire: false};
        }

        if (!GameJs.game.settings.matchMode) {
            GameJs.game.settings.matchMode = "ANARCHY";
        }

        if (GameJs.game.settings.matchMode !== "MONSTERBALL") {
            GameJs.game.settings.matchMode = "MONSTERBALL";
            GameJs.game.teamScore = {"BLUE": 0, "ORANGE": 0};
            /** @type {HTMLDivElement} */(document.querySelector(".map")).innerText = GameJs.game.settings.matchMode; // eslint-disable-line no-extra-parens
        }

        GameJs.game.events.push(data);
        GameJs.game.goals.push(data);

        const scorerPlayer = GameJs.game.getPlayer(scorer);

        scorerPlayer.team = scorerTeam;

        scorerPlayer.blunders++;

        const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";

        if (GameJs.game.teamScore[otherTeam]) {
            GameJs.game.teamScore[otherTeam]++;
        } else {
            GameJs.game.teamScore[otherTeam] = 1;
        }

        document.getElementById("players").innerHTML = GameJs.CommonPlayersView.get(GameJs.game);
    }

    //                                      #
    //                                      #
    //  ##    ##   ###   ###    ##    ##   ###
    // #     #  #  #  #  #  #  # ##  #      #
    // #     #  #  #  #  #  #  ##    #      #
    //  ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Processes the connect stat.
     * @param {{time: number, player: string, description: string}} data The connect data.
     * @returns {void}
     */
    static connect(data) {
        const player = GameJs.game.getPlayer(data.player);

        player.disconnected = false;
        player.connected = true;
        data.description = `${data.player} connected.`;
        GameJs.game.events.push(data);
    }

    //        #      #
    //        #     # #
    //  ##   ###    #
    // #      #    ###
    // #      #     #
    //  ##     ##   #
    /**
     * Process the CTF stat.
     * @param {{time: number, event: string, scorer: string, scorerTeam: string}} data The CTF data.
     * @returns {void}
     */
    static ctf(data) {
        const {event, scorer, scorerTeam} = data;

        if (!GameJs.game.settings) {
            GameJs.game.settings = {matchMode: "CTF", friendlyFire: false};
        }

        if (!GameJs.game.settings.matchMode) {
            GameJs.game.settings.matchMode = "ANARCHY";
        }

        if (GameJs.game.settings.matchMode !== "CTF") {
            GameJs.game.settings.matchMode = "CTF";
            GameJs.game.teamScore = {"BLUE": 0, "ORANGE": 0};
            /** @type {HTMLDivElement} */(document.querySelector(".map")).innerText = GameJs.game.settings.matchMode; // eslint-disable-line no-extra-parens
        }

        if (event === "Return" && !scorer) {
            GameJs.game.flagStats.push(data);
            GameJs.game.events.push(data);
            return;
        }

        GameJs.game.events.push(data);
        GameJs.game.flagStats.push(data);

        const scorerPlayer = GameJs.game.getPlayer(scorer);

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

                if (GameJs.game.teamScore[scorerTeam]) {
                    GameJs.game.teamScore[scorerTeam]++;
                } else {
                    GameJs.game.teamScore[scorerTeam] = 1;
                }

                break;
            case "CarrierKill":
                scorerPlayer.carrierKills++;
                break;
        }

        document.getElementById("players").innerHTML = GameJs.CommonPlayersView.get(GameJs.game);
    }

    //    #   #                                                #
    //    #                                                    #
    //  ###  ##     ###    ##    ##   ###   ###    ##    ##   ###
    // #  #   #    ##     #     #  #  #  #  #  #  # ##  #      #
    // #  #   #      ##   #     #  #  #  #  #  #  ##    #      #
    //  ###  ###   ###     ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Processes the disconnect stat.
     * @param {{time: number, player: string, description: string}} data The connect data.
     * @returns {void}
     */
    static disconnect(data) {
        const player = GameJs.game.getPlayer(data.player);

        if (!GameJs.game.end) {
            player.disconnected = true;
            player.connected = false;
            data.description = `${data.player} disconnected.`;
            GameJs.game.events.push(data);
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
     * @param {{start: Date, end: Date, damage: object[], kills: object[], goals: object[], flagStats: object[], players: object[], teamScore: object}} data The end game data.
     * @returns {void}
     */
    static endGame(data) {
        const {start, end, damage, kills, goals, flagStats, players, teamScore} = data;

        GameJs.game.start = new Date(start);
        GameJs.game.end = new Date(end);
        GameJs.game.damage = damage || [];
        GameJs.game.kills = kills || [];
        GameJs.game.goals = goals || [];
        GameJs.game.flagStats = flagStats || [];
        GameJs.game.players = players || [];
        GameJs.game.teamScore = teamScore || {};

        GameJs.ws.instance.close();

        document.getElementById("players").innerHTML = GameJs.CommonPlayersView.get(GameJs.game);
        document.querySelector("#game .timer").innerHTML = /* html */`
            Completed <time class="timeago" datetime="${new Date(GameJs.game.end).toISOString()}">${new Date(GameJs.game.end)}</time>
        `;

        GameJs.Time.loadTimeAgo();
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
     * @param {{time: number, scorer: string, scorerTeam: string, assisted: string, blunder: boolean}} data The goal data.
     * @returns {void}
     */
    static goal(data) {
        const {scorer, scorerTeam, assisted} = data;

        if (!GameJs.game.settings) {
            GameJs.game.settings = {matchMode: "ANARCHY", friendlyFire: false};
        }

        if (!GameJs.game.settings.matchMode) {
            GameJs.game.settings.matchMode = "ANARCHY";
        }

        if (GameJs.game.settings.matchMode !== "MONSTERBALL") {
            GameJs.game.settings.matchMode = "MONSTERBALL";
            GameJs.game.teamScore = {"BLUE": 0, "ORANGE": 0};
            /** @type {HTMLDivElement} */(document.querySelector(".map")).innerText = GameJs.game.settings.matchMode; // eslint-disable-line no-extra-parens
        }

        GameJs.game.events.push(data);
        GameJs.game.goals.push(data);

        const scorerPlayer = GameJs.game.getPlayer(scorer),
            assistedPlayer = GameJs.game.getPlayer(assisted);

        scorerPlayer.team = scorerTeam;
        if (assistedPlayer) {
            assistedPlayer.team = scorerTeam;
        }

        scorerPlayer.goals++;
        if (assistedPlayer) {
            assistedPlayer.goalAssists++;
        }

        if (GameJs.game.teamScore[scorerTeam]) {
            GameJs.game.teamScore[scorerTeam]++;
        } else {
            GameJs.game.teamScore[scorerTeam] = 1;
        }

        document.getElementById("players").innerHTML = GameJs.CommonPlayersView.get(GameJs.game);
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

        if (!GameJs.game.settings) {
            GameJs.game.settings = {matchMode: "ANARCHY", friendlyFire: false};
        }

        if (!GameJs.game.settings.matchMode) {
            GameJs.game.settings.matchMode = "ANARCHY";
        }

        if (GameJs.game.settings.matchMode === "ANARCHY" && (attackerTeam || defenderTeam)) {
            GameJs.game.settings.matchMode = "TEAM ANARCHY";
            /** @type {HTMLDivElement} */(document.querySelector(".map")).innerText = GameJs.game.settings.matchMode; // eslint-disable-line no-extra-parens
        }

        GameJs.game.events.push(data);
        GameJs.game.kills.push(data);

        const attackerPlayer = GameJs.game.getPlayer(attacker),
            defenderPlayer = GameJs.game.getPlayer(defender),
            assistedPlayer = GameJs.game.getPlayer(assisted);

        attackerPlayer.team = attackerTeam;
        defenderPlayer.team = defenderTeam;
        if (assistedPlayer) {
            assistedPlayer.team = assistedTeam;
        }

        if (attackerTeam && !GameJs.game.teamScore[attackerTeam]) {
            GameJs.game.teamScore[attackerTeam] = 0;
        }
        if (defenderTeam && !GameJs.game.teamScore[defenderTeam]) {
            GameJs.game.teamScore[defenderTeam] = 0;
        }

        if (attackerTeam && attackerTeam !== "ANARCHY" && attackerTeam === defenderTeam) {
            attackerPlayer.kills--;
            defenderPlayer.deaths++;

            if ((!GameJs.game.settings || GameJs.game.settings.matchMode !== "MONSTERBALL" && GameJs.game.settings.matchMode !== "CTF") && attackerTeam && attackerTeam !== "ANARCHY") {
                if (GameJs.game.teamScore[attackerTeam]) {
                    GameJs.game.teamScore[attackerTeam]--;
                } else {
                    GameJs.game.teamScore[attackerTeam] = -1;
                }
            }
        } else {
            attackerPlayer.kills++;
            defenderPlayer.deaths++;
            if (assistedPlayer) {
                assistedPlayer.assists++;
            }

            if ((!GameJs.game.settings || GameJs.game.settings.matchMode !== "MONSTERBALL" && GameJs.game.settings.matchMode !== "CTF") && attackerTeam && attackerTeam !== "ANARCHY") {
                if (GameJs.game.teamScore[attackerTeam]) {
                    GameJs.game.teamScore[attackerTeam]++;
                } else {
                    GameJs.game.teamScore[attackerTeam] = 1;
                }
            }
        }

        document.getElementById("players").innerHTML = GameJs.CommonPlayersView.get(GameJs.game);
    }

    //         #                 #     ##
    //         #                 #    #  #
    //  ###   ###    ###  ###   ###   #      ###  # #    ##
    // ##      #    #  #  #  #   #    # ##  #  #  ####  # ##
    //   ##    #    # ##  #      #    #  #  # ##  #  #  ##
    // ###      ##   # #  #       ##   ###   # #  #  #   ##
    /**
     * Processes the start game stat.
     * @param {object} data The start game data.
     * @returns {void}
     */
    static startGame(data) {
        GameJs.game.server = data.server;
        GameJs.game.settings = data;
        GameJs.game.inLobby = data.type === "LobbyStatus";
        GameJs.game.players = data.players && data.players.map((player) => new GameJs.Player({
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
        GameJs.game.countdown = data.countdown;
        GameJs.game.elapsed = data.elapsed;

        const el = document.querySelector(".timer");

        if (!GameJs.game.inLobby) {
            if (GameJs.game.countdown) {
                new GameJs.Countdown(GameJs.game.countdown, el);
            } else if (GameJs.game.elapsed || GameJs.game.elapsed === 0) {
                new GameJs.Elapsed(GameJs.game.elapsed, el);
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
     * Processes the TeamChange stat.
     * @param {{time: number, playerName: string, previousTeam: string, currentTeam: string }} data The teamChange data.
     * @returns {void}
     */
    static teamChange(data) {
        GameJs.game.events.push(data);
        GameJs.game.teamChanges.push(data);

        const player = GameJs.game.getPlayer(data.playerName);
        player.team = data.currentTeam;

        document.getElementById("players").innerHTML = GameJs.CommonPlayersView.get(GameJs.game);
    }
}

document.addEventListener("DOMContentLoaded", GameJs.DOMContentLoaded);

/** @type {import("./common/game")} */
GameJs.game = null;

/** @type {import("./common/websocketclient")} */
GameJs.ws = null;

/** @type {typeof import("../views/common/events")} */
// @ts-ignore
GameJs.CommonEventsView = typeof CommonEventsView === "undefined" ? require("../views/common/events") : CommonEventsView; // eslint-disable-line no-undef

/** @type {typeof import("../views/common/playerCount")} */
// @ts-ignore
GameJs.CommonPlayerCountView = typeof CommonPlayerCountView === "undefined" ? require("../views/common/playerCount") : CommonPlayerCountView; // eslint-disable-line no-undef

/** @type {typeof import("../views/common/players")} */
// @ts-ignore
GameJs.CommonPlayersView = typeof CommonPlayersView === "undefined" ? require("../views/common/players") : CommonPlayersView; // eslint-disable-line no-undef

/** @type {typeof import("../views/common/score")} */
// @ts-ignore
GameJs.CommonScoreView = typeof CommonScoreView === "undefined" ? require("../views/common/score") : CommonScoreView; // eslint-disable-line no-undef

/** @type {typeof import("./common/countdown")} */
// @ts-ignore
GameJs.Countdown = typeof Countdown === "undefined" ? require("./common/countdown") : Countdown; // eslint-disable-line no-undef

/** @type {typeof import("./common/elapsed")} */
// @ts-ignore
GameJs.Elapsed = typeof Elapsed === "undefined" ? require("./common/elapsed") : Elapsed; // eslint-disable-line no-undef

/** @type {typeof import("./common/player")} */
// @ts-ignore
GameJs.Player = typeof Player === "undefined" ? require("./common/player") : Player; // eslint-disable-line no-undef

/** @type {typeof import("./common/time")} */
// @ts-ignore
GameJs.Time = typeof Time === "undefined" ? require("./common/time") : Time; // eslint-disable-line no-undef

/** @type {typeof import("./common/websocketclient")} */
// @ts-ignore
GameJs.WebSocketClient = typeof WebSocketClient === "undefined" ? require("./common/websocketclient") : WebSocketClient; // eslint-disable-line no-undef
