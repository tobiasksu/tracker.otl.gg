/**
 * @typedef {import("../../types/messageTypes").MessageData} MessageTypes.MessageData
 * @typedef {import("../../types/serverTypes").LocalServer} ServerTypes.LocalServer
 */

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
     * @param {MessageEvent<string>} ev The data received.
     * @returns {void}
     */
    static onmessage(ev) {
        /** @type {MessageTypes.MessageData} */
        const msg = JSON.parse(ev.data);

        const {ip, data} = msg,
            game = HomeJs.Game.getGame(ip);

        let gameEl = document.getElementById(`game-${ip}`);

        const map = gameEl ? /** @type {HTMLDivElement} */(gameEl.querySelector(".map")) : void 0; // eslint-disable-line no-extra-parens

        switch (data.name) {
            case "Stats":
                switch (data.type) {
                    case "StartGame":
                    case "LobbyStatus": {
                        game.startGame(data);

                        if (!gameEl) {
                            document.getElementById("games").insertAdjacentHTML("beforeend", /* html */`
                                <div class="game" id="game-${ip}">
                                </div>
                            `);
                            gameEl = document.getElementById(`game-${ip}`);
                        }

                        gameEl.innerHTML = HomeJs.CommonDetailsView.get(game, true);

                        const timerEl = gameEl.querySelector(".timer");

                        if (!game.inLobby) {
                            if (game.countdown) {
                                new HomeJs.Countdown(game.countdown, timerEl);
                            } else if (game.elapsed || game.elapsed === 0) {
                                new HomeJs.Elapsed(game.elapsed, timerEl);
                            }
                        }

                        break;
                    }
                    case "Kill":
                        game.kill(data);
                        if (map.innerText === "" || map.innerText === "ANARCHY") {
                            map.innerText = game.settings.matchMode;
                        }
                        break;
                    case "Goal":
                        game.goal(data);
                        if (map.innerText === "" || map.innerText === "ANARCHY" || map.innerText === "TEAM ANARCHY") {
                            map.innerText = "MONSTERBALL";
                        }
                        break;
                    case "Blunder":
                        game.blunder(data);
                        if (map.innerText === "" || map.innerText === "ANARCHY" || map.innerText === "TEAM ANARCHY") {
                            map.innerText = "MONSTERBALL";
                        }
                        break;
                    case "CTF":
                        game.ctf(data);
                        if (map.innerText === "" || map.innerText === "ANARCHY" || map.innerText === "TEAM ANARCHY") {
                            map.innerText = "CTF";
                        }
                        break;
                    case "Connect":
                        game.connect(data);
                        break;
                    case "Disconnect":
                        game.disconnect(data);
                        break;
                    case "TeamChange":
                        game.teamChange(data);
                        break;
                }

                gameEl = document.getElementById(`game-${ip}`);

                gameEl.querySelector(".scores").innerHTML = HomeJs.CommonScoreView.get(game);
                gameEl.querySelector(".playerCount").innerHTML = HomeJs.CommonPlayerCountView.get(game);

                if (data.type === "EndGame") {
                    game.endGame(data);

                    gameEl.parentNode.removeChild(gameEl);

                    const gameId = `completed-${data.id}`;

                    document.getElementById("completed").insertAdjacentHTML("beforeend", /* html */`
                        <div class="game" id="${gameId}">
                            ${HomeJs.CommonCompletedDetailsView.get(game, true, data.id)}
                        </div>
                    `);

                    HomeJs.Time.loadTimeAgo();

                    game.remove();

                    setTimeout(() => {
                        const completedEl = document.getElementById(gameId);
                        completedEl.parentNode.removeChild(completedEl);
                    }, 3600000);

                }
                if (data.type === "LobbyExit") {
                    gameEl.parentNode.removeChild(gameEl);

                    game.remove();
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
}

document.addEventListener("DOMContentLoaded", HomeJs.DOMContentLoaded);

/** @type {ServerTypes.LocalServer[]} */
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

/** @type {typeof import("./common/time")} */
// @ts-ignore
HomeJs.Time = typeof Time === "undefined" ? require("./common/time") : Time; // eslint-disable-line no-undef

/** @type {typeof import("./common/websocketclient")} */
// @ts-ignore
HomeJs.WebSocketClient = typeof WebSocketClient === "undefined" ? require("./common/websocketclient") : WebSocketClient; // eslint-disable-line no-undef
