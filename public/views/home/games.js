//   ###                               #   #    #
//  #   #                              #   #
//  #       ###   ## #    ###    ###   #   #   ##     ###   #   #
//  #          #  # # #  #   #  #       # #     #    #   #  #   #
//  #  ##   ####  # # #  #####   ###    # #     #    #####  # # #
//  #   #  #   #  # # #  #          #   # #     #    #      # # #
//   ###    ####  #   #   ###   ####     #     ###    ###    # #
/**
 * A class that represents the games view.
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
     * Gets the rendered games template.
     * @param {object[]} games The games to display.
     * @returns {string} An HTML string of the games.
     */
    static get(games) {
        return /* html */`
            ${Object.keys(games).map((s) => /* html */`
                <div class="game" id="game-${games[s].ip}">
                    ${GamesView.GameView.get(games[s])}
                </div>
            `).join("")}
        `;
    }
}

// @ts-ignore
GamesView.GameView = typeof GameView === "undefined" ? require("./game") : GameView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = GamesView; // eslint-disable-line no-undef
}
