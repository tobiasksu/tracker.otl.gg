/**
 * @typedef {import("../js/common/game")} Game
 */

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
     * Gets the rendered game page template.
     * @param {Game} game The game to display.
     * @returns {string} An HTML string of the rendered game template.
     */
    static get(game) {
        return /* html */`
            <div class="live-updates">
                <a href="#" id="live-updates"></a>
            </div>
            <div id="top">
                <div id="game">
                    ${GameView.CommonDetailsView.get(game, false)}
                </div>
                <div id="players" class="game">
                    ${GameView.CommonPlayersView.get(game)}
                </div>
            </div>
            <div id="bottom">
                <div id="events">
                    ${GameView.CommonEventsView.get(game)}
                </div>
                <div id="settings">
                    ${GameView.CommonSettingsView.get(game)}
                </div>
            </div>
            <script>
                GameJs.game = new Game(${JSON.stringify(game)});
            </script>
        `;
    }
}

/** @type {typeof import("./common/details")} */
// @ts-ignore
GameView.CommonDetailsView = typeof CommonDetailsView === "undefined" ? require("./common/details") : CommonDetailsView; // eslint-disable-line no-undef

/** @type {typeof import("./common/players")} */
// @ts-ignore
GameView.CommonPlayersView = typeof CommonPlayersView === "undefined" ? require("./common/players") : CommonPlayersView; // eslint-disable-line no-undef

/** @type {typeof import("./common/events")} */
// @ts-ignore
GameView.CommonEventsView = typeof CommonEventsView === "undefined" ? require("./common/events") : CommonEventsView; // eslint-disable-line no-undef

/** @type {typeof import("./common/settings")} */
// @ts-ignore
GameView.CommonSettingsView = typeof CommonSettingsView === "undefined" ? require("./common/settings") : CommonSettingsView; // eslint-disable-line no-undef

/** @type {typeof import("../js/game")} */
// @ts-ignore
GameView.GameJs = typeof GameJs === "undefined" ? require("../js/game") : GameJs; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.GameView = GameView;
} else {
    module.exports = GameView; // eslint-disable-line no-undef
}
