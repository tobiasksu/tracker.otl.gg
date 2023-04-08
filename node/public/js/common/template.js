//  #####                        ##            #
//    #                           #            #
//    #     ###   ## #   # ##     #     ###   ####    ###
//    #    #   #  # # #  ##  #    #        #   #     #   #
//    #    #####  # # #  ##  #    #     ####   #     #####
//    #    #      # # #  # ##     #    #   #   #  #  #
//    #     ###   #   #  #       ###    ####    ##    ###
//                       #
//                       #
/**
 * A class that provides template functions.
 */
class Template {
    // ##                   #  ###          #          ###          #          ###                     ##           #
    //  #                   #  #  #         #           #           #           #                       #           #
    //  #     ##    ###   ###  #  #   ###  ###    ###   #    ###   ###    ##    #     ##   # #   ###    #     ###  ###    ##
    //  #    #  #  #  #  #  #  #  #  #  #   #    #  #   #    #  #   #    #  #   #    # ##  ####  #  #   #    #  #   #    # ##
    //  #    #  #  # ##  #  #  #  #  # ##   #    # ##   #    #  #   #    #  #   #    ##    #  #  #  #   #    # ##   #    ##
    // ###    ##    # #   ###  ###    # #    ##   # #  ###   #  #    ##   ##    #     ##   #  #  ###   ###    # #    ##   ##
    //                                                                                           #
    /**
     * Loads data from an API into an element.
     * @param {string} api The API to load data from.
     * @param {string} querySelector The query selector to fill the data into.
     * @param {function} template The template function.
     * @returns {Promise} A promise that resolves when the data has been loaded.
     */
    static loadDataIntoTemplate(api, querySelector, template) {
        var el = document.querySelector(querySelector);

        el.innerHTML = "<div class=\"loading\">Loading...</div>";

        return fetch(api).then((res) => res.json()).then((data) => {
            el.innerHTML = "";

            if (Array.isArray(data)) {
                data.forEach((item) => {
                    el.insertAdjacentHTML("beforeend", template(item));
                });
            } else {
                el.innerHTML = template(data);
            }
        });
    }
}

if (typeof module === "undefined") {
    window.Template = Template;
} else {
    module.exports = Template; // eslint-disable-line no-undef
}
