//   ###                         ##            #                #   ###                               #   #    #
//  #   #                         #            #                #  #   #                              #   #
//  #       ###   ## #   # ##     #     ###   ####    ###    ## #  #       ###   ## #    ###    ###   #   #   ##     ###   #   #
//  #      #   #  # # #  ##  #    #    #   #   #     #   #  #  ##  #          #  # # #  #   #  #       # #     #    #   #  #   #
//  #      #   #  # # #  ##  #    #    #####   #     #####  #   #  #  ##   ####  # # #  #####   ###    # #     #    #####  # # #
//  #   #  #   #  # # #  # ##     #    #       #  #  #      #  ##  #   #  #   #  # # #  #          #   # #     #    #      # # #
//   ###    ###   #   #  #       ###    ###     ##    ###    ## #   ###    ####  #   #   ###   ####     #     ###    ###    # #
//                       #
//                       #
/**
 * A class that represents the completed games view.
 */
class CompletedGamesView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered games template.
     * @param {object[]} games The games to display.
     * @returns {string} An HTML string of the games.
     */
    static get(games) {
        return /* html */`
            ${Object.keys(games).map((s) => /* html */`
                <div class="game" id="completed-{games[s].id}">
                    ${CompletedGamesView.CompletedGameView.get(games[s].data)}
                </div>
            `).join("")}
        `;
    }
}

// @ts-ignore
CompletedGamesView.CompletedGameView = typeof CompletedGameView === "undefined" ? require("./game") : CompletedGameView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = CompletedGamesView; // eslint-disable-line no-undef
}
