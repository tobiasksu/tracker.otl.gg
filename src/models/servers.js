const Db = require("../database/servers"),
    Websocket = require("../websocket");

//   ###
//  #   #
//  #       ###   # ##   #   #   ###   # ##    ###
//   ###   #   #  ##  #  #   #  #   #  ##  #  #
//      #  #####  #       # #   #####  #       ###
//  #   #  #      #       # #   #      #          #
//   ###    ###   #        #     ###   #      ####
/**
 * A class that represents the servers currently online.
 */
class Servers {
    //              #    #  #   #            #    #     ##
    //              #    #  #                     #      #
    //  ###   ##   ###   #  #  ##     ###   ##    ###    #     ##
    // #  #  # ##   #    #  #   #    ##      #    #  #   #    # ##
    //  ##   ##     #     ##    #      ##    #    #  #   #    ##
    // #      ##     ##   ##   ###   ###    ###   ###   ###    ##
    //  ###
    /**
     * Gets the list of visible servers.
     * @returns {Promise<object[]>} A promise that resolves with the servers.
     */
    static async getVisible() {
        const servers = await Db.getVisible(),
            now = new Date();

        servers.forEach((server) => {
            server.old = now.getTime() - new Date(server.lastSeen).getTime() > 60 * 60 * 1000;
        });

        return servers.filter((s) => s.keepListed && new Date().getTime() - new Date(s.lastSeen).getTime() < 30 * 24 * 60 * 60 * 1000 || new Date().getTime() - new Date(s.lastSeen).getTime() < 60 * 60 * 1000);
    }

    //                #         #
    //                #         #
    // #  #  ###    ###   ###  ###    ##
    // #  #  #  #  #  #  #  #   #    # ##
    // #  #  #  #  #  #  # ##   #    ##
    //  ###  ###    ###   # #    ##   ##
    //       #
    /**
     * Updates the data for a server.
     * @param {string} ip The IP address of the server to update.
     * @param {object} data The data to update the server with.
     * @param {boolean} [visible] Whether the server should be visible.
     * @returns {Promise} A promise that resolves when the server has been updated.
     */
    static async update(ip, data, visible) {
        let server = await Db.getByIp(ip);

        if (!server.ip) {
            server = {ip};
        }

        Object.keys(data).forEach((key) => {
            if (data[key]) {
                if (key === "gameStarted") {
                    server[key] = new Date();
                } else {
                    server[key] = data[key];
                }
            }
        });

        server.lastSeen = new Date();

        Websocket.broadcast({
            ip,
            data: {
                name: "Server",
                server: visible ? server : void 0,
                visible
            }
        });

        await Db.update(server, visible);
    }
}

module.exports = Servers;
