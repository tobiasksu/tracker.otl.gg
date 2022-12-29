//   ###                               #   #    #
//  #   #                              #   #
//  #       ###   ## #    ###    ###   #   #   ##     ###   #   #
//  #          #  # # #  #   #  #       # #     #    #   #  #   #
//  #  ##   ####  # # #  #####   ###    # #     #    #####  # # #
//  #   #  #   #  # # #  #          #   # #     #    #      # # #
//   ###    ####  #   #   ###   ####     #     ###    ###    # #
/**
 * A class that represents the archived games view.
 */
class GamesView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered archived games template.
     * @param {{games: object[]}} games The games to display.
     * @returns {string} An HTML string of the rendered archived games template.
     */
    static get(games) {
        return /* html */`
            <div class="header">Completed Date</div>
            <div class="header">Server</div>
            <div class="header">Match Mode</div>
            <div class="header">Map</div>
            <div class="header">Score</div>
            ${games.games.map(GamesView.GameView.get).join("")}
        `;
    }
}

// @ts-ignore
GamesView.GameView = typeof GameView === "undefined" ? require("./game") : GameView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = GamesView; // eslint-disable-line no-undef
}
