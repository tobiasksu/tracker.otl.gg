/**
 * @typedef {import("express").Express} Express
 */

const http = require("http"),
    Ws = require("ws"),
    Wss = Ws.Server,

    gameMatch = /\/game\/(?<ip>.*)/;

/**
 * @type {Ws.Server}
 */
let wss;

//  #   #         #                           #              #
//  #   #         #                           #              #
//  #   #   ###   # ##    ###    ###    ###   #   #   ###   ####
//  # # #  #   #  ##  #  #      #   #  #   #  #  #   #   #   #
//  # # #  #####  #   #   ###   #   #  #      ###    #####   #
//  ## ##  #      ##  #      #  #   #  #   #  #  #   #       #  #
//  #   #   ###   # ##   ####    ###    ###   #   #   ###     ##
/**
 * A class used for communication via websockets.
 */
class Websocket {
    // #                          #                      #
    // #                          #                      #
    // ###   ###    ##    ###   ###   ##    ###   ###   ###
    // #  #  #  #  #  #  #  #  #  #  #     #  #  ##      #
    // #  #  #     #  #  # ##  #  #  #     # ##    ##    #
    // ###   #      ##    # #   ###   ##    # #  ###      ##
    /**
     * Broadcasts a message to qualifying connected websocket clients.
     * @param {object} message The message to send.
     * @returns {void}
     */
    static broadcast(message) {
        message = JSON.stringify(message);

        wss.clients.forEach((client) => {
            if (client.url === "/") {
                client.send(message);
            } else if (gameMatch.test(client.url)) {
                const {groups: {ip}} = gameMatch.exec(client.url);

                if (message.ip === ip) {
                    client.send(message);
                }
            }
        });
    }

    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###
    // ##      #    #  #  #  #   #
    //   ##    #    # ##  #      #
    // ###      ##   # #  #       ##
    /**
     * Starts up the web server and websockets.
     * @returns {http.Server} The server.
     */
    static start() {
        const server = http.createServer();

        wss = new Wss({server});

        return server;
    }
}

module.exports = Websocket;
