/* global timeago */

//    #                  #        #                    ###
//   # #                 #                               #
//  #   #  # ##    ###   # ##    ##    #   #   ###       #   ###
//  #   #  ##  #  #   #  ##  #    #    #   #  #   #      #  #
//  #####  #      #      #   #    #     # #   #####      #   ###
//  #   #  #      #   #  #   #    #     # #   #      #   #      #
//  #   #  #       ###   #   #   ###     #     ###    ###   ####
/**
 * A class that provides functions for the archive page.
 */
class ArchiveJs {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Makes sure all timeago fields are rendered.
     * @returns {void}
     */
    static DOMContentLoaded() {
        timeago().render(document.querySelectorAll(".timeago"));
    }
}

document.addEventListener("DOMContentLoaded", ArchiveJs.DOMContentLoaded);
