//   ###                        #        #            #     #   #    #
//  #   #                       #                     #     #   #
//  #       ###   ## #    ###   #       ##     ###   ####   #   #   ##     ###   #   #
//  #          #  # # #  #   #  #        #    #       #      # #     #    #   #  #   #
//  #  ##   ####  # # #  #####  #        #     ###    #      # #     #    #####  # # #
//  #   #  #   #  # # #  #      #        #        #   #  #   # #     #    #      # # #
//   ###    ####  #   #   ###   #####   ###   ####     ##     #     ###    ###    # #
/**
 * A class that represents the game list view.
 */
class GameListView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered game list page template.
     * @param {object} games The games to display.
     * @returns {string} An HTML string of the rendered game list template.
     */
    static get(games) {
        return /* html */`
            <h1>Archived Games</h1>
            <div id="games">
                ${games.map((game) => /* html */`
                    <div><a href="/archive/${game.id}">${game.date}</a></div>
                    <div>${game.server && game.server.name || game.server && game.server.ip || game.ip || ""}</div>
                    <div>${game.data && game.data.settings && game.data.settings.matchMode || ""}</div>
                    <div>${game.data && game.data.settings && game.data.settings.level || ""}</div>
                    <div>
                        ${game.data && game.data.teamScore && Object.keys(game.data.teamScore).length > 0 && Object.keys(game.data.teamScore).sort((a, b) => game.data.teamScore[b] - game.data.teamScore[a]).map((team) => /* html */`
                            ${team} ${game.data.teamScore[team]}
                        `.trim()).join(", ") || game.data && game.data.players && game.data.players.length > 0 && game.data.players.sort((a, b) => (b.kills * 3 + b.assists) - (a.kills * 3 + a.assists)).map((player) => /* html */`
                            ${player.name} ${player.kills * 3 + player.assists}
                        `.trim()).join(", ") || ""}
                    </div>
                `).join("")}
            </div>
        `;
    }
}

if (typeof module !== "undefined") {
    module.exports = GameListView; // eslint-disable-line no-undef
}
