//   ###                               #   #    #
//  #   #                              #   #
//  #       ###    ###   # ##    ###   #   #   ##     ###   #   #
//   ###   #   #  #   #  ##  #  #   #   # #     #    #   #  #   #
//      #  #      #   #  #      #####   # #     #    #####  # # #
//  #   #  #   #  #   #  #      #       # #     #    #      # # #
//   ###    ###    ###   #       ###     #     ###    ###    # #
/**
 * A class that represents the score view.
 */
class ScoreView {
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
                <div class="player">${ScoreView.Common.htmlEncode(player)}</div>
                <div class="score">${scores[player]}</div>
            `).join("")}
        `;
    }
}

// @ts-ignore
ScoreView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = ScoreView; // eslint-disable-line no-undef
}
