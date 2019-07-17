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
     * @param {object[]} games The games to display.
     * @param {object[]} servers The servers to display.
     * @returns {string} An HTML string of the home page.
     */
    static get(games, servers) {
        // TODO: Refresh browser every 60 seconds.
        return /* html */`
            <div id="games">
                ${HomeView.GamesView.get(games)}
            </div>
            <div id="browser">
                ${HomeView.ServersView.get(servers)}
            </div>
            <script>
                Home.games = ${JSON.stringify(games)};
            </script>
        `;
    }
}

// @ts-ignore
HomeView.GamesView = typeof LogView === "undefined" ? require("./home/games") : GamesView; // eslint-disable-line no-undef
// @ts-ignore
HomeView.ServersView = typeof LogView === "undefined" ? require("./home/servers") : ServersView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = HomeView; // eslint-disable-line no-undef
}
