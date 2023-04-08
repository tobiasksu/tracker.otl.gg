//   ###                                              ###                         ##            #                #   ###                               #   #    #
//  #   #                                            #   #                         #            #                #  #   #                              #   #
//  #      #   #  ## #   ## #    ###   # ##   #   #  #       ###   ## #   # ##     #     ###   ####    ###    ## #  #       ###   ## #    ###    ###   #   #   ##     ###   #   #
//   ###   #   #  # # #  # # #      #  ##  #  #   #  #      #   #  # # #  ##  #    #    #   #   #     #   #  #  ##  #          #  # # #  #   #  #       # #     #    #   #  #   #
//      #  #   #  # # #  # # #   ####  #      #  ##  #      #   #  # # #  ##  #    #    #####   #     #####  #   #  #  ##   ####  # # #  #####   ###    # #     #    #####  # # #
//  #   #  #  ##  # # #  # # #  #   #  #       ## #  #   #  #   #  # # #  # ##     #    #       #  #  #      #  ##  #   #  #   #  # # #  #          #   # #     #    #      # # #
//   ###    ## #  #   #  #   #   ####  #          #   ###    ###   #   #  #       ###    ###     ##    ###    ## #   ###    ####  #   #   ###   ####     #     ###    ###    # #
//                                            #   #                       #
//                                             ###                        #
/**
 * A class that represents the completed games view.
 */
class SummaryCompletedGamesView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered completed games template.
     * @param {object[]} games The games to display.
     * @returns {string} An HTML string of the rendered completed games template.
     */
    static get(games) {
        return /* html */`
            ${Object.keys(games).map((s) => /* html */`
                <div class="server">
                    <a href="/archive/${games[s].id}">${SummaryCompletedGamesView.Encoding.htmlEncode(games[s].server && games[s].server.name || games[s].server && games[s].server.ip || games[s].ip || "Unknown")}</a>
                </div>
                <div class="time">
                    Completed&nbsp;<time class="timeago" datetime="${new Date(games[s].data.end).toISOString()}">${new Date(games[s].data.end)}</time></span>
                </div>
                <div class="map">
                    ${games[s].data.settings ? /* html */`
                        ${SummaryCompletedGamesView.Encoding.htmlEncode(games[s].data.settings.matchMode)}${games[s].data.settings.level && ` - ${SummaryCompletedGamesView.Encoding.htmlEncode(games[s].data.settings.level)}` || ""}
                    ` : ""}
                </div>
                <div class="condition">
                    ${games[s].data.settings && games[s].data.settings.condition ? /* html */`
                        ${games[s].data.settings.condition}
                    ` : ""}
                </div>
                <div class="scores">
                    ${games[s].data && games[s].data.teamScore && Object.keys(games[s].data.teamScore).length > 0 && Object.keys(games[s].data.teamScore).sort((a, b) => games[s].data.teamScore[b] - games[s].data.teamScore[a]).slice(0, 4).map((team) => /* html */`
                        ${SummaryCompletedGamesView.Encoding.htmlEncode(team)} ${games[s].data.teamScore[team]}
                    `.trim()).join(", ") || games[s].data && games[s].data.players && games[s].data.players.length > 0 && games[s].data.players.sort((a, b) => b.kills * (games[s].data.players.length > 2 ? 3 : 1) + b.assists - (a.kills * (games[s].data.players.length > 2 ? 3 : 1) + a.assists)).slice(0, 4).map((player) => /* html */`
                        ${SummaryCompletedGamesView.Encoding.htmlEncode(player.name)} ${player.kills * (games[s].data.players.length > 2 ? 3 : 1) + player.assists}
                    `.trim()).join(", ") || ""}${games[s].data && games[s].data.teamScore && Object.keys(games[s].data.teamScore).length > 4 || games[s].data && (!games[s].data.teamScore || games[s].data.teamScore.length === 0) && games[s].data.players && games[s].data.players.length > 4 ? ", ..." : ""}
                </div>
            `).join("")}
        `;
    }
}

/** @type {typeof import("../../js/common/encoding")} */
// @ts-ignore
SummaryCompletedGamesView.Encoding = typeof Encoding === "undefined" ? require("../../js/common/encoding") : Encoding; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.SummaryCompletedGamesView = SummaryCompletedGamesView;
} else {
    module.exports = SummaryCompletedGamesView; // eslint-disable-line no-undef
}
