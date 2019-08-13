//  ####           #              #     ##           #   #    #
//   #  #          #                     #           #   #
//   #  #   ###   ####    ###    ##      #     ###   #   #   ##     ###   #   #
//   #  #  #   #   #         #    #      #    #       # #     #    #   #  #   #
//   #  #  #####   #      ####    #      #     ###    # #     #    #####  # # #
//   #  #  #       #  #  #   #    #      #        #   # #     #    #      # # #
//  ####    ###     ##    ####   ###    ###   ####     #     ###    ###    # #
/**
 * A class that represetns the game details view.
 */
class DetailsView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered game page template.
     * @param {object} game The game to display.
     * @returns {string} An HTML string of the game page.
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
            <div class="server">${DetailsView.Common.htmlEncode(game.server && game.server.name || game.ip)}</div>
            ${Object.keys(scores).sort((a, b) => scores[b] - scores[a]).map((player) => /* html */`
                <div class="player">${DetailsView.Common.htmlEncode(player)}</div>
                <div class="score">${scores[player]}</div>
            `).join("")}
            <div class="time">
                ${game.countdown ? /* html */`
                    <script>new Countdown(${game.countdown});</script>
                ` : game.elapsed || game.elapsed === 0 ? /* html */`
                    <script>new Elapsed(${game.elapsed});</script>
                ` : ""}
            </div>
            <div class="map">${DetailsView.Common.htmlEncode(game.settings.level)}</div>
            <div class="condition">${game.condition}</div>
        `;
    }
}

// @ts-ignore
DetailsView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = DetailsView; // eslint-disable-line no-undef
}
