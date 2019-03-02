const HtmlMinifier = require("html-minifier"),

    Common = require("../includes/common"),

    settings = require("../../settings");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//    #    #                     #
//   # #   #                     #
//  #   #  # ##    ###   #   #  ####
//  #   #  ##  #  #   #  #   #   #
//  #####  #   #  #   #  #   #   #
//  #   #  ##  #  #   #  #  ##   #  #
//  #   #  # ##    ###    ## #    ##
/**
 * A class that represents the about page.
 */
class About {
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
            <h2>About this website</h2>
            <div class="section">
                <div class="header">What is the Overload Server Browser?</div>
                <div>
                    This website, the Overload Server Browser, shows the most recent servers available that are running olproxy.
                </div>
            </div>
            <div class="section">
                <div class="header">I run an Overload game server.  How do I get listed on the browser?</div>
                <div>
                    You must download or build olproxy on the same server as your game server, and run it alongside Overload.  Further to this, you must edit the appsettings.json file so that olproxy knows to list your sever on this site.  See the <a href="/download">Download</a> page for more information.
                </div>
            </div>
            <h2>About olproxy</h2>
            <div class="section">
                <div class="header">What is olproxy?</div>
                <div>
                    olproxy is a piece of software written by Arne de Bruijn that allows you to play <a href="https://playoverload.com">Overload</a> games over the Internet on game servers running outside of Revival's AWS network.  Simply run olproxy alongside Overload, and you will be able to create and join games on any game server that's also running olproxy by using its IP address as the game's password.
                </div>
            </div>
            <div class="section">
                <div class="header">Why is this needed?</div>
                <div>
                    Overload's multiplayer was released unfinished and did not include the means to play games over the Internet that were not done on Revival's servers.  olproxy takes advantage of the way the game's matchmaking architecture works to fill in this gap, allowing for custom games over the Internet with little setup required.
                </div>
            </div>
            <div class="section">
                <div class="header">What, exactly, does olproxy do?</div>
                <div>
                    Normally, when Overload looks for a server on LAN, it will send a broadcast over any local network interfaces to find a game server.  olproxy stands in for such a game server and redirects that request and all other requests to the IP address specified in the game password.  The game server, which must also run olproxy, receives any requests from clients and rebroadcasts them to the game server.  olproxy will also broadcast out any requests from the game server to all of the clients that have connected to it within the current game session.
                </div>
            </div>
            <div class="section">
                <div class="header">Where can I find out more about olproxy?</div>
                <div>
                    olproxy is open source software, and is available on Github at <a href="https://github.com/arbruijn/olproxy" target="_blank">https://github.com/arbruijn/olproxy</a>.
                </div>
            </div>
        `, req);

        res.status(200).send(HtmlMinifier.minify(html, settings.HtmlMinifier));
    }
}

About.route = {
    path: "/about"
};

module.exports = About;
