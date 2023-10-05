/**
 * @typedef {import("../js/common/game")} Game
 */

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
     * Gets the rendered search page template.
     * @param {{games: Game[], count: number, servers: {server: string, ip: string}[]}} data The data to display.
     * @returns {string} An HTML string of the rendered search page template.
     */
    static get(data) {
        const {games, count, servers} = data;

        return /* html */`
            <h2 id="archive" class="header">Archived Games</h2>
            <form id="search">
                <div id="search-parameters">
                    <div id="search-ips">
                        Server:
                        <div class="parameter first">
                            ${SearchView.SearchServerView.get(servers, true)}
                        </div>
                        <button id="add-server" type="button">Add Server</button>
                    </div>
                    <div id="search-maps">
                        Map:
                        <div class="parameter first">
                            <input class="search-maps" type="text" />
                        </div>
                        <button id="add-map" type="button">Add Map</button>
                    </div>
                    <div id="search-players">
                        Player:
                        <div class="parameter first">
                            <input class="search-players" type="text" />
                        </div>
                        <button id="add-player" type="button">Add Player</button>
                    </div>
                    <div id="search-gametypes">
                        Game Type:
                        <div class="parameter first">
                            <select class="search-gametypes">
                                <option value=""></option>
                                <option value="ANARCHY">Anarchy</option>
                                <option value="CTF">CTF</option>
                                <option value="MONSTERBALL">Monsterball</option>
                                <option value="RACE">Race</option>
                                <option value="TEAM ANARCHY">Team Anarchy</option>
                            </select>
                        </div>
                        <button id="add-gametype" type="button">Add Game Type</button>
                    </div>
                    <div id="search-scores">
                        Score:
                        <div class="parameter first">
                            <input class="search-scorers" type="number" />
                        </div>
                        <button id="add-score" type="button">Add Score</button>
                    </div>
                    <input type="submit" id="search" value="Search" />
                </div>
            </form>
            ${count > 25 ? /* html */`
                <div id="pagination">
                    Go To Page: <select id="paginator">
                        ${Array(...Array(Math.ceil(count / 25))).map((value, index) => /* html */`
                            <option value="${index + 1}"${index === 0 ? " selected" : ""}>${index + 1}</option>
                        `).join("")}
                    </select>
                </div>
            ` : ""}
            <div id="games">
                ${SearchView.GameListGamesView.get(games)}
            </div>
            <div id="modal">
                <div id="modal-content">
                    <span id="modal-close">&times;</span>
                    <div id="modal-text"></div>
                </div>
            </div>
            <script>
                SearchJs.servers = ${JSON.stringify(servers)};
            </script>
        `;
    }
}

/** @type {typeof import("./gamelist/games")} */
// @ts-ignore
SearchView.GameListGamesView = typeof GameListGamesView === "undefined" ? require("./gamelist/games") : GameListGamesView; // eslint-disable-line no-undef

// Add SearchServerView to SearchView.
/** @type {typeof import("./search/server")} */
// @ts-ignore
SearchView.SearchServerView = typeof SearchServerView === "undefined" ? require("./search/server") : SearchServerView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.SearchView = SearchView;
} else {
    module.exports = SearchView; // eslint-disable-line no-undef
}
