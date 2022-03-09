//  ####              #  ####                                       #     #   #    #
//   #  #             #  #   #                                      #     #   #
//   #  #   ###    ## #  #   #   ###    ## #  #   #   ###    ###   ####   #   #   ##     ###   #   #
//   ###       #  #  ##  ####   #   #  #  ##  #   #  #   #  #       #      # #     #    #   #  #   #
//   #  #   ####  #   #  # #    #####  #  ##  #   #  #####   ###    #      # #     #    #####  # # #
//   #  #  #   #  #  ##  #  #   #       ## #  #  ##  #          #   #  #   # #     #    #      # # #
//  ####    ####   ## #  #   #   ###       #   ## #   ###   ####     ##     #     ###    ###    # #
//                                         #
//                                         #
/**
 * A class that represents the 400 view.
 */
class BadRequestView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered bad request template.
     * @param {{message: string}} data The data for the bad request view.
     * @returns {string} An HTML string of the bad request view.
     */
    static get(data) {
        const {message} = data;

        return /* html */`
            <div id="error">
                <div class="section">400 - Cloaking device activated.</div>
                <div class="text">${message}</div>
            </div>
        `;
    }
}

if (typeof module !== "undefined") {
    module.exports = BadRequestView; // eslint-disable-line no-undef
}
