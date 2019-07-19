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
            <div id="completed">
                ${HomeView.CompletedGamesView.get(completed)}
            </div>
            <div id="games">
                ${HomeView.GamesView.get(games)}
            </div>
            <div id="browser">
                ${HomeView.ServersView.get(servers)}
            </div>
            <script>
                ${games.map((game) => /* html */`
                    Game.games.push(new Game(${JSON.stringify(game)}));
                `).join("")}
                Home.games = ${JSON.stringify(games)};
                Home.servers = ${JSON.stringify(servers)};
                ${completed.map((game) => /* html */`
                    setTimeout(() => {
                        const el = document.querySelector("#completed-${game.id}");
                        el.parentNode.removeChild(el);
                    }, ${game.remaining})
                `).join("")}
            </script>
        `;
    }
}

// @ts-ignore
HomeView.CompletedGamesView = typeof LogView === "undefined" ? require("./home/completedGames") : GamesView; // eslint-disable-line no-undef
// @ts-ignore
HomeView.GamesView = typeof LogView === "undefined" ? require("./home/games") : GamesView; // eslint-disable-line no-undef
// @ts-ignore
HomeView.ServersView = typeof LogView === "undefined" ? require("./home/servers") : ServersView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = HomeView; // eslint-disable-line no-undef
}
