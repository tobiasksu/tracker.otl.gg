//  #   #                        ###                               #   #    #
//  #   #                       #   #                              #   #
//  #   #   ###   ## #    ###   #       ###   ## #    ###    ###   #   #   ##     ###   #   #
//  #####  #   #  # # #  #   #  #          #  # # #  #   #  #       # #     #    #   #  #   #
//  #   #  #   #  # # #  #####  #  ##   ####  # # #  #####   ###    # #     #    #####  # # #
//  #   #  #   #  # # #  #      #   #  #   #  # # #  #          #   # #     #    #      # # #
//  #   #   ###   #   #   ###    ###    ####  #   #   ###   ####     #     ###    ###    # #
/**
 * A class that represents the games view.
 */
class HomeGamesView {
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
                    ${HomeGamesView.CommonDetailsView.get(games[s], true)}
                </div>
            `).join("")}
        `;
    }
}

/** @type {typeof import("../common/details")} */
// @ts-ignore
HomeGamesView.CommonDetailsView = typeof DetailsView === "undefined" ? require("../common/details") : CommonDetailsView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.HomeGamesView = HomeGamesView;
} else {
    module.exports = HomeGamesView; // eslint-disable-line no-undef
}
