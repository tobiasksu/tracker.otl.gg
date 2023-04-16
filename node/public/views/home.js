/**
 * @typedef {import("../js/common/game")} Game
 * @typedef {import("../../types/serverTypes").LocalServer} ServerTypes.LocalServer
 */

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
     * @param {Game[]} completed The completed games to display.
     * @param {Game[]} games The in-progress games to display.
     * @param {ServerTypes.LocalServer[]} servers The servers to display.
     * @returns {string} An HTML string of the home page.
     */
    static get(completed, games, servers) {
        return /* html */`
            <div class="live-updates">
                <a href="#" id="live-updates"></a>
            </div>
            <h2>Recently Completed Games</h2>
            <div id="completed">
                ${HomeView.HomeCompletedGamesView.get(completed)}
            </div>
            <h2>Games In Progress</h2>
            <div id="games">
                ${HomeView.HomeGamesView.get(games)}
            </div>
            <h2>Server Browser</h2>
            <div id="browser">
                ${HomeView.HomeServersView.get(servers)}
            </div>
            <script>
                ${games.map((game) => /* html */`
                    Game.games.push(new Game(${JSON.stringify(game)}));
                `).join("")}
                HomeJs.servers = ${JSON.stringify(servers)};
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

/** @type {typeof import("./home/completedGames")} */
// @ts-ignore
HomeView.HomeCompletedGamesView = typeof HomeCompletedGamesView === "undefined" ? require("./home/completedGames") : HomeCompletedGamesView; // eslint-disable-line no-undef

/** @type {typeof import("./home/games")} */
// @ts-ignore
HomeView.HomeGamesView = typeof HomeGamesView === "undefined" ? require("./home/games") : HomeGamesView; // eslint-disable-line no-undef

/** @type {typeof import("./home/servers")} */
// @ts-ignore
HomeView.HomeServersView = typeof HomeServersView === "undefined" ? require("./home/servers") : HomeServersView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.HomeView = HomeView;
} else {
    module.exports = HomeView; // eslint-disable-line no-undef
}
