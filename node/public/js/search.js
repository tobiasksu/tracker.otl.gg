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
        document.getElementById("do-search").addEventListener("click", SearchJs.search);
        document.getElementById("add-server").addEventListener("click", SearchJs.addServer);
        document.getElementById("add-map").addEventListener("click", SearchJs.addMap);
        document.getElementById("add-player").addEventListener("click", SearchJs.addPlayer);
        document.getElementById("add-gametype").addEventListener("click", SearchJs.addGameType);
        document.getElementById("add-score").addEventListener("click", SearchJs.addScore);

        for (const el of document.getElementsByClassName("remove-server")) {
            el.addEventListener("click", SearchJs.removeServer);
        }

        for (const el of document.getElementsByClassName("remove-map")) {
            el.addEventListener("click", SearchJs.removeMap);
        }

        for (const el of document.getElementsByClassName("remove-player")) {
            el.addEventListener("click", SearchJs.removePlayer);
        }

        for (const el of document.getElementsByClassName("remove-gametype")) {
            el.addEventListener("click", SearchJs.removeGameType);
        }

        for (const el of document.getElementsByClassName("remove-score")) {
            el.addEventListener("click", SearchJs.removeScore);
        }

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
        const gameTypes = document.getElementsByClassName("search-gametypes");
        if (gameTypes.length >= 5) {
            SearchJs.showModal("You may only search for up to five game types.");
            return;
        }

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
                newOption.value = option.value;
                newOption.innerText = option.innerText;
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
        const maps = document.getElementsByClassName("search-maps");
        if (maps.length >= 5) {
            SearchJs.showModal("You may only search for up to five maps.");
            return;
        }

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
        const players = document.getElementsByClassName("search-players");
        if (players.length >= 8) {
            SearchJs.showModal("You may only search for up to eight players.");
            return;
        }

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
        const scores = document.getElementsByClassName("search-scores");
        if (scores.length >= 2) {
            SearchJs.showModal("You may only search for up to two scores.");
            return;
        }

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
        const servers = document.getElementsByClassName("search-server");
        if (servers.length >= 5) {
            SearchJs.showModal("You may only search for up to five servers.");
            return;
        }

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
            gameTypes = /** @type {NodeListOf<HTMLSelectElement>} */(document.querySelectorAll("#search-gametypes .parameter select")), // eslint-disable-line no-extra-parens
            scores = /** @type {NodeListOf<HTMLInputElement>} */(document.querySelectorAll("#search-scores .parameter input")); // eslint-disable-line no-extra-parens

        const ipList = [],
            mapList = [],
            playerList = [],
            gameTypeList = [],
            scoreList = [];

        for (const ip of ips) {
            if (ip.value && !ipList.includes(ip.value)) {
                ipList.push(ip.value);
            }
        }

        for (const map of maps) {
            if (map.value && !mapList.includes(map.value)) {
                mapList.push(map.value);
            }
        }

        for (const player of players) {
            if (player.value && !playerList.includes(player.value)) {
                playerList.push(player.value);
            }
        }

        for (const gameType of gameTypes) {
            if (gameType.value && !gameTypeList.includes(gameType.value)) {
                gameTypeList.push(gameType.value);
            }
        }

        for (const score of scores) {
            if (score.value) {
                if (isNaN(+score.value) || !Number.isInteger(+score.value)) {
                    SearchJs.showModal("Score must be an integer.");

                    return;
                }

                if (!scoreList.includes(score.value)) {
                    scoreList.push(score.value);
                }
            }
        }

        let url = `/search?${ipList.length > 0 ? `ips[]=${ipList.join("&ips[]=")}&` : ""}${mapList.length > 0 ? `maps[]=${mapList.join("&maps[]=")}&` : ""}${playerList.length > 0 ? `players[]=${playerList.join("&players[]=")}&` : ""}${gameTypeList.length > 0 ? `gameTypes[]=${gameTypeList.join("&gameTypes[]=")}&` : ""}${scoreList.length > 0 ? `scores[]=${scoreList.join("&scores[]=")}` : ""}`;

        if (url.endsWith("&")) {
            url = url.slice(0, -1);
        }

        window.location.href = url;
    }

    //        #                 #  #           #        ##
    //        #                 ####           #         #
    //  ###   ###    ##   #  #  ####   ##    ###   ###   #
    // ##     #  #  #  #  #  #  #  #  #  #  #  #  #  #   #
    //   ##   #  #  #  #  ####  #  #  #  #  #  #  # ##   #
    // ###    #  #   ##   ####  #  #   ##    ###   # #  ###
    /**
     * Shows a modal dialog.
     * @param {string} message The message to display.
     * @returns {void}
     */
    static showModal(message) {
        const modal = document.getElementById("modal"),
            modalText = document.getElementById("modal-text"),
            modalClose = document.getElementById("modal-close");

        modal.classList.remove("hidden");
        modalText.innerText = message;
        modalClose.focus();

        modalClose.addEventListener("click", () => {
            modal.classList.add("hidden");
        });
    }
}

/** @type {{ip: string, name: string}[]} */
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
