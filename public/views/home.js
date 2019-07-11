//  #   #                       #   #    #
//  #   #                       #   #
//  #   #   ###   ## #    ###   #   #   ##     ###   #   #
//  #####  #   #  # # #  #   #   # #     #    #   #  #   #
//  #   #  #   #  # # #  #####   # #     #    #####  # # #
//  #   #  #   #  # # #  #       # #     #    #      # # #
//  #   #   ###   #   #   ###     #     ###    ###    # #
/**
 * A class that represents the home view.
 */
class HomeView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered home page template.
     * @param {object[]} servers The servers to display.
     * @returns {string} An HTML string of the home page.
     */
    static get(servers) {
        return /* html */`
            <div id="notice">
                <div class="grey">Note: This page will automatically refresh every 60 seconds.</div>
            </div>
            <div id="browser">
                ${HomeView.ServersView.get(servers)}
            </div>
        `;
    }
}

// @ts-ignore
HomeView.ServersView = typeof LogView === "undefined" ? require("./home/servers") : ServersView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = HomeView; // eslint-disable-line no-undef
}
