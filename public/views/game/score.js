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
     * @returns {string} An HTML string of the score.
     */
    static get(game) {
        let scores;

        if (game.teamScore && Object.keys(game.teamScore).length > 0) {
            scores = game.teamScore;
        } else {
            scores = {};
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
