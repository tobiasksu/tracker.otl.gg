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
     * @param {{games: Game[], count: number, servers: {name: string, ip: string}[], ips: string[], maps: string[], players: string[], gameTypes: string[], scores: number[]}} data The data to display.
     * @returns {string} An HTML string of the rendered search page template.
     */
    static get(data) {
        const {games, count, servers, ips, maps, players, gameTypes, scores} = data;

        return /* html */`
            <h2 id="archive" class="header">Archived Games</h2>
            <form id="search">
                <div id="search-parameters">
                    <div id="search-ips">
                        Server:
                        <div class="parameter first">
                            ${SearchView.SearchServerView.get(servers, true, ips && ips.length > 0 ? ips[0] : void 0)}
                        </div>
                        ${ips ? ips.slice(1).map((ip) => /* html */`
                            <div class="parameter">
                                ${SearchView.SearchServerView.get(servers, false, ip)}
                                <button class="remove-server" type="button">&times;</button>
                            </div>
                        `).join("") : ""}
                        <button id="add-server" type="button">Add Server</button>
                    </div>
                    <div id="search-maps">
                        Map:
                        <div class="parameter first">
                            <input class="search-maps" type="text" value="${maps && maps.length > 0 ? SearchView.Encoding.attributeEncode(maps[0]) : ""}" />
                        </div>
                        ${maps ? maps.slice(1).map((map) => /* html */`
                            <div class="parameter">
                                <input class="search-maps" type="text" value="${SearchView.Encoding.attributeEncode(map)}" />
                                <button class="remove-map" type="button">&times;</button>
                            </div>
                        `).join("") : ""}
                        <button id="add-map" type="button">Add Map</button>
                    </div>
                    <div id="search-gametypes">
                        Game Type:
                        <div class="parameter first">
                            <select class="search-gametypes">
                                <option value=""></option>
                                <option value="ANARCHY"${gameTypes && gameTypes.length > 0 && gameTypes[0] === "ANARCHY" ? " selected" : ""}>Anarchy</option>
                                <option value="CTF"${gameTypes && gameTypes.length > 0 && gameTypes[0] === "CTF" ? " selected" : ""}>CTF</option>
                                <option value="MONSTERBALL"${gameTypes && gameTypes.length > 0 && gameTypes[0] === "MONSTERBALL" ? " selected" : ""}>Monsterball</option>
                                <option value="RACE"${gameTypes && gameTypes.length > 0 && gameTypes[0] === "RACE" ? " selected" : ""}>Race</option>
                                <option value="TEAM ANARCHY"${gameTypes && gameTypes.length > 0 && gameTypes[0] === "TEAM ANARCHY" ? " selected" : ""}>Team Anarchy</option>
                            </select>
                        </div>
                        ${gameTypes ? gameTypes.slice(1).map((gameType) => /* html */`
                            <div class="parameter">
                                <select class="search-gametypes">
                                    <option value=""></option>
                                    <option value="ANARCHY"${gameType === "ANARCHY" ? " selected" : ""}>Anarchy</option>
                                    <option value="CTF"${gameType === "CTF" ? " selected" : ""}>CTF</option>
                                    <option value="MONSTERBALL"${gameType === "MONSTERBALL" ? " selected" : ""}>Monsterball</option>
                                    <option value="RACE"${gameType === "RACE" ? " selected" : ""}>Race</option>
                                    <option value="TEAM ANARCHY"${gameType === "TEAM ANARCHY" ? " selected" : ""}>Team Anarchy</option>
                                </select>
                                <button class="remove-gametype" type="button">&times;</button>
                            </div>
                        `).join("") : ""}
                        <button id="add-gametype" type="button">Add Game Type</button>
                    </div>
                    <div id="search-players">
                        Player (all must match):
                        <div class="parameter first">
                            <input class="search-players" type="text" value="${players && players.length > 0 ? SearchView.Encoding.attributeEncode(players[0]) : ""}" />
                        </div>
                        ${players ? players.slice(1).map((player) => /* html */`
                            <div class="parameter">
                                <input class="search-players" type="text" value="${SearchView.Encoding.attributeEncode(player)}" />
                                <button class="remove-player" type="button">&times;</button>
                            </div>
                        `).join("") : ""}
                        <button id="add-player" type="button">Add Player</button>
                    </div>
                    <div id="search-scores">
                        Score (all must match):
                        <div class="parameter first">
                            <input class="search-scores" type="number" value="${scores && scores.length > 0 ? scores[0] : ""}" />
                        </div>
                        ${scores ? scores.slice(1).map((score) => /* html */`
                            <div class="parameter">
                                <input class="search-scores" type="number" value="${score}" />
                                <button class="remove-score" type="button">&times;</button>
                            </div>
                        `).join("") : ""}
                        <button id="add-score" type="button">Add Score</button>
                    </div>
                    </div>
                <button id="do-search" type="button">Search</button>
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
                ${SearchView.GameListGamesView.get({games})}
            </div>
            <div id="modal" class="hidden">
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

/** @type {typeof import("../js/common/encoding")} */
// @ts-ignore
SearchView.Encoding = typeof Encoding === "undefined" ? require("../js/common/encoding") : Encoding; // eslint-disable-line no-undef

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
