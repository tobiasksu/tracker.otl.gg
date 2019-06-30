const Db = require("./database");

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
    //  ###    ##   ###   # #    ##   ###    ###
    // ##     # ##  #  #  # #   # ##  #  #  ##
    //   ##   ##    #     # #   ##    #       ##
    // ###     ##   #      #     ##   #     ###
    /**
     * Retrieves the servers.
     * @returns {Promise} A promise that resolves with the servers.
     */
    static get servers() {
        return Db.getServers();
    }

    //          #     #   ##    #           #
    //          #     #  #  #   #           #
    //  ###   ###   ###   #    ###    ###  ###
    // #  #  #  #  #  #    #    #    #  #   #
    // # ##  #  #  #  #  #  #   #    # ##   #
    //  # #   ###   ###   ##     ##   # #    ##
    /**
     * Adds a stat to a server.
     * @param {string} ip The IP address of the server to update.
     * @param {object} data The data with the stat to add.
     * @returns {Promise} A promise that resolves when the stat has been added.
     */
    static async addStat(ip, data) {
        if (data.name === "Stats") {
            switch (data.type) {
                case "EndGame":
                    await Db.addCompleted(ip, data);
                    break;
            }
        }
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
        let server = await Db.getServerByIp(ip);

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

        await Db.updateServer(server, visible);
    }
}

module.exports = Servers;
