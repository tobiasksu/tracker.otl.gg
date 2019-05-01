const HtmlMinifier = require("html-minifier"),

    Common = require("../includes/common"),

    settings = require("../../settings");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//  #        #           #
//  #                    #
//  #       ##    # ##   #   #   ###
//  #        #    ##  #  #  #   #
//  #        #    #   #  ###     ###
//  #        #    #   #  #  #       #
//  #####   ###   #   #  #   #  ####
/**
 * A class that represents the links page.
 */
class Links {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Processes the request.
     * @param {express.Request} req The request.
     * @param {express.Response} res The response.
     * @returns {void} A promise that resolves when the request is complete.
     */
    static get(req, res) {
        const html = Common.page("", /* html */`
            <h2>Links</h2>
            <div class="section">
                <div class="header">Buy Overload</div>
                <div>On Steam: <a target="_blank" href="https://store.steampowered.com/app/448850/Overload/">https://store.steampowered.com/app/448850/Overload/</a></div>
                <div>On GoG: <a target="_blank" href="https://www.gog.com/game/overload">https://www.gog.com/game/overload</a></div>
                <div>On Playstation 4: <a target="_blank" href="https://www.playstation.com/en-us/games/overload-ps4/">https://www.playstation.com/en-us/games/overload-ps4/</a></div>
                <div>On XBox One: <a target="_blank" href="https://www.microsoft.com/en-us/p/overload/bvcfs7l1x3th">https://www.microsoft.com/en-us/p/overload/bvcfs7l1x3th</a></div>
            </div>
            <div class="section">
                <div class="header">Official Sites</div>
                <div>Overload Home Page: <a target="_blank" href="https://playoverload.com/">https://playoverload.com/</a></div>
                <div>Overload Wiki: <a target="_blank" href="https://overload.gamepedia.com/Overload_Wiki">https://overload.gamepedia.com/Overload_Wiki</a></div>
                <div>Revival Productions: <a target="_blank" href="https://www.revivalprod.com/">https://www.revivalprod.com/</a></div>
                <div>Overload on Twitter: <a target="_blank" href="https://twitter.com/playoverload">https://twitter.com/playoverload</a></div>
                <div>Overload on Facebook: <a target="_blank" href="https://www.facebook.com/playoverload/">https://www.facebook.com/playoverload/</a></div>
                <div>Revival Productions on Twitch: <a target="_blank" href="https://www.twitch.tv/revivalproductions">https://www.twitch.tv/revivalproductions</a></div>
                <div>Overload Kickstarter: <a target="_blank" href="https://www.kickstarter.com/projects/revivalprod/overload-the-ultimate-six-degree-of-freedom-shoote">https://www.kickstarter.com/projects/revivalprod/overload-the-ultimate-six-degree-of-freedom-shoote</a></div>
            </div>
            <div class="section">
                <div class="header">Fan Sites</div>
                <div>Overload Development Community: <a href="https://github.com/overload-development-community" target="_blank">https://github.com/overload-development-community</a></div>
                <div>Overload Maps: <a target="_blank" href="https://overloadmaps.com/">https://overloadmaps.com/</a></div>
                <div>Overlaod Teams League: <a target="_blank" href="https://otl.gg/">https://otl.gg/</a></div>
            </div>
        `, req);

        res.status(200).send(HtmlMinifier.minify(html, settings.HtmlMinifier));
    }
}

Links.route = {
    path: "/links"
};

module.exports = Links;
