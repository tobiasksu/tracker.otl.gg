/* global Countdown */

//   ###                        #   #    #
//  #   #                       #   #
//  #       ###   ## #    ###   #   #   ##     ###   #   #
//  #          #  # # #  #   #   # #     #    #   #  #   #
//  #  ##   ####  # # #  #####   # #     #    #####  # # #
//  #   #  #   #  # # #  #       # #     #    #      # # #
//   ###    ####  #   #   ###     #     ###    ###    # #
/**
 * A class that represents the game view.
 */
class GameView {
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
        // @ts-ignore
        if (typeof window !== "undefined") {
            // @ts-ignore
            setTimeout(Countdown.create, 1);
        }

        return /* html */`
            <div class="server">${GameView.Common.htmlEncode(game.server ? game.server.name : game.ip)}</div>
            <div class="scores">
                ${GameView.ScoreView.get(game)}
            </div>
            <div class="info">
                <div class="time">
                    ${game.countdown ? /* html */`
                        <script>new Countdown(${game.countdown});</script>
                    ` : game.elapsed || game.elapsed === 0 ? /* html */`
                        <script>new Elapsed(${game.elapsed});</script>
                    ` : ""}
                </div>
                <div class="map">${game.settings && GameView.Common.htmlEncode(game.settings.level) || ""}</div>
                ${game.settings && game.settings.condition ? /* html */`
                    <div class="condition">${game.settings.condition}</div>
                ` : ""}
            </div>
        `;
    }
}

// @ts-ignore
GameView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef
// @ts-ignore
GameView.ScoreView = typeof ScoreView === "undefined" ? require("./score") : ScoreView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = GameView; // eslint-disable-line no-undef
}
