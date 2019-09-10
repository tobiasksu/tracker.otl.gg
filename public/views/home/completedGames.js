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
     * Gets the rendered completed games template.
     * @param {object[]} games The games to display.
     * @returns {string} An HTML string of the rendered completed games template.
     */
    static get(games) {
        return /* html */`
            ${Object.keys(games).map((s) => /* html */`
                <div class="game" id="completed-${games[s].id}">
                    ${CompletedGamesView.CompletedDetailsView.get(games[s].data, true)}
                </div>
            `).join("")}
        `;
    }
}

// @ts-ignore
CompletedGamesView.CompletedDetailsView = typeof CompletedDetailsView === "undefined" ? require("../common/completedDetails") : CompletedDetailsView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = CompletedGamesView; // eslint-disable-line no-undef
}
