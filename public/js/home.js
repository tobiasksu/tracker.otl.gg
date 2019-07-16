/* global timeago, WebSocketClient */

//  #   #
//  #   #
//  #   #   ###   ## #    ###
//  #####  #   #  # # #  #   #
//  #   #  #   #  # # #  #####
//  #   #  #   #  # # #  #
//  #   #   ###   #   #   ###
/**
 * A class that provides functions for the home page.
 */
class Home {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Makes sure all timeago fields are rendered and starts the websocket.
     * @returns {void}
     */
    static DOMContentLoaded() {
        timeago().render(document.querySelectorAll(".timeago"));

        Home.ws = new WebSocketClient();
        Home.ws.onmessage = Home.onmessage;
        Home.ws.open(window.location.protocol + "//" + window.location.host);
    }

    //  ##   ###   # #    ##    ###    ###    ###   ###   ##
    // #  #  #  #  ####  # ##  ##     ##     #  #  #  #  # ##
    // #  #  #  #  #  #  ##      ##     ##   # ##   ##   ##
    //  ##   #  #  #  #   ##   ###    ###     # #  #      ##
    //                                              ###
    /**
     * Handles incoming messages.
     * @param {string} message The data received.
     * @returns {void}
     */
    static onmessage(message) {
        const {ip, data} = JSON.parse(message);

        switch (data.type) {
            case "StartGame":
                Home.startGame(ip, data);
                break;
            case "Kill":
                Home.kill(ip, data);
                break;
            case "Goal":
                Home.goal(ip, data);
                break;
            case "Blunder":
                Home.blunder(ip, data);
                break;
            case "Connect":
                Home.connect(ip, data);
                break;
            case "Disconect":
                Home.disconnect(ip, data);
                break;
            case "EndGame":
                Home.endGame(ip, data);
                break;
        }
    }
}

document.addEventListener("DOMContentLoaded", Home.DOMContentLoaded);
