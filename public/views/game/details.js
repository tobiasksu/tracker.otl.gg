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
        return /* html */`
            <div class="table">
                <div class="server">${DetailsView.Common.htmlEncode(game.server && game.server.name || game.ip)}</div>
                <div class="scores">
                    ${DetailsView.ScoreView.get(game)}
                </div>
                <div class="info">
                    <div class="time">
                        ${game.countdown ? /* html */`
                            <script>new Countdown(${game.countdown});</script>
                        ` : game.elapsed || game.elapsed === 0 ? /* html */`
                            <script>new Elapsed(${game.elapsed});</script>
                        ` : ""}
                    </div>
                    <div class="map">${DetailsView.Common.htmlEncode(game.settings.level)}</div>
                    <div class="condition">${game.condition}</div>
                </div>
            </div>
        `;
    }
}

// @ts-ignore
DetailsView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef
// @ts-ignore
DetailsView.ScoreView = typeof ScoreView === "undefined" ? require("./score") : ScoreView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = DetailsView; // eslint-disable-line no-undef
}
