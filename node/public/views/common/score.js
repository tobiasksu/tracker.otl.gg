//   ###                                       ###                               #   #    #
//  #   #                                     #   #                              #   #
//  #       ###   ## #   ## #    ###   # ##   #       ###    ###   # ##    ###   #   #   ##     ###   #   #
//  #      #   #  # # #  # # #  #   #  ##  #   ###   #   #  #   #  ##  #  #   #   # #     #    #   #  #   #
//  #      #   #  # # #  # # #  #   #  #   #      #  #      #   #  #      #####   # #     #    #####  # # #
//  #   #  #   #  # # #  # # #  #   #  #   #  #   #  #   #  #   #  #      #       # #     #    #      # # #
//   ###    ###   #   #  #   #   ###   #   #   ###    ###    ###   #       ###     #     ###    ###    # #
/**
 * A class that represents the score view.
 */
class CommonScoreView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered score template.
     * @param {object} game The game with the scores to display.
     * @returns {string} An HTML string of the rendered score template.
     */
    static get(game) {
        let scores;

        if (!game.settings || game.settings.matchMode === "ANARCHY") {
            scores = {};
            if (game.players) {
                if (game.players.length > 2) {
                    game.players.forEach((player) => {
                        scores[player.name] = 3 * player.kills + player.assists;
                    });
                } else {
                    game.players.forEach((player) => {
                        scores[player.name] = player.kills;
                    });
                }
            }
        } else {
            scores = game.teamScore;
            if (!scores) {
                scores = {};
            }
        }

        return /* html */`
            ${Object.keys(scores).sort((a, b) => scores[b] - scores[a]).map((player) => /* html */`
                <div class="player">${CommonScoreView.Encoding.htmlEncode(player)}</div>
                <div class="score">${scores[player]}</div>
            `).join("")}
        `;
    }
}

/** @type {typeof import("../../js/common/encoding")} */
// @ts-ignore
CommonScoreView.Encoding = typeof Encoding === "undefined" ? require("../../js/common/encoding") : Encoding; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.CommonScoreView = CommonScoreView;
} else {
    module.exports = CommonScoreView; // eslint-disable-line no-undef
}
