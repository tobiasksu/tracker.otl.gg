const servers = {};

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
     * @returns {object} The servers.
     */
    static get servers() {
        return servers;
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
     * @returns {void}
     */
    static update(ip, data) {
        if (!servers[ip]) {
            servers[ip] = {
                firstSeen: new Date()
            };
        }

        if (servers[ip].lastSeen && new Date().getTime() - servers[ip].lastSeen.getTime() > 30 * 60 * 1000) {
            servers[ip].firstSeen = new Date();
        }

        Object.keys(data).forEach((key) => {
            if (data[key]) {
                servers[ip][key] = data[key];
            }
        });

        servers[ip].lastSeen = new Date();
    }
}

module.exports = Servers;
