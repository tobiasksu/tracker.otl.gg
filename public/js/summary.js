/* global Common */

//   ###
//  #   #
//  #      #   #  ## #   ## #    ###   # ##   #   #
//   ###   #   #  # # #  # # #      #  ##  #  #   #
//      #  #   #  # # #  # # #   ####  #      #  ##
//  #   #  #  ##  # # #  # # #  #   #  #       ## #
//   ###    ## #  #   #  #   #   ####  #          #
//                                            #   #
//                                             ###
/**
 * A class that provides functions for the Summary page.
 */
class Summary {
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
        Common.loadTimeAgo();
    }
}

document.addEventListener("DOMContentLoaded", Summary.DOMContentLoaded);
