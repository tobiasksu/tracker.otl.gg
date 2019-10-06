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
     * @param {object} games The games to display.
     * @returns {string} An HTML string of the rendered game list template.
     */
    static get(games) {
        return /* html */`
            <h2 id="archive" class="header">Archived Games</h2>
            <div id="pagination">
                <a href="#" id="prev">&lt; Newer Games</a>
                <a href="#" id="next">Older Games &gt;</a>
            </div>
            <div id="games">
                ${GameListView.GamesView.get(games)}
            </div>
            <script>
                GameList.maxId = ${games.games[0].id};
                GameList.minId = 1;
                GameList.page = 1;
                GameList.setup(${games.games[games.games.length - 1].id});
            </script>
        `;
    }
}

// @ts-ignore
GameListView.GamesView = typeof GamesView === "undefined" ? require("./gamelist/games") : GamesView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = GameListView; // eslint-disable-line no-undef
}
