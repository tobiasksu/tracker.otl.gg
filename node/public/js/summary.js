//   ###                                               ###
//  #   #                                                #
//  #      #   #  ## #   ## #    ###   # ##   #   #      #   ###
//   ###   #   #  # # #  # # #      #  ##  #  #   #      #  #
//      #  #   #  # # #  # # #   ####  #      #  ##      #   ###
//  #   #  #  ##  # # #  # # #  #   #  #       ## #  #   #      #
//   ###    ## #  #   #  #   #   ####  #          #   ###   ####
//                                            #   #
//                                             ###
/**
 * A class that provides functions for the Summary page.
 */
class SummaryJs {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Makes sure all timeago fields are rendered and starts the websocket.
     * @returns {void}
     */
    static DOMContentLoaded() {
        SummaryJs.Time.loadTimeAgo();
    }
}

document.addEventListener("DOMContentLoaded", SummaryJs.DOMContentLoaded);

/** @type {typeof import("./common/time")} */
// @ts-ignore
SummaryJs.Time = typeof Time === "undefined" ? require("./common/time") : Time; // eslint-disable-line no-undef
