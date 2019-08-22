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
            <div class="table">
                <div class="server">${CompletedGameView.Common.htmlEncode(game.server && game.server.name || game.ip)}</div>
                <div class="scores">
                    ${Object.keys(scores).sort((a, b) => scores[b] - scores[a]).map((player) => /* html */`
                        <div class="player">${CompletedGameView.Common.htmlEncode(player)}</div>
                        <div class="score">${scores[player]}</div>
                    `).join("")}
                </div>
                <div class="info">
                    <div class="time">
                        Completed <time class="timeago" datetime="${new Date(game.end).toISOString()}">${new Date(game.end)}</time>
                    </div>
                    <div class="map">${game.settings && game.settings.level ? CompletedGameView.Common.htmlEncode(game.settings.level) : ""}</div>
                    ${game.settings && game.settings.condition ? /* html */`
                        <div class="condition">${game.settings.condition}</div>
                    ` : ""}
                </div>
            </div>
        `;
    }
}

// @ts-ignore
CompletedGameView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = CompletedGameView; // eslint-disable-line no-undef
}
