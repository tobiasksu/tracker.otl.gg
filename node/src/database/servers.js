/**
 * @typedef {import("../../types/node/serverTypes").LocalServer} ServerTypes.LocalServer
 */

const Db = require(".");

//   ###                                             ####   #
//  #   #                                             #  #  #
//  #       ###   # ##   #   #   ###   # ##    ###    #  #  # ##
//   ###   #   #  ##  #  #   #  #   #  ##  #  #       #  #  ##  #
//      #  #####  #       # #   #####  #       ###    #  #  #   #
//  #   #  #      #       # #   #      #          #   #  #  ##  #
//   ###    ###   #        #     ###   #      ####   ####   # ##
/**
 * A class that handles calls to the database for servers.
 */
class ServersDb {
    //              #    ###         ###
    //              #    #  #         #
    //  ###   ##   ###   ###   #  #   #    ###
    // #  #  # ##   #    #  #  #  #   #    #  #
    //  ##   ##     #    #  #   # #   #    #  #
    // #      ##     ##  ###     #   ###   ###
    //  ###                     #          #
    /**
     * Gets a server by its IP address.
     * @param {string} ip The IP Address.
     * @returns {Promise<ServerTypes.LocalServer>} The server data.
     */
    static async getByIp(ip) {
        const db = await Db.get();

        const server = await db.collection("server").findOne({ipAddress: ip});

        if (!server) {
            return void 0;
        }

        return {
            ip: server.ipAddress,
            keepListed: server.data.keepListed,
            name: server.data.name,
            notes: server.data.notes,
            version: server.data.version,
            lastSeen: server.data.lastSeen
        };
    }

    //              #    #  #   #            #    #     ##
    //              #    #  #                     #      #
    //  ###   ##   ###   #  #  ##     ###   ##    ###    #     ##
    // #  #  # ##   #    #  #   #    ##      #    #  #   #    # ##
    //  ##   ##     #     ##    #      ##    #    #  #   #    ##
    // #      ##     ##   ##   ###   ###    ###   ###   ###    ##
    //  ###
    /**
     * Gets the list of visible servers.
     * @returns {Promise<ServerTypes.LocalServer[]>} A promise that resolves with the list of servers.
     */
    static async getVisible() {
        const db = await Db.get();

        const servers = await db.collection("server").find({visible: true}, {sort: {name: 1}}).toArray();

        if (!servers) {
            return [];
        }

        return servers.map((server) => ({
            ip: server.ipAddress,
            keepListed: server.data.keepListed,
            name: server.data.name,
            notes: server.data.notes,
            version: server.data.version,
            lastSeen: server.data.lastSeen
        }));
    }

    //                #         #
    //                #         #
    // #  #  ###    ###   ###  ###    ##
    // #  #  #  #  #  #  #  #   #    # ##
    // #  #  #  #  #  #  # ##   #    ##
    //  ###  ###    ###   # #    ##   ##
    //       #
    /**
     * Updates a server.
     * @param {ServerTypes.LocalServer} server The server to update.
     * @param {boolean} [visible] Whether the server should be visible.
     * @returns {Promise} A promise that resolves when the server has been updated.
     */
    static async update(server, visible) {
        const db = await Db.get();

        await db.collection("server").findOneAndUpdate({ipAddress: server.ip}, {$set: {
            visible,
            data: {
                ip: server.ip,
                keepListed: server.keepListed,
                name: server.name,
                notes: server.notes,
                version: server.version,
                lastSeen: server.lastSeen
            }
        }}, {upsert: true});
    }
}

module.exports = ServersDb;
