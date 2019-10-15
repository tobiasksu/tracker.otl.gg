/* global Countdown */

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
     * Gets the rendered details template.
     * @param {object} game The game to display.
     * @param {boolean} addLink Add a link to the game page.
     * @returns {string} An HTML string of the rendered details template.
     */
    static get(game, addLink) {
        // @ts-ignore
        if (typeof window !== "undefined") {
            // @ts-ignore
            setTimeout(Countdown.create, 1);
        }

        return /* html */`
            <div class="table">
                <div class="server">${addLink ? /* html */`
                    <a href="/game/${game.ip}">
                        ` : ""}${DetailsView.Common.htmlEncode(game.server && game.server.name ? game.server.name : game.ip)}${addLink ? /* html */`
                    </a>
                ` : ""}</div>
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
                    ${game.settings ? /* html */`
                        <div class="map">${game.settings.matchMode}${game.settings.level && ` - ${DetailsView.Common.htmlEncode(game.settings.level)}` || ""}</div>
                    ` : ""}
                    ${game.settings && game.settings.condition ? /* html */`
                        <div class="condition">${game.settings.condition}</div>
                    ` : ""}
                </div>
            </div>
        `;
    }
}

// @ts-ignore
DetailsView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef
// @ts-ignore
DetailsView.ScoreView = typeof ScoreView === "undefined" ? require("../common/score") : ScoreView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = DetailsView; // eslint-disable-line no-undef
}
