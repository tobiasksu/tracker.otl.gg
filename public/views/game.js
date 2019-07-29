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
     * @param {object} game The game to display.
     * @returns {string} An HTML string of the game page.
     */
    static get(game) {
        return /* html */`
            <div id="game">
                ${GameView.DetailsView.get(game)}
            </div>
            <div id="players">
                ${GameView.PlayersView.get(game)}
            </div>
            <div id="events">
                ${GameView.EventsView.get(game)}
            </div>
            <script>
                Game.game = new Game(${JSON.stringify(game)});
            </script>
        `;
    }
}

// @ts-ignore
GameView.DetailsView = typeof DetailsView === "undefined" ? require("./game/details") : DetailsView; // eslint-disable-line no-undef
// @ts-ignore
GameView.PlayersView = typeof PlayersView === "undefined" ? require("./game/players") : PlayersView; // eslint-disable-line no-undef
// @ts-ignore
GameView.EventsView = typeof EventsView === "undefined" ? require("./game/events") : EventsView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = GameView; // eslint-disable-line no-undef
}
