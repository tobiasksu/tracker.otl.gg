//   ###                                      #   #    #
//  #   #                                     #   #
//  #       ###   # ##   #   #   ###   # ##   #   #   ##     ###   #   #
//   ###   #   #  ##  #  #   #  #   #  ##  #   # #     #    #   #  #   #
//      #  #####  #       # #   #####  #       # #     #    #####  # # #
//  #   #  #      #       # #   #      #       # #     #    #      # # #
//   ###    ###   #        #     ###   #        #     ###    ###    # #
/**
 * A class that represents the server view.
 */
class ServerView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered server template.
     * @param {object} server The server to display.
     * @param {boolean} [old] Indicates that the server is old.
     * @returns {string} An HTML string of the rendered server template.
     */
    static get(server, old) {
        return /* html */`
            <div ${old ? "class=\"old\"" : ""}>${ServerView.Common.htmlEncode(server.name)}</div>
            <div ${old ? "class=\"old\"" : ""}><button class="copy" data-clipboard-text="${server.ip}">&#x1F4CB;</button> ${ServerView.Common.htmlEncode(server.ip)}</div>
            <div ${old ? "class=\"old\"" : ""}><time class="timeago" datetime="${new Date(server.lastSeen).toISOString()}">${new Date(server.lastSeen)}</time></div>
            <div ${old ? "class=\"old\"" : ""}>${ServerView.Common.htmlEncode(server.version)}</div>
            <div ${old ? "class=\"old\"" : ""}>${ServerView.Common.htmlEncode(server.notes)}</div>
        `;
    }
}

// @ts-ignore
ServerView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = ServerView; // eslint-disable-line no-undef
}
