/**
 * @typedef {import("../../types/serverTypes").LocalServer} ServerTypes.LocalServer
 */

const Db = require("@roncli/node-database"),
    db = require("./index");

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

        /**
         * @type {{recordsets: [{Data: string}[]]}}
         */
        const data = await db.query(/* sql */`
            SELECT Data FROM tblServers
            WHERE IPAddress = @ip
        `, {ip: {type: Db.VARCHAR(15), value: ip}});
        return data && data.recordsets && data.recordsets[0] && data.recordsets[0][0] && JSON.parse(data.recordsets[0][0].Data) || {};
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

        /**
         * @type {{recordsets: [{Data: string}[]]}}
         */
        const data = await db.query(/* sql */`
            SELECT Data FROM tblServers
            WHERE Visible = 1
        `);
        return data && data.recordsets && data.recordsets[0] && data.recordsets[0].map((row) => {
            try {
                return JSON.parse(row.Data);
            } catch (err) {
                throw new Error(`Invalid JSON:\n${row.Data}`);
            }
        }) || [];
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
        await db.query(/* sql */`
            MERGE tblServers s
                USING (VALUES (@ip, @data, @visible)) AS v (IPAddress, Data, Visible)
                ON s.IPAddress = v.IPAddress
            WHEN MATCHED THEN
                UPDATE SET Data = v.Data, Visible = CASE WHEN v.Visible IS NULL THEN s.Visible ELSE v.Visible END
            WHEN NOT MATCHED THEN
                INSERT (IPAddress, Visible, Data) VALUES (v.IPAddress, 1, v.Data);
        `, {
            ip: {type: Db.VARCHAR(15), value: server.ip},
            data: {type: Db.TEXT, value: JSON.stringify(server)},
            visible: {type: Db.BIT, value: visible}
        });
    }
}

module.exports = ServersDb;
