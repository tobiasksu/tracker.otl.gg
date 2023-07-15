/**
 * @typedef {import("../../js/common/game")} Game
 */

//   ###                                      ####           #              #     ##           #   #    #
//  #   #                                      #  #          #                     #           #   #
//  #       ###   ## #   ## #    ###   # ##    #  #   ###   ####    ###    ##      #     ###   #   #   ##     ###   #   #
//  #      #   #  # # #  # # #  #   #  ##  #   #  #  #   #   #         #    #      #    #       # #     #    #   #  #   #
//  #      #   #  # # #  # # #  #   #  #   #   #  #  #####   #      ####    #      #     ###    # #     #    #####  # # #
//  #   #  #   #  # # #  # # #  #   #  #   #   #  #  #       #  #  #   #    #      #        #   # #     #    #      # # #
//   ###    ###   #   #  #   #   ###   #   #  ####    ###     ##    ####   ###    ###   ####     #     ###    ###    # #
/**
 * A class that represents the game details view.
 */
class CommonDetailsView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered details template.
     * @param {Game} game The game to display.
     * @param {boolean} addLink Add a link to the game page.
     * @returns {string} An HTML string of the rendered details template.
     */
    static get(game, addLink) {
        // @ts-ignore
        if (typeof window !== "undefined") {
            // @ts-ignore
            setTimeout(CommonDetailsView.Countdown.create, 1);
        }

        return /* html */`
            <div class="table">
                <div class="server">${addLink ? /* html */`
                    <a href="/game/${game.ip}">
                        ` : ""}${CommonDetailsView.Encoding.htmlEncode(game.server && game.server.name || game.server && game.server.ip || game.ip || "Unknown")}${addLink ? /* html */`
                    </a>${game.inLobby || game.settings && game.settings.joinInProgress ? /* html */`<br />Join at ${game.ip} <button class="copy" data-clipboard-text="${game.ip}">&#x1F4CB;</button>` : ""}
                ` : ""}</div>
                <div class="scores">
                    ${CommonDetailsView.CommonScoreView.get(game)}
                </div>
                <div class="info">
                    <div class="time">
                        <span class="playerCount">
                            ${CommonDetailsView.CommonPlayerCountView.get(game)}
                        </span>
                        <span class="timer">
                            ${game.inLobby ? /* html */`
                                In Lobby<br />${game.settings.players.length}/${game.settings.maxPlayers} Players
                            ` : game.countdown ? /* html */`
                                <script>new Countdown(${game.countdown});</script>
                            ` : game.elapsed || game.elapsed === 0 ? /* html */`
                                <script>new Elapsed(${game.elapsed});</script>
                            ` : ""}
                        </span>
                    </div>
                    ${game.settings ? /* html */`
                        <div class="map">${CommonDetailsView.Encoding.htmlEncode(game.settings.matchMode)}${game.settings.level && ` - ${CommonDetailsView.Encoding.htmlEncode(game.settings.level)}` || ""}</div>
                    ` : ""}
                    ${game.condition ? /* html */`
                        <div class="condition">${game.condition}</div>
                    ` : ""}
                </div>
            </div>
        `;
    }
}

/** @type {typeof import("../../js/common/countdown")} */
// @ts-ignore
CommonDetailsView.Countdown = typeof Countdown === "undefined" ? require("../../js/common/countdown") : Countdown; // eslint-disable-line no-undef

/** @type {typeof import("../../js/common/encoding")} */
// @ts-ignore
CommonDetailsView.Encoding = typeof Encoding === "undefined" ? require("../../js/common/encoding") : Encoding; // eslint-disable-line no-undef

/** @type {typeof import("./playerCount")} */
// @ts-ignore
CommonDetailsView.CommonPlayerCountView = typeof CommonPlayerCountView === "undefined" ? require("./playerCount") : CommonPlayerCountView; // eslint-disable-line no-undef

/** @type {typeof import("./score")} */
// @ts-ignore
CommonDetailsView.CommonScoreView = typeof CommonScoreView === "undefined" ? require("./score") : CommonScoreView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.CommonDetailsView = CommonDetailsView;
} else {
    module.exports = CommonDetailsView; // eslint-disable-line no-undef
}
