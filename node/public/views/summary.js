/**
 * @typedef {import("../js/common/game")} Game
 * @typedef {import("../../types/node/serverTypes").LocalServer} ServerTypes.LocalServer
 */

//   ###                                             #   #    #
//  #   #                                            #   #
//  #      #   #  ## #   ## #    ###   # ##   #   #  #   #   ##     ###   #   #
//   ###   #   #  # # #  # # #      #  ##  #  #   #   # #     #    #   #  #   #
//      #  #   #  # # #  # # #   ####  #      #  ##   # #     #    #####  # # #
//  #   #  #  ##  # # #  # # #  #   #  #       ## #   # #     #    #      # # #
//   ###    ## #  #   #  #   #   ####  #          #    #     ###    ###    # #
//                                            #   #
//                                             ###
/**
 * A class that represents the summary view.
 */
class SummaryView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered summary page template.
     * @param {Game[]} completed The completed games to display.
     * @param {Game[]} games The in-progress games to display.
     * @param {ServerTypes.LocalServer[]} servers The servers to display.
     * @returns {string} An HTML string of the summary page.
     */
    static get(completed, games, servers) {
        return /* html */`
            <h2>Recently Completed Games</h2>
            <div id="completed">
                <div class="header">Server</div>
                <div class="header">Completed</div>
                <div class="header">Map</div>
                <div class="header">Condition</div>
                <div class="header">Scores</div>
                ${SummaryView.SummaryCompletedGamesView.get(completed)}
            </div>
            <h2>Games In Progress</h2>
            <div id="games">
                <div class="header">Server</div>
                <div class="header">Time</div>
                <div class="header">Map</div>
                <div class="header">Condition</div>
                <div class="header">Scores</div>
                ${SummaryView.SummaryGamesView.get(games)}
            </div>
            <h2>Server Browser</h2>
            <div id="browser">
                ${SummaryView.HomeServersView.get(servers)}
            </div>
            <script>
                ${games.map((game) => /* html */`
                    Game.games.push(new Game(${JSON.stringify(game)}));
                `).join("")}
                Summary.servers = ${JSON.stringify(servers)};
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

/** @type {typeof import("./home/servers")} */
// @ts-ignore
SummaryView.HomeServersView = typeof HomeServersView === "undefined" ? require("./home/servers") : HomeServersView; // eslint-disable-line no-undef

/** @type {typeof import("./summary/completedGames")} */
// @ts-ignore
SummaryView.SummaryCompletedGamesView = typeof SummaryCompletedGamesView === "undefined" ? require("./summary/completedGames") : SummaryCompletedGamesView; // eslint-disable-line no-undef

/** @type {typeof import("./summary/games")} */
// @ts-ignore
SummaryView.SummaryGamesView = typeof SummaryGamesView === "undefined" ? require("./summary/games") : SummaryGamesView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.SummaryView = SummaryView;
} else {
    module.exports = SummaryView; // eslint-disable-line no-undef
}
