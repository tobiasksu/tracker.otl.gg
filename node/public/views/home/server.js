/**
 * @typedef {import("../../../types/serverTypes").LocalServer} ServerTypes.LocalServer
 */

//  #   #                        ###                                      #   #    #
//  #   #                       #   #                                     #   #
//  #   #   ###   ## #    ###   #       ###   # ##   #   #   ###   # ##   #   #   ##     ###   #   #
//  #####  #   #  # # #  #   #   ###   #   #  ##  #  #   #  #   #  ##  #   # #     #    #   #  #   #
//  #   #  #   #  # # #  #####      #  #####  #       # #   #####  #       # #     #    #####  # # #
//  #   #  #   #  # # #  #      #   #  #      #       # #   #      #       # #     #    #      # # #
//  #   #   ###   #   #   ###    ###    ###   #        #     ###   #        #     ###    ###    # #
/**
 * A class that represents the server view.
 */
class HomeServerView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered server template.
     * @param {ServerTypes.LocalServer} server The server to display.
     * @param {boolean} [old] Indicates that the server is old.
     * @returns {string} An HTML string of the rendered server template.
     */
    static get(server, old) {
        return /* html */`
            <div ${old ? "class=\"old\"" : ""}>${HomeServerView.Encoding.htmlEncode(server.name)}</div>
            <div ${old ? "class=\"old\"" : ""}><button class="copy" data-clipboard-text="${server.ip}">&#x1F4CB;</button> ${HomeServerView.Encoding.htmlEncode(server.ip)}</div>
            <div ${old ? "class=\"old\"" : ""}><time class="timeago" datetime="${new Date(server.lastSeen).toISOString()}">${new Date(server.lastSeen)}</time></div>
            <div ${old ? "class=\"old\"" : ""}>${HomeServerView.Encoding.htmlEncode(server.version)}</div>
            <div ${old ? "class=\"old\"" : ""}>${HomeServerView.Encoding.htmlEncode(server.notes)}</div>
        `;
    }
}

/** @type {typeof import("../../js/common/encoding")} */
// @ts-ignore
HomeServerView.Encoding = typeof Encoding === "undefined" ? require("../../js/common/encoding") : Encoding; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.HomeServerView = HomeServerView;
} else {
    module.exports = HomeServerView; // eslint-disable-line no-undef
}
