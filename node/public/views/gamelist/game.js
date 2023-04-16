/**
 * @typedef {import("../../js/common/game")} Game
 */

//   ###                        #        #            #      ###                        #   #    #
//  #   #                       #                     #     #   #                       #   #
//  #       ###   ## #    ###   #       ##     ###   ####   #       ###   ## #    ###   #   #   ##     ###   #   #
//  #          #  # # #  #   #  #        #    #       #     #          #  # # #  #   #   # #     #    #   #  #   #
//  #  ##   ####  # # #  #####  #        #     ###    #     #  ##   ####  # # #  #####   # #     #    #####  # # #
//  #   #  #   #  # # #  #      #        #        #   #  #  #   #  #   #  # # #  #       # #     #    #      # # #
//   ###    ####  #   #   ###   #####   ###   ####     ##    ###    ####  #   #   ###     #     ###    ###    # #
/**
 * A class that represents the archived games view.
 */
class GameListGameView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered archived game template.
     * @param {Game} game The game to display.
     * @returns {string} An HTML string of the rendered archived game template.
     */
    static get(game) {
        return /* html */`
            <div><a href="/archive/${game.id}"><time class="local" datetime="${game.date}"></time></a></div>
            <div>${GameListGameView.Encoding.htmlEncode(game.server && game.server.name || game.server && game.server.ip || game.ip || "Unknown")}</div>
            <div>${game.settings && GameListGameView.Encoding.htmlEncode(game.settings.matchMode) || ""}</div>
            <div>${game.settings && GameListGameView.Encoding.htmlEncode(game.settings.level) || ""}</div>
            <div>
                ${game.teamScore && Object.keys(game.teamScore).length > 0 && Object.keys(game.teamScore).sort((a, b) => game.teamScore[b] - game.teamScore[a]).slice(0, 4).map((team) => /* html */`
                    ${GameListGameView.Encoding.htmlEncode(team)} ${game.teamScore[team]}
                `.trim()).join(", ") || game.players && game.players.length > 0 && game.players.sort((a, b) => b.kills * (game.players.length > 2 ? 3 : 1) + b.assists - (a.kills * (game.players.length > 2 ? 3 : 1) + a.assists)).slice(0, 4).map((player) => /* html */`
                    ${GameListGameView.Encoding.htmlEncode(player.name)} ${player.kills * (game.players.length > 2 ? 3 : 1) + player.assists}
                `.trim()).join(", ") || ""}${game.teamScore && Object.keys(game.teamScore).length > 4 || (!game.teamScore || Object.keys(game.teamScore).length === 0) && game.players && game.players.length > 4 ? ", ..." : ""}
            </div>
        `;
    }
}

/** @type {typeof import("../../js/common/encoding")} */
// @ts-ignore
GameListGameView.Encoding = typeof Encoding === "undefined" ? require("../../js/common/encoding") : Encoding; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.GameListGameView = GameListGameView;
} else {
    module.exports = GameListGameView; // eslint-disable-line no-undef
}
