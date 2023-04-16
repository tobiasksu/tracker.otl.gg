/**
 * @typedef {import("../../js/common/game")} Game
 */

//   ###                                      #####                        #            #   #    #
//  #   #                                     #                            #            #   #
//  #       ###   ## #   ## #    ###   # ##   #      #   #   ###   # ##   ####    ###   #   #   ##     ###   #   #
//  #      #   #  # # #  # # #  #   #  ##  #  ####   #   #  #   #  ##  #   #     #       # #     #    #   #  #   #
//  #      #   #  # # #  # # #  #   #  #   #  #       # #   #####  #   #   #      ###    # #     #    #####  # # #
//  #   #  #   #  # # #  # # #  #   #  #   #  #       # #   #      #   #   #  #      #   # #     #    #      # # #
//   ###    ###   #   #  #   #   ###   #   #  #####    #     ###   #   #    ##   ####     #     ###    ###    # #
/**
 * A class that represents the game events view.
 */
class CommonEventsView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered events template.
     * @param {Game} game The game to display.
     * @returns {string} An HTML string of the rendered events template.
     */
    static get(game) {
        return /* html */`
            ${game.events && game.events.sort((a, b) => b.time - a.time).map((event) => /* html */`
                <div class="time">${CommonEventsView.Time.formatTimeSpan(event.time)}</div>
                <div class="event">${CommonEventsView.Encoding.htmlEncode(event.description)}</div>
            `).join("") || ""}
        `;
    }
}

/** @type {typeof import("../../js/common/encoding")} */
// @ts-ignore
CommonEventsView.Encoding = typeof Encoding === "undefined" ? require("../../js/common/encoding") : Encoding; // eslint-disable-line no-undef

/** @type {typeof import("../../js/common/time")} */
// @ts-ignore
CommonEventsView.Time = typeof Time === "undefined" ? require("../../js/common/time") : Time; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.CommonEventsView = CommonEventsView;
} else {
    module.exports = CommonEventsView; // eslint-disable-line no-undef
}
