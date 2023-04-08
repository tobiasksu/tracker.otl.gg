//   ###    ##      #           #                               #  #   #                    #   ##
//  #   #    #                  #                               #  #   #                    #    #
//  #        #     ##    # ##   # ##    ###    ###   # ##    ## #  #   #   ###   # ##    ## #    #     ###   # ##
//  #        #      #    ##  #  ##  #  #   #      #  ##  #  #  ##  #####      #  ##  #  #  ##    #    #   #  ##  #
//  #        #      #    ##  #  #   #  #   #   ####  #      #   #  #   #   ####  #   #  #   #    #    #####  #
//  #   #    #      #    # ##   ##  #  #   #  #   #  #      #  ##  #   #  #   #  #   #  #  ##    #    #      #
//   ###    ###    ###   #      # ##    ###    ####  #       ## #  #   #   ####  #   #   ## #   ###    ###   #
//                       #
//                       #
/**
 * A class that handles setting up the clipboard.js object.
 */
class ClipboardHandler {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Sets up the clipboard.js object.
     * @returns {void}
     */
    static DOMContentLoaded() {
        const clipboard = new ClipboardHandler.ClipboardJS("button.copy");

        clipboard.on("success", (ev) => {
            const el = /** @type {HTMLElement} */(ev.trigger); // eslint-disable-line no-extra-parens

            ev.trigger.innerHTML = "&#x2705;";

            if (el.dataset.timeout) {
                clearTimeout(+el.dataset.timeout);
            }

            el.dataset.timeout = setTimeout(() => {
                el.innerHTML = "&#x1F4CB;";
            }, 1000).toString();
        });
    }
}

document.addEventListener("DOMContentLoaded", ClipboardHandler.DOMContentLoaded);

/** @type {typeof import("../../../node_modules/clipboard")} */
// @ts-ignore
ClipboardHandler.ClipboardJS = typeof ClipboardJS === "undefined" ? require("../../../node_modules/clipboard") : ClipboardJS; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.ClipboardHandler = ClipboardHandler;
} else {
    module.exports = ClipboardHandler; // eslint-disable-line no-undef
}
