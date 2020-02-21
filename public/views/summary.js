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
     * @param {object[]} completed The completed games to display.
     * @param {object[]} games The in-progress games to display.
     * @param {object[]} servers The servers to display.
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
                ${SummaryView.CompletedGamesView.get(completed)}
            </div>
            <h2>Games In Progress</h2>
            <div id="games">
                <div class="header">Server</div>
                <div class="header">Time</div>
                <div class="header">Map</div>
                <div class="header">Condition</div>
                <div class="header">Scores</div>
                ${SummaryView.GamesView.get(games)}
            </div>
            <h2>Server Browser</h2>
            <div id="browser">
                ${SummaryView.ServersView.get(servers)}
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

// @ts-ignore
SummaryView.CompletedGamesView = typeof CompletedGamesView === "undefined" ? require("./summary/completedGames") : CompletedGamesView; // eslint-disable-line no-undef
// @ts-ignore
SummaryView.GamesView = typeof GamesView === "undefined" ? require("./summary/games") : GamesView; // eslint-disable-line no-undef
// @ts-ignore
SummaryView.ServersView = typeof ServersView === "undefined" ? require("./home/servers") : ServersView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = SummaryView; // eslint-disable-line no-undef
}
