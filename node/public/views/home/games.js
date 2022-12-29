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
     * @returns {string} An HTML string of the rendered games template.
     */
    static get(games) {
        return /* html */`
            ${Object.keys(games).map((s) => /* html */`
                <div class="game" id="game-${games[s].ip}">
                    ${GamesView.DetailsView.get(games[s], true)}
                </div>
            `).join("")}
        `;
    }
}

// @ts-ignore
GamesView.DetailsView = typeof DetailsView === "undefined" ? require("../common/details") : DetailsView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = GamesView; // eslint-disable-line no-undef
}
