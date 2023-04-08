/**
 * @typedef {import("ws")} WebSocket
 */

const RouterBase = require("hot-router").RouterBase,
    WS = require("../../src/websocket");

//  #   #
//  #   #
//  #   #   ###   ## #    ###
//  #####  #   #  # # #  #   #
//  #   #  #   #  # # #  #####
//  #   #  #   #  # # #  #
//  #   #   ###   #   #   ###
/**
 * A websocket to handle connections to the home page.
 */
class Home extends RouterBase {
    //                    #
    //                    #
    // ###    ##   #  #  ###    ##
    // #  #  #  #  #  #   #    # ##
    // #     #  #  #  #   #    ##
    // #      ##    ###    ##   ##
    /**
     * Retrieves the route parameters for the class.
     * @returns {RouterBase.Route} The route parameters.
     */
    static get route() {
        const route = {...super.route};

        route.path = "/";
        route.webSocket = true;

        return route;
    }

    //       ##
    //        #
    //  ##    #     ##    ###    ##
    // #      #    #  #  ##     # ##
    // #      #    #  #    ##   ##
    //  ##   ###    ##   ###     ##
    /**
     * Close the websocket.
     * @param {WebSocket} ws The websocket.
     * @returns {void}
     */
    static close(ws) {
        WS.unregister(ws);
    }

    //  #           #     #
    //                    #
    // ##    ###   ##    ###
    //  #    #  #   #     #
    //  #    #  #   #     #
    // ###   #  #  ###     ##
    /**
     * Initializes the websocket.
     * @param {WebSocket} ws The websocket.
     * @returns {void}
     */
    static init(ws) {
        WS.register(ws);
    }
}

module.exports = Home;
