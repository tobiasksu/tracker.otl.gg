//  #   #         #       ###                 #              #      ###    ##      #                   #
//  #   #         #      #   #                #              #     #   #    #                          #
//  #   #   ###   # ##   #       ###    ###   #   #   ###   ####   #        #     ##     ###   # ##   ####
//  # # #  #   #  ##  #   ###   #   #  #   #  #  #   #   #   #     #        #      #    #   #  ##  #   #
//  # # #  #####  #   #      #  #   #  #      ###    #####   #     #        #      #    #####  #   #   #
//  ## ##  #      ##  #  #   #  #   #  #   #  #  #   #       #  #  #   #    #      #    #      #   #   #  #
//  #   #   ###   # ##    ###    ###    ###   #   #   ###     ##    ###    ###    ###    ###   #   #    ##
/**
 * A wrapper around WebSocket to handle gracefully reconnecting.
 */
class WebSocketClient {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * Initializes the client.
     * @param {string} url The URL to open.
     * @param {number} [autoReconnectInterval] The amount of time in milliseconds to wait between connection attempts.
     */
    constructor(url, autoReconnectInterval) {
        this.url = url;
        this.autoReconnectInterval = autoReconnectInterval === void 0 ? 5000 : autoReconnectInterval;

        /** @type {function} */
        this.onmessage = null;

        /** @type {NodeJS.Timer} */
        this.interval = null;
    }

    //  ##   ###    ##   ###
    // #  #  #  #  # ##  #  #
    // #  #  #  #  ##    #  #
    //  ##   ###    ##   #  #
    //       #
    /**
     * Opens the websocket.
     * @returns {void}
     */
    open() {
        const wsc = this;

        // Create socket.
        this.instance = new WebSocket(this.url);

        this.instance.onmessage = (ev) => {
            if (this.onmessage) {
                this.onmessage(ev);
            }
        };

        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => {
            wsc.instance.send(WebSocketClient.pingFrame);
        }, 55000);

        // Try to reconnect if it wasn't a normal closure.
        this.instance.onclose = (ev) => {
            switch (ev.code) {
                case 1000: // Normal closure.
                    break;
                default: // Abnormal closure.
                    // Clean up old instance.
                    try {
                        wsc.instance.close();
                    } catch {}
                    wsc.instance = null;

                    // Reconnect with a new instance.
                    setTimeout(() => {
                        wsc.open();
                    }, wsc.autoReconnectInterval);

                    break;
            }
        };
    }
}

WebSocketClient.pingFrame = new ArrayBuffer(1);
WebSocketClient.pingFrame[0] = 0x9;

if (typeof module === "undefined") {
    window.WebSocketClient = WebSocketClient;
} else {
    module.exports = WebSocketClient; // eslint-disable-line no-undef
}
