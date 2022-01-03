//  ####    ##                                 ###                         #     #   #    #
//  #   #    #                                #   #                        #     #   #
//  #   #    #     ###   #   #   ###   # ##   #       ###   #   #  # ##   ####   #   #   ##     ###   #   #
//  ####     #        #  #   #  #   #  ##  #  #      #   #  #   #  ##  #   #      # #     #    #   #  #   #
//  #        #     ####  #  ##  #####  #      #      #   #  #   #  #   #   #      # #     #    #####  # # #
//  #        #    #   #   ## #  #      #      #   #  #   #  #  ##  #   #   #  #   # #     #    #      # # #
//  #       ###    ####      #   ###   #       ###    ###    ## #  #   #    ##     #     ###    ###    # #
//                       #   #
//                        ###
/**
 * A class that represents the game details view.
 */
class PlayerCountView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered player count template.
     * @param {object} game The game to display.
     * @returns {string} An HTML string of the rendered details template.
     */
    static get(game) {
        return /* html */`
            ${!game.inLobby && game.settings && game.players && game.settings.joinInProgress ? /* html */`
                ${game.players.filter((p) => !p.disconnected).length}/${game.settings.maxPlayers} Players
            ` : ""}
        `;
    }
}

if (typeof module !== "undefined") {
    module.exports = PlayerCountView; // eslint-disable-line no-undef
}
