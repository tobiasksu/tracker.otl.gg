/**
 * @typedef {import("../../../types/node/serverTypes").LocalServer} ServerTypes.LocalServer
 */

//  #   #                        ###                                             #   #    #
//  #   #                       #   #                                            #   #
//  #   #   ###   ## #    ###   #       ###   # ##   #   #   ###   # ##    ###   #   #   ##     ###   #   #
//  #####  #   #  # # #  #   #   ###   #   #  ##  #  #   #  #   #  ##  #  #       # #     #    #   #  #   #
//  #   #  #   #  # # #  #####      #  #####  #       # #   #####  #       ###    # #     #    #####  # # #
//  #   #  #   #  # # #  #      #   #  #      #       # #   #      #          #   # #     #    #      # # #
//  #   #   ###   #   #   ###    ###    ###   #        #     ###   #      ####     #     ###    ###    # #
/**
 * A class that represents the servers view.
 */
class HomeServersView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered servers template.
     * @param {ServerTypes.LocalServer[]} servers The servers to display.
     * @returns {string} An HTML string of the rendered servers template.
     */
    static get(servers) {
        return /* html */`
            <div class="header">Name</div>
            <div class="header">IP Address</div>
            <div class="header">Last Updated</div>
            <div class="header">Version</div>
            <div class="header">Notes</div>
            ${Object.keys(servers).filter((s) => !servers[s].old).sort((a, b) => servers[a].name.localeCompare(servers[b].name)).map((s) => HomeServersView.HomeServerView.get(servers[s])).join("")}
            ${Object.keys(servers).filter((s) => servers[s].old).sort((a, b) => servers[a].name.localeCompare(servers[b].name)).map((s) => HomeServersView.HomeServerView.get(servers[s], true)).join("")}
        `;
    }
}

/** @type {typeof import("./server")} */
// @ts-ignore
HomeServersView.HomeServerView = typeof HomeServerView === "undefined" ? require("./server") : HomeServerView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.HomeServersView = HomeServersView;
} else {
    module.exports = HomeServersView; // eslint-disable-line no-undef
}
