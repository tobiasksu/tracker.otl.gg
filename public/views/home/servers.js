//   ###                                             #   #    #
//  #   #                                            #   #
//  #       ###   # ##   #   #   ###   # ##    ###   #   #   ##     ###   #   #
//   ###   #   #  ##  #  #   #  #   #  ##  #  #       # #     #    #   #  #   #
//      #  #####  #       # #   #####  #       ###    # #     #    #####  # # #
//  #   #  #      #       # #   #      #          #   # #     #    #      # # #
//   ###    ###   #        #     ###   #      ####     #     ###    ###    # #
/**
 * A class that represents the servers view.
 */
class ServersView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered servers template.
     * @param {object[]} servers The servers to display.
     * @returns {string} An HTML string of the rendered servers template.
     */
    static get(servers) {
        return /* html */`
            <div class="header">Name</div>
            <div class="header">IP Address</div>
            <div class="header">Map</div>
            <div class="header">Mode</div>
            <div class="header">Players</div>
            <div class="header">Last Updated</div>
            <div class="header">Last Game Started</div>
            <div class="header">Notes</div>
            ${Object.keys(servers).filter((s) => !servers[s].old).sort((a, b) => servers[a].name.localeCompare(servers[b].name)).map((s) => ServersView.ServerView.get(servers[s])).join("")}
            ${Object.keys(servers).filter((s) => servers[s].old).sort((a, b) => servers[a].name.localeCompare(servers[b].name)).map((s) => ServersView.ServerView.get(servers[s], true)).join("")}
        `;
    }
}

// @ts-ignore
ServersView.ServerView = typeof ServerView === "undefined" ? require("./server") : ServerView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = ServersView; // eslint-disable-line no-undef
}
