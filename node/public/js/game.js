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
        const {data} = JSON.parse(ev.data),
            map = /** @type {HTMLDivElement} */(document.querySelector(".map")); // eslint-disable-line no-extra-parens

        switch (data.name) {
            case "Stats": {
                switch (data.type) {
                    case "StartGame":
                    case "LobbyStatus": {
                        GameJs.game.startGame(data);

                        const timerEl = document.querySelector(".timer");

                        if (!GameJs.game.inLobby) {
                            if (GameJs.game.countdown) {
                                new GameJs.Countdown(GameJs.game.countdown, timerEl);
                            } else if (GameJs.game.elapsed || GameJs.game.elapsed === 0) {
                                new GameJs.Elapsed(GameJs.game.elapsed, timerEl);
                            }
                        }
                        break;
                    }
                    case "Kill":
                        GameJs.game.kill(data);
                        document.getElementById("players").innerHTML = GameJs.CommonPlayersView.get(GameJs.game);
                        if (map.innerText === "" || map.innerText === "ANARCHY") {
                            map.innerText = GameJs.game.settings.matchMode;
                        }
                        break;
                    case "Goal":
                        GameJs.game.goal(data);
                        document.getElementById("players").innerHTML = GameJs.CommonPlayersView.get(GameJs.game);
                        if (map.innerText === "" || map.innerText === "ANARCHY" || map.innerText === "TEAM ANARCHY") {
                            map.innerText = "MONSTERBALL";
                        }
                        break;
                    case "Blunder":
                        GameJs.game.blunder(data);
                        document.getElementById("players").innerHTML = GameJs.CommonPlayersView.get(GameJs.game);
                        if (map.innerText === "" || map.innerText === "ANARCHY" || map.innerText === "TEAM ANARCHY") {
                            map.innerText = "MONSTERBALL";
                        }
                        break;
                    case "CTF":
                        GameJs.game.ctf(data);
                        document.getElementById("players").innerHTML = GameJs.CommonPlayersView.get(GameJs.game);
                        if (map.innerText === "" || map.innerText === "ANARCHY" || map.innerText === "TEAM ANARCHY") {
                            map.innerText = "CTF";
                        }
                        break;
                    case "Connect":
                        GameJs.game.connect(data);
                        break;
                    case "Disconnect":
                        GameJs.game.disconnect(data);
                        break;
                    case "EndGame":
                        window.location.replace(`/archive/${data.id}`);
                        return;
                    case "ExitGame":
                        window.location.replace("/");
                        return;
                    case "TeamChange":
                        GameJs.game.teamChange(data);
                        document.getElementById("players").innerHTML = GameJs.CommonPlayersView.get(GameJs.game);
                        break;
                }

                document.getElementById("game").querySelector(".scores").innerHTML = GameJs.CommonScoreView.get(GameJs.game);
                document.getElementById("game").querySelector(".playerCount").innerHTML = GameJs.CommonPlayerCountView.get(GameJs.game);
                document.getElementById("events").innerHTML = GameJs.CommonEventsView.get(GameJs.game);

                break;
            }
        }
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

/** @type {typeof import("./common/time")} */
// @ts-ignore
GameJs.Time = typeof Time === "undefined" ? require("./common/time") : Time; // eslint-disable-line no-undef

/** @type {typeof import("./common/websocketclient")} */
// @ts-ignore
GameJs.WebSocketClient = typeof WebSocketClient === "undefined" ? require("./common/websocketclient") : WebSocketClient; // eslint-disable-line no-undef
