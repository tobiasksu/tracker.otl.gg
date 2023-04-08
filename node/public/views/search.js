//   ###                               #      #   #    #
//  #   #                              #      #   #
//  #       ###    ###   # ##    ###   # ##   #   #   ##     ###   #   #
//   ###   #   #      #  ##  #  #   #  ##  #   # #     #    #   #  #   #
//      #  #####   ####  #      #      #   #   # #     #    #####  # # #
//  #   #  #      #   #  #      #   #  #   #   # #     #    #      # # #
//   ###    ###    ####  #       ###   #   #    #     ###    ###    # #
/**
 * A class that represents the search view.
 */
class SearchView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered game list page template.
     * @param {{games: {id: number, ip: string, data: object, date: Date}[], count: number, q: string}} gameList The games to display.
     * @returns {string} An HTML string of the rendered search template.
     */
    static get(gameList) {
        return /* html */`
            <h2 id="archive" class="header">Search Results</h2>
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
                ${SearchView.GameListGamesView.get(gameList)}
            </div>
            <script>
                window.q = "${gameList.q.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}";
                document.getElementById("q").value = window.q;
            </script>
        `;
    }
}

/** @type {typeof import("./gamelist/games")} */
// @ts-ignore
SearchView.GameListGamesView = typeof GameListGamesView === "undefined" ? require("./gamelist/games") : GameListGamesView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.SearchView = SearchView;
} else {
    module.exports = SearchView; // eslint-disable-line no-undef
}
