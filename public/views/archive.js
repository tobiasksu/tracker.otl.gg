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
                    ${ArchiveView.CompletedDetailsView.get(game)}
                </div>
                <div id="players">
                    ${ArchiveView.CompletedPlayersView.get(game)}
                </div>
            </div>
            <div id="selector">
                <a id="show-damage" href="#">Player Stats</a> | <a id="show-game" href="#">Game Graphs</a> | <a id="show-damage-graphs" href="#">Damage Graphs</a> | <a id="show-weapon-graphs" href="#">Weapon Graphs</a> | <a id="show-player" href="#">Player Graphs</a>
            </div>
            <div id="damage">
                ${game.players && /* html */`
                    <div id="weapons">
                        Weapon: ${weapons.map((weapon) => /* html */`
                            <a class="weapon" href="#" title="${weapon}"><img src="/images/${weapon.replace(/ /g, "").toLocaleLowerCase()}.png" width="28" height="41" alt="${weapon}" /></a>
                        `).join("")}
                    </div>
                    <div id="grid">
                        <div class="table" style="grid-template-columns: repeat(${3 + game.players.length}, max-content)">
                            <div id="weapon-container">
                                <div id="weapon">Select a weapon</div>
                            </div>
                            ${game.players.sort((a, b) => a.name.localeCompare(b.name)).map((player) => /* html */`
                                <div class="vertical header">${ArchiveView.Common.htmlEncode(player.name)}</div>
                            `).join("")}
                            <div class="vertical header">Total</div>
                            <div class="vertical header">All Weapons</div>
                            ${game.players.map((player, index) => /* html */`
                                <div class="header">${ArchiveView.Common.htmlEncode(player.name)}</div>
                                ${game.players.map((opponent, opponentIndex) => /* html */`
                                    <div id="damage-${index}-${opponentIndex}" class="right ${index === opponentIndex ? "self" : player.team && player.team === opponent.team ? `friendly${game.settings && game.settings.friendlyFire ? " count" : ""}` : ""}"></div>
                                `).join("")}
                                <div id="damage-${index}-total" class="right"></div>
                                <div class="right">${game.damage.filter((d) => d.attacker === player.name && d.attacker !== d.defender && (!game.players.find((p) => p.name === d.attacker).team || game.players.find((p) => p.name === d.defender) && game.players.find((p) => p.name === d.attacker).team !== game.players.find((p) => p.name === d.defender).team)).map((d) => d.damage).reduce((a, b) => a + b, 0).toFixed(0)}</div>
                            `).join("")}
                            <div class="header">Total</div>
                            ${game.players.map((player, index) => /* html */`
                                <div id="damage-total-${index}" class="right"></div>
                            `).join("")}
                            <div class="empty"></div>
                            <div class="empty"></div>
                            <div class="header">All Weapons</div>
                            ${game.players.map((player) => /* html */`
                                <div class="right">${game.damage.filter((d) => d.defender === player.name && (game.settings && game.settings.friendlyFire || d.attacker === d.defender || !game.players.find((p) => p.name === d.defender).team || game.players.find((p) => p.name === d.attacker) && game.players.find((p) => p.name === d.defender).team !== game.players.find((p) => p.name === d.attacker).team)).map((d) => d.damage).reduce((a, b) => a + b, 0).toFixed(0)}</div>
                            `).join("")}
                            <div class="empty"></div>
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
                    <a class="player-graph" href="#" title="${ArchiveView.Common.htmlEncode(player.name)}">${ArchiveView.Common.htmlEncode(player.name)}</a>
                `).join(" | ")}
                <canvas id="player-chart"></canvas>
            </div>
            <div id="bottom">
                <div id="events">
                    ${ArchiveView.EventsView.get(game)}
                </div>
                <div id="settings">
                    ${ArchiveView.SettingsView.get(game)}
                </div>
            </div>
            <script>
                ArchiveJs.game = ${JSON.stringify(game)}
            </script>
        `;
    }
}

// @ts-ignore
ArchiveView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef
// @ts-ignore
ArchiveView.CompletedDetailsView = typeof CompletedDetailsView === "undefined" ? require("./common/completedDetails") : CompletedDetailsView; // eslint-disable-line no-undef
// @ts-ignore
ArchiveView.CompletedPlayersView = typeof CompletedPlayersView === "undefined" ? require("./common/completedPlayers") : CompletedPlayersView; // eslint-disable-line no-undef
// @ts-ignore
ArchiveView.EventsView = typeof EventsView === "undefined" ? require("./common/events") : EventsView; // eslint-disable-line no-undef
// @ts-ignore
ArchiveView.SettingsView = typeof SettingsView === "undefined" ? require("./common/settings") : SettingsView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = ArchiveView; // eslint-disable-line no-undef
}
