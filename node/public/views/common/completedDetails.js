//   ###                                       ###                         ##            #                #  ####           #              #     ##           #   #    #
//  #   #                                     #   #                         #            #                #   #  #          #                     #           #   #
//  #       ###   ## #   ## #    ###   # ##   #       ###   ## #   # ##     #     ###   ####    ###    ## #   #  #   ###   ####    ###    ##      #     ###   #   #   ##     ###   #   #
//  #      #   #  # # #  # # #  #   #  ##  #  #      #   #  # # #  ##  #    #    #   #   #     #   #  #  ##   #  #  #   #   #         #    #      #    #       # #     #    #   #  #   #
//  #      #   #  # # #  # # #  #   #  #   #  #      #   #  # # #  ##  #    #    #####   #     #####  #   #   #  #  #####   #      ####    #      #     ###    # #     #    #####  # # #
//  #   #  #   #  # # #  # # #  #   #  #   #  #   #  #   #  # # #  # ##     #    #       #  #  #      #  ##   #  #  #       #  #  #   #    #      #        #   # #     #    #      # # #
//   ###    ###   #   #  #   #   ###   #   #   ###    ###   #   #  #       ###    ###     ##    ###    ## #  ####    ###     ##    ####   ###    ###   ####     #     ###    ###    # #
//                                                                 #
//                                                                 #
/**
 * A class that represents the game details view.
 */
class CommonCompletedDetailsView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered completed details template.
     * @param {object} game The game to display.
     * @param {boolean} [addLink] Add a link to the game page.
     * @param {number} [id] The number of the game ID.
     * @returns {string} An HTML string of the rendered completed details template.
     */
    static get(game, addLink, id) {
        // @ts-ignore
        if (typeof window !== "undefined") {
            // @ts-ignore
            setTimeout(CommonCompletedDetailsView.Countdown.create, 1);
        }

        return /* html */`
            <div class="table">
                <div class="server">${addLink ? /* html */`
                    <a href="/archive/${id}">
                        ` : ""}${CommonCompletedDetailsView.Encoding.htmlEncode(game.server && game.server.name || game.server && game.server.ip || game.ip || "Unknown")}${addLink ? /* html */`
                    </a>
                ` : ""}</div>
                <div class="scores">
                    ${CommonCompletedDetailsView.ScoreView.get(game)}
                </div>
                <div class="info">
                    <div class="time">
                        Completed <time class="timeago" datetime="${new Date(game.end).toISOString()}">${new Date(game.end)}</time>
                    </div>
                    ${game.settings ? /* html */`
                        <div class="map">${CommonCompletedDetailsView.Encoding.htmlEncode(game.settings.matchMode)}${game.settings.level && ` - ${CommonCompletedDetailsView.Encoding.htmlEncode(game.settings.level)}` || ""}</div>
                    ` : ""}
                    ${game.settings && game.settings.condition ? /* html */`
                        <div class="condition">${game.settings.condition}</div>
                    ` : ""}
                </div>
            </div>
        `;
    }
}

/** @type {typeof import("../../js/common/countdown")} */
// @ts-ignore
CommonCompletedDetailsView.Countdown = typeof Countdown === "undefined" ? require("../../js/common/countdown") : Countdown; // eslint-disable-line no-undef

/** @type {typeof import("../../js/common/encoding")} */
// @ts-ignore
CommonCompletedDetailsView.Encoding = typeof Encoding === "undefined" ? require("../../js/common/encoding") : Encoding; // eslint-disable-line no-undef

/** @type {typeof import("./score")} */
// @ts-ignore
CommonCompletedDetailsView.ScoreView = typeof ScoreView === "undefined" ? require("./score") : ScoreView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.CommonCompletedDetailsView = CommonCompletedDetailsView;
} else {
    module.exports = CommonCompletedDetailsView; // eslint-disable-line no-undef
}
