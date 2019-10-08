//  #   #                       #   #    #
//  #   #                       #   #
//  #   #   ###   ## #    ###   #   #   ##     ###   #   #
//  #####  #   #  # # #  #   #   # #     #    #   #  #   #
//  #   #  #   #  # # #  #####   # #     #    #####  # # #
//  #   #  #   #  # # #  #       # #     #    #      # # #
//  #   #   ###   #   #   ###     #     ###    ###    # #
/**
 * A class that represents the home view.
 */
class HomeView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered home page template.
     * @param {object[]} completed The completed games to display.
     * @param {object[]} games The in-progress games to display.
     * @param {object[]} servers The servers to display.
     * @returns {string} An HTML string of the home page.
     */
    static get(completed, games, servers) {
        return /* html */`
            <h2>Recently Completed Games</h2>
            <div id="completed">
                ${HomeView.CompletedGamesView.get(completed)}
            </div>
            <h2>Games In Progress</h2>
            <div id="games">
                ${HomeView.GamesView.get(games)}
            </div>
            <h2>Server Browser</h2>
            <div id="browser">
                ${HomeView.ServersView.get(servers)}
            </div>
            <script>
                ${games.map((game) => /* html */`
                    Game.games.push(new Game(${JSON.stringify(game)}));
                `).join("")}
                Home.servers = ${JSON.stringify(servers)};
                ${completed.map((game) => /* html */`
                    setTimeout(() => {
                        const el = document.getElementById("completed-${game.id}");
                        el.parentNode.removeChild(el);
                    }, ${game.remaining})
                `).join("")}
            </script>
        `;
    }
}

// @ts-ignore
HomeView.CompletedGamesView = typeof CompletedGamesView === "undefined" ? require("./home/completedGames") : CompletedGamesView; // eslint-disable-line no-undef
// @ts-ignore
HomeView.GamesView = typeof GamesView === "undefined" ? require("./home/games") : GamesView; // eslint-disable-line no-undef
// @ts-ignore
HomeView.ServersView = typeof ServersView === "undefined" ? require("./home/servers") : ServersView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = HomeView; // eslint-disable-line no-undef
}
