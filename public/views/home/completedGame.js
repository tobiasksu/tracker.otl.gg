//   ###                         ##            #                #   ###                        #   #    #
//  #   #                         #            #                #  #   #                       #   #
//  #       ###   ## #   # ##     #     ###   ####    ###    ## #  #       ###   ## #    ###   #   #   ##     ###   #   #
//  #      #   #  # # #  ##  #    #    #   #   #     #   #  #  ##  #          #  # # #  #   #   # #     #    #   #  #   #
//  #      #   #  # # #  ##  #    #    #####   #     #####  #   #  #  ##   ####  # # #  #####   # #     #    #####  # # #
//  #   #  #   #  # # #  # ##     #    #       #  #  #      #  ##  #   #  #   #  # # #  #       # #     #    #      # # #
//   ###    ###   #   #  #       ###    ###     ##    ###    ## #   ###    ####  #   #   ###     #     ###    ###    # #
//                       #
//                       #
/**
 * A class that represents the completed game view.
 */
class CompletedGameView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered game template.
     * @param {object} game The game to display.
     * @returns {string} An HTML string of the game.
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
            <div class="server">${game.server || game.ip}</div>
            ${Object.keys(scores).sort((a, b) => scores[b] - scores[a]).map((score, player) => /* html */`
                <div class="player">${player}</div>
                <div class="score">${score}</div>
            `).join("")}
            <div class="map">${game.settings.level}</div>
            <div class="condition">${game.getCondition()}</div>
        `;
    }
}

// @ts-ignore
CompletedGameView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = CompletedGameView; // eslint-disable-line no-undef
}
