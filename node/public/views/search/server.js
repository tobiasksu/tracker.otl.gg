//   ###                               #       ###                                      #   #    #
//  #   #                              #      #   #                                     #   #
//  #       ###    ###   # ##    ###   # ##   #       ###   # ##   #   #   ###   # ##   #   #   ##     ###   #   #
//   ###   #   #      #  ##  #  #   #  ##  #   ###   #   #  ##  #  #   #  #   #  ##  #   # #     #    #   #  #   #
//      #  #####   ####  #      #      #   #      #  #####  #       # #   #####  #       # #     #    #####  # # #
//  #   #  #      #   #  #      #   #  #   #  #   #  #      #       # #   #      #       # #     #    #      # # #
//   ###    ###    ####  #       ###   #   #   ###    ###   #        #     ###   #        #     ###    ###    # #
/**
 * A class that represents a control to select a server.
 */
class SearchServerView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered server dropdown control.
     * @param {{server: string, ip: string}[]} servers The list of servers to select from.
     * @param {boolean} [first] Whether this is the first server search parameter.
     * @returns {string} An HTML string of the rendered server dropdown control.
     */
    static get(servers, first) {
        return /* html */`
            <select class="search-server" name="servers">
                ${first ? "<option value=\"\"></option>" : ""}
                ${servers.map((server) => /* html */`
                    <option value="${server.ip}">${server.server}</option>
                `).join("")}
            </select>
        `;
    }
}

if (typeof module === "undefined") {
    window.SearchServerView = SearchServerView;
} else {
    module.exports = SearchServerView; // eslint-disable-line no-undef
}
