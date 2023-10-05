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
        const paginator = document.getElementById("paginator");
        if (paginator) {
            paginator.addEventListener("change", SearchJs.getPage);
        }
        document.getElementById("search").addEventListener("click", SearchJs.search);
        document.getElementById("add-server").addEventListener("click", SearchJs.addServer);
        SearchJs.parseTime();
    }

    //          #     #   ##                     ###
    //          #     #  #  #                     #
    //  ###   ###   ###  #      ###  # #    ##    #    #  #  ###    ##
    // #  #  #  #  #  #  # ##  #  #  ####  # ##   #    #  #  #  #  # ##
    // # ##  #  #  #  #  #  #  # ##  #  #  ##     #     # #  #  #  ##
    //  # #   ###   ###   ###   # #  #  #   ##    #      #   ###    ##
    //                                                  #    #
    /**
     * Adds another game type to the search.
     * @returns {void}
     */
    static addGameType() {
        const el = document.getElementById("add-gametype"),
            div = document.createElement("div"),
            select = document.createElement("select"),
            button = document.createElement("button");

        div.classList.add("parameter");
        select.classList.add("search-gametypes");
        div.appendChild(select);
        el.parentElement.insertBefore(div, el);

        for (const option of /** @type {HTMLSelectElement}*/(el.parentElement.querySelector(".parameter.first select")).options) { // eslint-disable-line no-extra-parens
            if (option.value) {
                const newOption = document.createElement("option");
                select.appendChild(newOption);
            }
        }

        button.classList.add("remove-gametype");
        button.innerHTML = "&times;";
        div.appendChild(button);

        button.addEventListener("click", SearchJs.removeGameType);
    }

    //          #     #  #  #
    //          #     #  ####
    //  ###   ###   ###  ####   ###  ###
    // #  #  #  #  #  #  #  #  #  #  #  #
    // # ##  #  #  #  #  #  #  # ##  #  #
    //  # #   ###   ###  #  #   # #  ###
    //                               #
    /**
     * Adds another map to the search.
     * @returns {void}
     */
    static addMap() {
        const el = document.getElementById("add-map"),
            div = document.createElement("div"),
            input = document.createElement("input"),
            button = document.createElement("button");

        div.classList.add("parameter");
        input.classList.add("search-maps");
        div.appendChild(input);
        el.parentElement.insertBefore(div, el);

        button.classList.add("remove-map");
        button.innerHTML = "&times;";
        div.appendChild(button);

        button.addEventListener("click", SearchJs.removeMap);
    }

    //          #     #  ###   ##
    //          #     #  #  #   #
    //  ###   ###   ###  #  #   #     ###  #  #   ##   ###
    // #  #  #  #  #  #  ###    #    #  #  #  #  # ##  #  #
    // # ##  #  #  #  #  #      #    # ##   # #  ##    #
    //  # #   ###   ###  #     ###    # #    #    ##   #
    //                                      #
    /**
     * Adds another player to the search.
     * @returns {void}
     */
    static addPlayer() {
        const el = document.getElementById("add-player"),
            div = document.createElement("div"),
            input = document.createElement("input"),
            button = document.createElement("button");

        div.classList.add("parameter");
        input.classList.add("search-players");
        div.appendChild(input);
        el.parentElement.insertBefore(div, el);

        button.classList.add("remove-player");
        button.innerHTML = "&times;";
        div.appendChild(button);

        button.addEventListener("click", SearchJs.removePlayer);
    }

    //          #     #   ##
    //          #     #  #  #
    //  ###   ###   ###   #     ##    ##   ###    ##
    // #  #  #  #  #  #    #   #     #  #  #  #  # ##
    // # ##  #  #  #  #  #  #  #     #  #  #     ##
    //  # #   ###   ###   ##    ##    ##   #      ##
    /**
     * Adds another score to the search.
     * @returns {void}
     */
    static addScore() {
        const el = document.getElementById("add-score"),
            div = document.createElement("div"),
            input = document.createElement("input"),
            button = document.createElement("button");

        div.classList.add("parameter");
        input.classList.add("search-scores");
        input.type = "number";
        div.appendChild(input);
        el.parentElement.insertBefore(div, el);

        button.classList.add("remove-score");
        button.innerHTML = "&times;";
        div.appendChild(button);

        button.addEventListener("click", SearchJs.removeScore);
    }

    //          #     #   ##
    //          #     #  #  #
    //  ###   ###   ###   #     ##   ###   # #    ##   ###
    // #  #  #  #  #  #    #   # ##  #  #  # #   # ##  #  #
    // # ##  #  #  #  #  #  #  ##    #     # #   ##    #
    //  # #   ###   ###   ##    ##   #      #     ##   #
    /**
     * Adds another server to the search.
     * @returns {void}
     */
    static addServer() {
        const el = document.getElementById("add-server"),
            div = document.createElement("div"),
            button = document.createElement("button");

        div.classList.add("parameter");
        div.innerHTML = SearchJs.SearchServerView.get(SearchJs.servers, false);
        el.parentElement.insertBefore(div, el);

        button.classList.add("remove-server");
        button.innerHTML = "&times;";
        div.appendChild(button);

        button.addEventListener("click", SearchJs.removeServer);
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

        const url = `/api/search${window.location.search ? `${window.location.search}&` : "?"}page=${page}`;

        await SearchJs.Template.loadDataIntoTemplate(url, "#games", SearchJs.GameListGamesView.get);

        el.classList.remove("hidden");

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

    //                                      ##                     ###
    //                                     #  #                     #
    // ###    ##   # #    ##   # #    ##   #      ###  # #    ##    #    #  #  ###    ##
    // #  #  # ##  ####  #  #  # #   # ##  # ##  #  #  ####  # ##   #    #  #  #  #  # ##
    // #     ##    #  #  #  #  # #   ##    #  #  # ##  #  #  ##     #     # #  #  #  ##
    // #      ##   #  #   ##    #     ##    ###   # #  #  #   ##    #      #   ###    ##
    //                                                                    #    #
    /**
     * Removes the game type adjacent to the button that was pressed.
     * @param {MouseEvent} ev The mouse event.
     * @returns {void}
     */
    static removeGameType(ev) {
        const el = /** @type {HTMLButtonElement} */(ev.target); // eslint-disable-line no-extra-parens

        el.removeEventListener("click", SearchJs.removeGameType);
        el.parentElement.remove();
    }

    //                                     #  #
    //                                     ####
    // ###    ##   # #    ##   # #    ##   ####   ###  ###
    // #  #  # ##  ####  #  #  # #   # ##  #  #  #  #  #  #
    // #     ##    #  #  #  #  # #   ##    #  #  # ##  #  #
    // #      ##   #  #   ##    #     ##   #  #   # #  ###
    //                                                 #
    /**
     * Removes the map adjacent to the button that was pressed.
     * @param {MouseEvent} ev The mouse event.
     * @returns {void}
     */
    static removeMap(ev) {
        const el = /** @type {HTMLButtonElement} */(ev.target); // eslint-disable-line no-extra-parens

        el.removeEventListener("click", SearchJs.removeMap);
        el.parentElement.remove();
    }

    //                                     ###   ##
    //                                     #  #   #
    // ###    ##   # #    ##   # #    ##   #  #   #     ###  #  #   ##   ###
    // #  #  # ##  ####  #  #  # #   # ##  ###    #    #  #  #  #  # ##  #  #
    // #     ##    #  #  #  #  # #   ##    #      #    # ##   # #  ##    #
    // #      ##   #  #   ##    #     ##   #     ###    # #    #    ##   #
    //                                                        #
    /**
     * Removes the player adjacent to the button that was pressed.
     * @param {MouseEvent} ev The mouse event.
     * @returns {void}
     */
    static removePlayer(ev) {
        const el = /** @type {HTMLButtonElement} */(ev.target); // eslint-disable-line no-extra-parens

        el.removeEventListener("click", SearchJs.removePlayer);
        el.parentElement.remove();
    }

    //                                      ##
    //                                     #  #
    // ###    ##   # #    ##   # #    ##    #     ##    ##   ###    ##
    // #  #  # ##  ####  #  #  # #   # ##    #   #     #  #  #  #  # ##
    // #     ##    #  #  #  #  # #   ##    #  #  #     #  #  #     ##
    // #      ##   #  #   ##    #     ##    ##    ##    ##   #      ##
    /**
     * Removes the score adjacent to the button that was pressed.
     * @param {MouseEvent} ev The mouse event.
     * @returns {void}
     */
    static removeScore(ev) {
        const el = /** @type {HTMLButtonElement} */(ev.target); // eslint-disable-line no-extra-parens

        el.removeEventListener("click", SearchJs.removeScore);
        el.parentElement.remove();
    }

    //                                      ##
    //                                     #  #
    // ###    ##   # #    ##   # #    ##    #     ##   ###   # #    ##   ###
    // #  #  # ##  ####  #  #  # #   # ##    #   # ##  #  #  # #   # ##  #  #
    // #     ##    #  #  #  #  # #   ##    #  #  ##    #     # #   ##    #
    // #      ##   #  #   ##    #     ##    ##    ##   #      #     ##   #
    /**
     * Removes the server adjacent to the button that was pressed.
     * @param {MouseEvent} ev The mouse event.
     * @returns {void}
     */
    static removeServer(ev) {
        const el = /** @type {HTMLButtonElement} */(ev.target); // eslint-disable-line no-extra-parens

        el.removeEventListener("click", SearchJs.removeServer);
        el.parentElement.remove();
    }

    //                                #
    //                                #
    //  ###    ##    ###  ###    ##   ###
    // ##     # ##  #  #  #  #  #     #  #
    //   ##   ##    # ##  #     #     #  #
    // ###     ##    # #  #      ##   #  #
    /**
     * Searches for games.
     * @returns {void}
     */
    static search() {
        const ips = /** @type {NodeListOf<HTMLSelectElement>} */(document.querySelectorAll("#search-ips .parameter select")), // eslint-disable-line no-extra-parens
            maps = /** @type {NodeListOf<HTMLInputElement>} */(document.querySelectorAll("#search-maps .parameter input")), // eslint-disable-line no-extra-parens
            players = /** @type {NodeListOf<HTMLInputElement>} */(document.querySelectorAll("#search-players .parameter input")), // eslint-disable-line no-extra-parens
            gametypes = /** @type {NodeListOf<HTMLSelectElement>} */(document.querySelectorAll("#search-gametypes .parameter select")), // eslint-disable-line no-extra-parens
            scores = /** @type {NodeListOf<HTMLInputElement>} */(document.querySelectorAll("#search-scores .parameter input")); // eslint-disable-line no-extra-parens

        const ipList = [],
            mapList = [],
            playerList = [],
            gametypeList = [],
            scoreList = [];

        for (const ip of ips) {
            if (ip.value) {
                ipList.push(ip.value);
            }
        }

        for (const map of maps) {
            if (map.value) {
                mapList.push(map.value);
            }
        }

        for (const player of players) {
            if (player.value) {
                playerList.push(player.value);
            }
        }

        for (const gametype of gametypes) {
            if (gametype.value) {
                gametypeList.push(gametype.value);
            }
        }

        for (const score of scores) {
            if (score.value) {
                if (isNaN(+score.value) || !Number.isInteger(+score.value)) {
                    const modal = document.getElementById("modal"),
                        modalText = document.getElementById("modal-text"),
                        modalClose = document.getElementById("modal-close");

                    modal.classList.remove("hidden");
                    modalText.innerText = "Score must be an integer.";
                    modalClose.focus();

                    modalClose.addEventListener("click", () => {
                        modal.classList.add("hidden");
                    });

                    return;
                }
                scoreList.push(score.value);
            }
        }

        const url = `/search?${ipList.length > 0 ? `ips[]=${ipList.join("&ips[]=")}&` : ""}${mapList.length > 0 ? `maps[]=${mapList.join("&maps[]=")}&` : ""}${playerList.length > 0 ? `players[]=${playerList.join("&players[]=")}&` : ""}${gametypeList.length > 0 ? `gametypes[]=${gametypeList.join("&gametypes[]=")}&` : ""}${scoreList.length > 0 ? `scores[]=${scoreList.join("&scores[]=")}` : ""}`;

        if (url.endsWith("&")) {
            window.location.href = url.substr(0, url.length - 1);
        }

        window.location.href = url;
    }
}

/** @type {{ip: string, server: string}[]} */
SearchJs.servers = null;

document.addEventListener("DOMContentLoaded", SearchJs.DOMContentLoaded);

/** @type {typeof import("../views/gamelist/games")} */
// @ts-ignore
SearchJs.GameListGamesView = typeof GameListGamesView === "undefined" ? require("../views/gamelist/games") : GameListGamesView; // eslint-disable-line no-undef

/** @type {typeof import("../views/search/server")} */
// @ts-ignore
SearchJs.SearchServerView = typeof SearchServerView === "undefined" ? require("../views/search/server") : SearchServerView; // eslint-disable-line no-undef

/** @type {typeof import("./common/template")} */
// @ts-ignore
SearchJs.Template = typeof Template === "undefined" ? require("./common/template") : Template; // eslint-disable-line no-undef

/** @type {typeof import("./common/time")} */
// @ts-ignore
SearchJs.Time = typeof Time === "undefined" ? require("./common/time") : Time; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.SearchJs = SearchJs;
} else {
    module.exports = SearchJs; // eslint-disable-line no-undef
}
