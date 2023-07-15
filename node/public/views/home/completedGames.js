/**
 * @typedef {import("../../js/common/game")} Game
 */

//  #   #                        ###                         ##            #                #   ###                               #   #    #
//  #   #                       #   #                         #            #                #  #   #                              #   #
//  #   #   ###   ## #    ###   #       ###   ## #   # ##     #     ###   ####    ###    ## #  #       ###   ## #    ###    ###   #   #   ##     ###   #   #
//  #####  #   #  # # #  #   #  #      #   #  # # #  ##  #    #    #   #   #     #   #  #  ##  #          #  # # #  #   #  #       # #     #    #   #  #   #
//  #   #  #   #  # # #  #####  #      #   #  # # #  ##  #    #    #####   #     #####  #   #  #  ##   ####  # # #  #####   ###    # #     #    #####  # # #
//  #   #  #   #  # # #  #      #   #  #   #  # # #  # ##     #    #       #  #  #      #  ##  #   #  #   #  # # #  #          #   # #     #    #      # # #
//  #   #   ###   #   #   ###    ###    ###   #   #  #       ###    ###     ##    ###    ## #   ###    ####  #   #   ###   ####     #     ###    ###    # #
//                                                   #
//                                                   #
/**
 * A class that represents the completed games view.
 */
class HomeCompletedGamesView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered completed games template.
     * @param {Game[]} games The games to display.
     * @returns {string} An HTML string of the rendered completed games template.
     */
    static get(games) {
        return /* html */`
            ${Object.keys(games).map((s) => /* html */`
                <div class="game" id="completed-${games[s].id}">
                    ${HomeCompletedGamesView.CommonCompletedDetailsView.get(games[s], true, games[s].id)}
                </div>
            `).join("")}
        `;
    }
}

/** @type {typeof import("../common/completedDetails")} */
// @ts-ignore
HomeCompletedGamesView.CommonCompletedDetailsView = typeof CommonCompletedDetailsView === "undefined" ? require("../common/completedDetails") : CommonCompletedDetailsView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.HomeCompletedGamesView = HomeCompletedGamesView;
} else {
    module.exports = HomeCompletedGamesView; // eslint-disable-line no-undef
}
