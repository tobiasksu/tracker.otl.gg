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
     * @param {{games: {id: number, ip: string, data: object, date: Date}[], count: number}} gameList The games to display.
     * @returns {string} An HTML string of the rendered game list template.
     */
    static get(gameList) {
        return /* html */`
            <h2 id="archive" class="header">Archived Games</h2>
            <form method="GET" action="/search">
                Search: <input type="text" id="q" name="q" maxlength="100" /> <input type="submit" value="Search" />
            </form>
            <div id="pagination">
                Go To Page: <select id="paginator">
                    ${Array(...Array(Math.ceil(gameList.count / 25))).map((value, index) => /* html */`
                        <option value="${index + 1}"${index === 0 ? " selected" : ""}>${index + 1}</option>
                    `).join("")}
                </select>
            </div>
            <div id="games">
                ${GameListView.GamesView.get(gameList)}
            </div>
        `;
    }
}

// @ts-ignore
GameListView.GamesView = typeof GamesView === "undefined" ? require("./gamelist/games") : GamesView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = GameListView; // eslint-disable-line no-undef
}
