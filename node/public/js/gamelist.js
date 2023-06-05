//   ###                        #        #            #       ###
//  #   #                       #                     #         #
//  #       ###   ## #    ###   #       ##     ###   ####       #   ###
//  #          #  # # #  #   #  #        #    #       #         #  #
//  #  ##   ####  # # #  #####  #        #     ###    #         #   ###
//  #   #  #   #  # # #  #      #        #        #   #  #  #   #      #
//   ###    ####  #   #   ###   #####   ###   ####     ##    ###   ####
/**
 * A class that provides functions for the game list page.
 */
class GameListJs {
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
        document.getElementById("paginator").addEventListener("change", GameListJs.getPage);
        GameListJs.parseTime();
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
            time.innerText = GameListJs.Time.formatDate(new Date(time.dateTime));
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

        await GameListJs.Template.loadDataIntoTemplate(`/api/gamelist?page=${page}`, "#games", GameListJs.GameListGamesView.get);

        el.classList.remove("hidden");

        GameListJs.parseTime();
    }
}

document.addEventListener("DOMContentLoaded", GameListJs.DOMContentLoaded);

/** @type {typeof import("../views/gamelist/games")} */
// @ts-ignore
GameListJs.GameListGamesView = typeof GameListGamesView === "undefined" ? require("../views/gamelist/games") : GameListGamesView; // eslint-disable-line no-undef

/** @type {typeof import("./common/template")} */
// @ts-ignore
GameListJs.Template = typeof Template === "undefined" ? require("./common/template") : Template; // eslint-disable-line no-undef

/** @type {typeof import("./common/time")} */
// @ts-ignore
GameListJs.Time = typeof Time === "undefined" ? require("./common/time") : Time; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.GameListJs = GameListJs;
} else {
    module.exports = GameListJs; // eslint-disable-line no-undef
}
