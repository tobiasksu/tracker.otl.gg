//    #                  #        #                  #   #    #
//   # #                 #                           #   #
//  #   #  # ##    ###   # ##    ##    #   #   ###   #   #   ##     ###   #   #
//  #   #  ##  #  #   #  ##  #    #    #   #  #   #   # #     #    #   #  #   #
//  #####  #      #      #   #    #     # #   #####   # #     #    #####  # # #
//  #   #  #      #   #  #   #    #     # #   #       # #     #    #      # # #
//  #   #  #       ###   #   #   ###     #     ###     #     ###    ###    # #
/**
 * A class that represents the archive view.
 */
class ArchiveView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered archive template.
     * @param {object} game The game to display.
     * @param {string[]} weapons The list of weapons used in the game.
     * @returns {string} An HTML string of the rendered archive template.
     */
    static get(game, weapons) {
        return /* html */`
            <div id="top">
                <div id="game">
                    ${ArchiveView.CommonCompletedDetailsView.get(game)}
                </div>
                <div id="players">
                    ${ArchiveView.CommonCompletedPlayersView.get(game)}
                </div>
            </div>
            <div id="selector">
                <a id="show-damage" href="#">Player Stats</a> | <a id="show-game" href="#">Game Graphs</a> | <a id="show-damage-graphs" href="#">Damage Graphs</a> | <a id="show-weapon-graphs" href="#">Weapon Graphs</a> | <a id="show-player" href="#">Player Graphs</a>
            </div>
            <div id="damage">
                ${game.players && /* html */`
                    <div id="weapons">
                        Stats: <a class="stats" href="#">Damage</a> | <a class="stats" href="#">Kills</a> | <a class="stats" href="#">Assists</a> | <a class="stats" href="#">Assisted</a> | <a class="stats" href="#">Damage Per Kill</a><br />
                        Weapon: ${weapons.map((weapon) => /* html */`
                            <a class="weapon" href="#" title="${weapon}"><img src="/images/${weapon.replace(/ /g, "").toLocaleLowerCase()}.png" width="28" height="41" alt="${weapon}" /></a>
                        `).join("")}
                    </div>
                    <div id="grid">
                        <div class="table" style="grid-template-columns: repeat(${2 + game.players.length}, max-content)">
                            <div id="weapon-container">
                                <div id="weapon"></div>
                            </div>
                            ${game.players.sort((a, b) => a.name.localeCompare(b.name)).map((player) => /* html */`
                                <div class="vertical header">${ArchiveView.Encoding.htmlEncode(player.name)}</div>
                            `).join("")}
                            <div class="vertical header">Total</div>
                            ${game.players.map((player, index) => /* html */`
                                <div class="header">${ArchiveView.Encoding.htmlEncode(player.name)}</div>
                                ${game.players.map((opponent, opponentIndex) => /* html */`
                                    <div id="damage-${index}-${opponentIndex}" class="right ${index === opponentIndex ? "self" : player.team && player.team === opponent.team ? `friendly${game.settings && game.settings.friendlyFire ? " count" : ""}` : ""}"></div>
                                `).join("")}
                                <div id="damage-${index}-total" class="right"></div>
                            `).join("")}
                            <div class="header">Total</div>
                            ${game.players.map((player, index) => /* html */`
                                <div id="damage-total-${index}" class="right"></div>
                            `).join("")}
                            <div class="empty"></div>
                        </div>
                    </div>
                ` || ""}
            </div>
            <div id="damage-graphs" class="chart hidden">
                <a id="overall-damage" href="#">Overall Damage</a> | <a id="damage-taken" href="#">Damage Taken</a> | <a id="net-damage" href="#">Net Damage</a> | <a id="damage-types" href="#">Damage Types</a> | <a id="primary-damage" href="#">Primary Damage</a> | <a id="secondary-damage" href="#">Secondary Damage</a>
                <canvas id="damage-chart"></canvas>
            </div>
            <div id="weapon-graphs" class="chart hidden">
                <div id="weapons-2">
                    Weapon: ${weapons.map((weapon) => /* html */`
                        <a class="weapon-graph" href="#" title="${weapon}"><img src="/images/${weapon.replace(/ /g, "").toLocaleLowerCase()}.png" width="28" height="41" alt="${weapon}" /></a>
                    `).join("")}
                </div>
                <canvas id="weapon-chart"></canvas>
            </div>
            <div id="game-graphs" class="chart hidden">
                <a id="score-over-time" href="#">Score Over Time</a> | <a id="score-differential-over-time" href="#">Score Differential Over Time</a>
                <canvas id="game-chart"></canvas>
            </div>
            <div id="player-graphs" class="chart hidden">
                ${game.players.map((player) => /* html */`
                    <a class="player-graph" href="#" title="${ArchiveView.Encoding.htmlEncode(player.name)}">${ArchiveView.Encoding.htmlEncode(player.name)}</a>
                `).join(" | ")}
                <canvas id="player-chart"></canvas>
            </div>
            <div id="bottom">
                <div id="events">
                    ${ArchiveView.CommonEventsView.get(game)}
                </div>
                <div id="settings">
                    ${ArchiveView.CommonSettingsView.get(game)}
                </div>
            </div>
            <script>
                ArchiveJs.game = ${JSON.stringify(game)}
            </script>
        `;
    }
}

/** @type {typeof import("./common/completedDetails")} */
// @ts-ignore
ArchiveView.CommonCompletedDetailsView = typeof CommonCompletedDetailsView === "undefined" ? require("./common/completedDetails") : CommonCompletedDetailsView; // eslint-disable-line no-undef

/** @type {typeof import("./common/completedPlayers")} */
// @ts-ignore
ArchiveView.CommonCompletedPlayersView = typeof CommonCompletedPlayersView === "undefined" ? require("./common/completedPlayers") : CommonCompletedPlayersView; // eslint-disable-line no-undef

/** @type {typeof import("./common/events")} */
// @ts-ignore
ArchiveView.CommonEventsView = typeof CommonEventsView === "undefined" ? require("./common/events") : CommonEventsView; // eslint-disable-line no-undef

/** @type {typeof import("./common/settings")} */
// @ts-ignore
ArchiveView.CommonSettingsView = typeof CommonSettingsView === "undefined" ? require("./common/settings") : CommonSettingsView; // eslint-disable-line no-undef

/** @type {typeof import("../js/common/encoding")} */
// @ts-ignore
ArchiveView.Encoding = typeof Encoding === "undefined" ? require("../js/common/encoding") : Encoding; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.ArchiveView = ArchiveView;
} else {
    module.exports = ArchiveView; // eslint-disable-line no-undef
}
