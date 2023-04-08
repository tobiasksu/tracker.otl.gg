//   ###                                              ###                               #   #    #
//  #   #                                            #   #                              #   #
//  #      #   #  ## #   ## #    ###   # ##   #   #  #       ###   ## #    ###    ###   #   #   ##     ###   #   #
//   ###   #   #  # # #  # # #      #  ##  #  #   #  #          #  # # #  #   #  #       # #     #    #   #  #   #
//      #  #   #  # # #  # # #   ####  #      #  ##  #  ##   ####  # # #  #####   ###    # #     #    #####  # # #
//  #   #  #  ##  # # #  # # #  #   #  #       ## #  #   #  #   #  # # #  #          #   # #     #    #      # # #
//   ###    ## #  #   #  #   #   ####  #          #   ###    ####  #   #   ###   ####     #     ###    ###    # #
//                                            #   #
//                                             ###
/**
 * A class that represents the games view.
 */
class SummaryGamesView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered games template.
     * @param {object[]} games The games to display.
     * @returns {string} An HTML string of the rendered games template.
     */
    static get(games) {
        const list = Object.keys(games).map((s) => {
            let difference, days;

            if (games[s].countdown) {
                difference = games[s].countdown;
                days = Math.floor(Math.abs(difference) / (24 * 60 * 60 * 1000));
            } else if (games[s].elapsed) {
                difference = games[s].elapsed - new Date().getTime();
                days = Math.floor(Math.abs(difference) / (24 * 60 * 60 * 1000));
            }

            return /* html */`
                <div class="server">
                    <a href="/game/${games[s].ip}">${SummaryGamesView.Encoding.htmlEncode(games[s].server && games[s].server.name || games[s].server && games[s].server.ip || games[s].ip || "Unknown")}</a>
                    </a>${games[s].inLobby || games[s].settings && games[s].settings.joinInProgress ? /* html */`, Join at ${games[s].ip} <button class="copy" data-clipboard-text="${games[s].ip}">&#x1F4CB;</button>` : ""}
                </div>
                <div class="time">
                    ${games[s].inLobby ? /* html */`
                        In Lobby, ${games[s].settings.players.length}/${games[s].settings.maxPlayers} Players
                    ` : games[s].countdown ? /* html */`
                        ${days > 0 ? `${days} day${days === 1 ? "" : "s"} ` : ""}${new Date(difference).toLocaleString("en-US", {timeZone: "GMT", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"})}
                    ` : games[s].elapsed || games[s].elapsed === 0 ? /* html */`
                        ${days > 0 ? `${days} day${days === 1 ? "" : "s"} ` : ""}${new Date(difference).toLocaleString("en-US", {timeZone: "GMT", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"})}
                    ` : ""}
                </div>
                <div class="map">
                    ${games[s].settings ? /* html */`
                        ${SummaryGamesView.Encoding.htmlEncode(games[s].settings.matchMode)}${games[s].settings.level && ` - ${SummaryGamesView.Encoding.htmlEncode(games[s].settings.level)}` || ""}
                    ` : ""}
                </div>
                <div class="condition">
                    ${games[s].settings && games[s].settings.condition ? /* html */`
                        ${games[s].settings.condition}
                    ` : ""}
                </div>
                <div class="scores">
                    ${games[s].teamScore && Object.keys(games[s].teamScore).sort((a, b) => games[s].teamScore[b] - games[s].teamScore[a]).slice(0, 4).map((team) => /* html */`
                        ${SummaryGamesView.Encoding.htmlEncode(team)} ${games[s].teamScore[team]}
                    `.trim()).join(", ") || games[s].players && games[s].players.length > 0 && games[s].players.sort((a, b) => b.kills * (games[s].players.length > 2 ? 3 : 1) + b.assists - (a.kills * (games[s].players.length > 2 ? 3 : 1) + a.assists)).slice(0, 4).map((player) => /* html */`
                        ${SummaryGamesView.Encoding.htmlEncode(player.name)} ${player.kills * (games[s].players.length > 2 ? 3 : 1) + player.assists}
                    `.trim()).join(", ") || ""}${games[s].teamScore && Object.keys(games[s].teamScore).length > 4 || (!games[s].teamScore || games[s].teamScore.length === 0) && games[s].players && games[s].players.length > 4 ? ", ..." : ""}
                </div>
            `;
        });

        return list.join("");
    }
}

/** @type {typeof import("../../js/common/encoding")} */
// @ts-ignore
SummaryGamesView.Encoding = typeof Encoding === "undefined" ? require("../../js/common/encoding") : Encoding; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.SummaryGamesView = SummaryGamesView;
} else {
    module.exports = SummaryGamesView; // eslint-disable-line no-undef
}
