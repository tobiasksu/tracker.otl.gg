/**
 * @typedef {import("../js/common/game")} Game
 */

//   ###                        #        #            #     #   #    #
//  #   #                       #                     #     #   #
//  #       ###   ## #    ###   #       ##     ###   ####   #   #   ##     ###   #   #
//  #          #  # # #  #   #  #        #    #       #      # #     #    #   #  #   #
//  #  ##   ####  # # #  #####  #        #     ###    #      # #     #    #####  # # #
//  #   #  #   #  # # #  #      #        #        #   #  #   # #     #    #      # # #
//   ###    ####  #   #   ###   #####   ###   ####     ##     #     ###    ###    # #
/**
 * A class that represents the game list view.
 */
class GameListView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered game list page template.
     * @param {{games: Game[], count: number}} gameList The games to display.
     * @returns {string} An HTML string of the rendered game list template.
     */
    static get(gameList) {
        return /* html */`
            <h2 id="archive" class="header">Archived Games</h2>
            <div id="pagination">
                Go To Page: <select id="paginator">
                    ${Array(...Array(Math.ceil(gameList.count / 25))).map((value, index) => /* html */`
                        <option value="${index + 1}"${index === 0 ? " selected" : ""}>${index + 1}</option>
                    `).join("")}
                </select>
            </div>
            <div id="games">
                ${GameListView.GameListGamesView.get(gameList)}
            </div>
        `;
    }
}

/** @type {typeof import("./gamelist/games")} */
// @ts-ignore
GameListView.GameListGamesView = typeof GameListGamesView === "undefined" ? require("./gamelist/games") : GameListGamesView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.GameListView = GameListView;
} else {
    module.exports = GameListView; // eslint-disable-line no-undef
}
