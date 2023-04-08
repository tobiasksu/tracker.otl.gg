//   ###                               #        ###
//  #   #                              #          #
//  #       ###    ###   # ##    ###   # ##       #   ###
//   ###   #   #      #  ##  #  #   #  ##  #      #  #
//      #  #####   ####  #      #      #   #      #   ###
//  #   #  #      #   #  #      #   #  #   #  #   #      #
//   ###    ###    ####  #       ###   #   #   ###   ####
/**
 * A class that provides functions for the search page.
 */
class SearchJs {
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
        document.getElementById("paginator").addEventListener("change", SearchJs.getPage);
        SearchJs.parseTime();
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
        for (const time of /** @type {HTMLCollectionOf<HTMLTimeElement>} */(document.getElementsByClassName("local"))) { // eslint-disable-line no-extra-parens
            time.innerText = SearchJs.Time.formatDate(new Date(time.dateTime));
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
        const el = /** @type {HTMLSelectElement} */(document.getElementById("paginator")), // eslint-disable-line no-extra-parens
            page = el.options[el.selectedIndex].value;

        el.classList.add("hidden");

        await SearchJs.Template.loadDataIntoTemplate(`/api/search?q=${encodeURIComponent(window.q)}&page=${page}`, "#games", SearchJs.GameListGamesView.get);

        el.classList.remove("hidden");

        SearchJs.parseTime();
    }
}

document.addEventListener("DOMContentLoaded", SearchJs.DOMContentLoaded);

/** @type {typeof import("../views/gamelist/games")} */
// @ts-ignore
SearchJs.GameListGamesView = typeof GameListGamesView === "undefined" ? require("../views/gamelist/games") : GameListGamesView; // eslint-disable-line no-undef

/** @type {typeof import("./common/template")} */
// @ts-ignore
SearchJs.Template = typeof Template === "undefined" ? require("./common/template") : Template; // eslint-disable-line no-undef

/** @type {typeof import("./common/time")} */
// @ts-ignore
SearchJs.Time = typeof Time === "undefined" ? require("./common/time") : Time; // eslint-disable-line no-undef
