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
     * @param {{name: string, ip: string}[]} servers The list of servers to select from.
     * @param {boolean} [first] Whether this is the first server search parameter.
     * @param {string} [ip] The server to select.
     * @returns {string} An HTML string of the rendered server dropdown control.
     */
    static get(servers, first, ip) {
        return /* html */`
            <select class="search-server" name="servers">
                ${first ? "<option value=\"\"></option>" : ""}
                ${servers.map((server) => /* html */`
                    <option value="${server.ip}"${ip === server.ip ? " selected" : ""}>${SearchServerView.Encoding.htmlEncode(server.name)}</option>
                `).join("")}
            </select>
        `;
    }
}

/** @type {typeof import("../../js/common/encoding")} */
// @ts-ignore
SearchServerView.Encoding = typeof Encoding === "undefined" ? require("../../js/common/encoding") : Encoding; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.SearchServerView = SearchServerView;
} else {
    module.exports = SearchServerView; // eslint-disable-line no-undef
}
