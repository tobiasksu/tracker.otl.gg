//  #####                        #            #   #    #
//  #                            #            #   #
//  #      #   #   ###   # ##   ####    ###   #   #   ##     ###   #   #
//  ####   #   #  #   #  ##  #   #     #       # #     #    #   #  #   #
//  #       # #   #####  #   #   #      ###    # #     #    #####  # # #
//  #       # #   #      #   #   #  #      #   # #     #    #      # # #
//  #####    #     ###   #   #    ##   ####     #     ###    ###    # #
/**
 * A class that represents the game events view.
 */
class EventsView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered game page template.
     * @param {object} game The game to display.
     * @returns {string} An HTML string of the game page.
     */
    static get(game) {
        return /* html */`
            ${game.events.map((event) => /* html */`
                <div class="time">${event.time}</div>
                <div class="type">${event.type}</div>
                <div class="event">${event.description}</div>
            `).join("")}
        `;
    }
}

// @ts-ignore
EventsView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = EventsView; // eslint-disable-line no-undef
}
