//  #####    #
//    #
//    #     ##    ## #    ###
//    #      #    # # #  #   #
//    #      #    # # #  #####
//    #      #    # # #  #
//    #     ###   #   #   ###
/**
 * A class that provides time functions.
 */
class Time {
    //   #                            #    ###    #
    //  # #                           #     #
    //  #     ##   ###   # #    ###  ###    #    ##    # #    ##
    // ###   #  #  #  #  ####  #  #   #     #     #    ####  # ##
    //  #    #  #  #     #  #  # ##   #     #     #    #  #  ##
    //  #     ##   #     #  #   # #    ##   #    ###   #  #   ##
    /**
     * Formats the time portion of the date.
     * @param {Date} time The time to display.
     * @returns {string} The formatted time.
     */
    static formatTime(time) {
        return `${time.getHours() === 0 ? "12" : time.getHours() > 12 ? time.getHours() - 12 : time.getHours()}:${`${time.getMinutes()}`.padStart(2, "0")} ${time.getHours() < 12 ? "AM" : "PM"}`;
    }

    //   #                            #    ###    #                 ##
    //  # #                           #     #                      #  #
    //  #     ##   ###   # #    ###  ###    #    ##    # #    ##    #    ###    ###  ###
    // ###   #  #  #  #  ####  #  #   #     #     #    ####  # ##    #   #  #  #  #  #  #
    //  #    #  #  #     #  #  # ##   #     #     #    #  #  ##    #  #  #  #  # ##  #  #
    //  #     ##   #     #  #   # #    ##   #    ###   #  #   ##    ##   ###    # #  #  #
    //                                                                   #
    /**
     * Formats a time span.
     * @param {number} seconds The number of seconds.
     * @param {number} [decimals] The number of decimals.
     * @returns {string} The formatted time span.
     */
    static formatTimeSpan(seconds, decimals) {
        if (decimals === void 0) {
            decimals = 3;
        }
        return `${seconds > 3600 ? `${Math.floor(seconds / 3600)}:` : ""}${seconds > 60 ? `${`${Math.floor(seconds / 60) % 60}`.padStart(2)}:` : ""}${`${Math.floor(seconds % 60)}`.padStart(2, "0")}${decimals ? `.${`${Math.floor(seconds * 1000) % 1000}`.padStart(decimals, "0")}` : ""}`;
    }

    //   #                            #    ###          #
    //  # #                           #    #  #         #
    //  #     ##   ###   # #    ###  ###   #  #   ###  ###    ##
    // ###   #  #  #  #  ####  #  #   #    #  #  #  #   #    # ##
    //  #    #  #  #     #  #  # ##   #    #  #  # ##   #    ##
    //  #     ##   #     #  #   # #    ##  ###    # #    ##   ##
    /**
     * Formats the date to show in the user's time zone.
     * @param {Date} time The date and time to display.
     * @returns {string} The formatted date and time.
     */
    static formatDate(time) {
        const now = new Date(),
            today = new Date(now);

        today.setMilliseconds(0);
        today.setSeconds(0);
        today.setMinutes(0);
        today.setHours(0);

        const date = new Date(time);

        date.setMilliseconds(0);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);

        switch (date.getTime() - today.getTime()) {
            case 0:
                return `Today ${Time.formatTime(time)}`;
            case 86400000:
                return `Tomorrow ${Time.formatTime(time)}`;
            case -86400000:
                return `Yesterday ${Time.formatTime(time)}`;
            default:
                return `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][time.getMonth()]} ${time.getDate().toString()} ${time.getFullYear().toString()} ${Time.formatTime(time)}`;
        }
    }

    // ##                   #  ###    #                 ##
    //  #                   #   #                      #  #
    //  #     ##    ###   ###   #    ##    # #    ##   #  #   ###   ##
    //  #    #  #  #  #  #  #   #     #    ####  # ##  ####  #  #  #  #
    //  #    #  #  # ##  #  #   #     #    #  #  ##    #  #   ##   #  #
    // ###    ##    # #   ###   #    ###   #  #   ##   #  #  #      ##
    //                                                        ###
    /**
     * Loads the timeago elements on the page.
     * @returns {void}
     */
    static loadTimeAgo() {
        /** @type {NodeListOf<HTMLTimeElement>} */
        const timeagoEls = document.querySelectorAll("time.timeago");

        if (timeagoEls.length > 0) {
            if (Time.live) {
                Time.Timeago.render(timeagoEls);
            } else {
                timeagoEls.forEach((el) => {
                    el.innerText = Time.Timeago.format(el.attributes.getNamedItem("datetime").value);
                    el.classList.remove("timeago");
                });
            }
        }
    }
}

Time.live = true;

/** @type {import("../../../node_modules/timeago.js/lib/index")} */
// @ts-ignore
Time.Timeago = typeof timeago === "undefined" ? require("../../../node_modules/timeago.js/lib/index") : timeago; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.Time = Time;
} else {
    module.exports = Time; // eslint-disable-line no-undef
}
