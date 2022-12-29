/* global Common, GamesView */

//   ###                               #
//  #   #                              #
//  #       ###    ###   # ##    ###   # ##
//   ###   #   #      #  ##  #  #   #  ##  #
//      #  #####   ####  #      #      #   #
//  #   #  #      #   #  #      #   #  #   #
//   ###    ###    ####  #       ###   #   #
/**
 * A class that provides functions for the search page.
 */
class Search {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Sets up pagination buttons.
     * @returns {void}
     */
    static DOMContentLoaded() {
        document.getElementById("paginator").addEventListener("change", Search.getPage);
        Search.parseTime();
    }

    //                                ###    #
    //                                 #
    // ###    ###  ###    ###    ##    #    ##    # #    ##
    // #  #  #  #  #  #  ##     # ##   #     #    ####  # ##
    // #  #  # ##  #       ##   ##     #     #    #  #  ##
    // ###    # #  #     ###     ##    #    ###   #  #   ##
    // #
    /**
     * Parses time elements to display the local time.
     * @returns {void}
     */
    static parseTime() {
        for (const time of document.getElementsByClassName("local")) {
            time.innerText = Common.formatDate(new Date(time.dateTime));
        }
    }

    //              #    ###
    //              #    #  #
    //  ###   ##   ###   #  #   ###   ###   ##
    // #  #  # ##   #    ###   #  #  #  #  # ##
    //  ##   ##     #    #     # ##   ##   ##
    // #      ##     ##  #      # #  #      ##
    //  ###                           ###
    /**
     * Retrieves and displays the current page.
     * @returns {Promise} A promise that resolves when the page has been retrieved.
     */
    static async getPage() {
        const el = document.getElementById("paginator"),
            page = el.options[el.selectedIndex].value;

        el.classList.add("hidden");

        await Common.loadDataIntoTemplate(`/api/search?q=${encodeURIComponent(window.q)}&page=${page}`, "#games", GamesView.get);

        el.classList.remove("hidden");

        Search.parseTime();
    }
}

document.addEventListener("DOMContentLoaded", Search.DOMContentLoaded);
