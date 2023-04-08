//   ###                         #         #
//  #   #                        #         #
//  #       ###   #   #  # ##   ####    ## #   ###   #   #  # ##
//  #      #   #  #   #  ##  #   #     #  ##  #   #  #   #  ##  #
//  #      #   #  #   #  #   #   #     #   #  #   #  # # #  #   #
//  #   #  #   #  #  ##  #   #   #  #  #  ##  #   #  # # #  #   #
//   ###    ###    ## #  #   #    ##    ## #   ###    # #   #   #
/**
 * A class that represents a countdown.
 */
class Countdown {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * Creates a new countdown instance.
     * @param {number} timeRemaining The amount of time remaining, in milliseconds.
     * @param {Element} [el] The element to write to.
     */
    constructor(timeRemaining, el) {
        this.deadline = new Date(new Date().getTime() + timeRemaining);
        this.id = ++Countdown.id;

        if (el) {
            el.innerHTML = `<span id="countdown-${this.id}"></span>`;
        } else {
            document.write(`<span id="countdown-${this.id}"></span>`);
        }

        this.update();
    }

    //                          #
    //                          #
    //  ##   ###    ##    ###  ###    ##
    // #     #  #  # ##  #  #   #    # ##
    // #     #     ##    # ##   #    ##
    //  ##   #      ##    # #    ##   ##
    /**
     * Creates new instances of the Countdown object.
     * @returns {void}
     */
    static create() {
        const countdowns = /** @type {NodeListOf<HTMLElement>} **/(document.querySelectorAll(".countdown")); // eslint-disable-line no-extra-parens

        countdowns.forEach((countdown) => {
            new Countdown(+countdown.dataset.countdown, countdown);
        });
    }

    //                #         #
    //                #         #
    // #  #  ###    ###   ###  ###    ##
    // #  #  #  #  #  #  #  #   #    # ##
    // #  #  #  #  #  #  # ##   #    ##
    //  ###  ###    ###   # #    ##   ##
    //       #
    /**
     * Updates the countdown.
     * @returns {void}
     */
    update() {
        const countdown = document.getElementById(`countdown-${this.id}`);

        if (!countdown) {
            return;
        }

        const difference = this.deadline.getTime() - new Date().getTime(),
            days = Math.floor(Math.abs(difference) / (24 * 60 * 60 * 1000));

        if (difference > 0) {
            countdown.innerText = `${days > 0 ? `${days} day${days === 1 ? "" : "s"} ` : ""}${new Date(difference).toLocaleString("en-US", {timeZone: "GMT", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"})}`;

            if (Countdown.Time.live) {
                setTimeout(() => {
                    this.update();
                }, difference % 1000 + 1);
            }
        } else {
            countdown.innerText = `+${days > 0 ? `${days} day${days === 1 ? "" : "s"} ` : ""}${new Date(Math.abs(difference)).toLocaleString("en-US", {timeZone: "GMT", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"})}`;

            if (Countdown.Time.live) {
                setTimeout(() => {
                    this.update();
                }, 1000 - Math.abs(difference) % 1000 + 1);
            }
        }
    }
}

Countdown.id = 0;

/** @type {typeof import("./time")} */
// @ts-ignore
Countdown.Time = typeof Time === "undefined" ? require("./time") : Time; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.Countdown = Countdown;
} else {
    module.exports = Countdown; // eslint-disable-line no-undef
}
