/**
 * @typedef {import("../../js/common/game")} Game
 */

//   ###                        #        #            #      ###                               #   #    #
//  #   #                       #                     #     #   #                              #   #
//  #       ###   ## #    ###   #       ##     ###   ####   #       ###   ## #    ###    ###   #   #   ##     ###   #   #
//  #          #  # # #  #   #  #        #    #       #     #          #  # # #  #   #  #       # #     #    #   #  #   #
//  #  ##   ####  # # #  #####  #        #     ###    #     #  ##   ####  # # #  #####   ###    # #     #    #####  # # #
//  #   #  #   #  # # #  #      #        #        #   #  #  #   #  #   #  # # #  #          #   # #     #    #      # # #
//   ###    ####  #   #   ###   #####   ###   ####     ##    ###    ####  #   #   ###   ####     #     ###    ###    # #
/**
 * A class that represents the archived games view.
 */
class GameListGamesView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered archived games template.
     * @param {Game[]} games The games to display.
     * @returns {string} An HTML string of the rendered archived games template.
     */
    static get(games) {
        return /* html */`
            <div class="header">Completed Date</div>
            <div class="header">Server</div>
            <div class="header">Match Mode</div>
            <div class="header">Map</div>
            <div class="header">Score</div>
            ${games.map(GameListGamesView.GameListGameView.get).join("")}
        `;
    }
}

/** @type {typeof import("./game")} */
// @ts-ignore
GameListGamesView.GameListGameView = typeof GameListGameView === "undefined" ? require("./game") : GameListGameView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.GameListGamesView = GameListGamesView;
} else {
    module.exports = GameListGamesView; // eslint-disable-line no-undef
}
