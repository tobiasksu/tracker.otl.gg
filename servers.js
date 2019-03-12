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

        if (!server) {
            server = {ip};
        }

        Object.keys(data).forEach((key) => {
            if (data[key]) {
                server[key] = data[key];
            }
        });

        server.lastSeen = new Date();

        await Db.updateServer(server, visible);
    }
}

module.exports = Servers;
