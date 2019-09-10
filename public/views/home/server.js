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
            <div ${old ? "class=\"old\"" : ""}>${server.ip}</div>
            <div ${old ? "class=\"old\"" : ""}>
                ${server.map && server.map.length > 0 ? /* html */`
                    <a target="_blank" href="https://overloadmaps.com/${encodeURI(server.map.toLowerCase().replace(/[ _]/g, "-"))}">${ServerView.Common.htmlEncode(server.map)}</a>
                ` : ""}
            </div>
            <div ${old ? "class=\"old\"" : ""}>${server.mode ? ServerView.Common.htmlEncode(server.mode) : ""}</div>
            <div ${old ? "class=\"old\"" : ""}>${server.numPlayers || 0}/${server.maxNumPlayers || 0}</div>
            <div ${old ? "class=\"old\"" : ""}><time class="timeago" datetime="${new Date(server.lastSeen).toISOString()}">${new Date(server.lastSeen)}</time></div>
            <div ${old ? "class=\"old\"" : ""}>
                ${server.gameStarted ? /* html */`
                    <time class="timeago" datetime="${new Date(server.gameStarted).toISOString()}">${new Date(server.gameStarted)}</time>
                ` : ""}
            </div>
            <div ${old ? "class=\"old\"" : ""}>${ServerView.Common.htmlEncode(server.notes)}</div>
        `;
    }
}

// @ts-ignore
ServerView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = ServerView; // eslint-disable-line no-undef
}
