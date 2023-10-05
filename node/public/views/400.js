/**
 * A class that gets the 400 view.
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
     * @returns {string} An HTML string of the bad request view.
     */
    static get() {
        return /* html */`
            <div id="error">
                <div class="section">400 - That's not how you use websites.</div>
                <div class="text">Bad Request</div>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.BadRequestView = BadRequestView;
} else {
    module.exports = BadRequestView; // eslint-disable-line no-undef
}
