const Db = require("node-database"),

    settings = require("./settings"),

    db = new Db(settings.database);

//  ####           #            #
//   #  #          #            #
//   #  #   ###   ####    ###   # ##    ###    ###    ###
//   #  #      #   #         #  ##  #      #  #      #   #
//   #  #   ####   #      ####  #   #   ####   ###   #####
//   #  #  #   #   #  #  #   #  ##  #  #   #      #  #
//  ####    ####    ##    ####  # ##    ####  ####    ###
/**
* Defines the database class.
*/
class Database {
    //              #     ##                                 ###         ###
    //              #    #  #                                #  #         #
    //  ###   ##   ###    #     ##   ###   # #    ##   ###   ###   #  #   #    ###
    // #  #  # ##   #      #   # ##  #  #  # #   # ##  #  #  #  #  #  #   #    #  #
    //  ##   ##     #    #  #  ##    #     # #   ##    #     #  #   # #   #    #  #
    // #      ##     ##   ##    ##   #      #     ##   #     ###     #   ###   ###
    //  ###                                                         #          #
    /**
     * Gets a server by its IP address.
     * @param {string} ip The IP Address.
     * @returns {Promise<object>} The server data.
     */
    static async getServerByIp(ip) {

        /**
         * @type {{recordsets: [{Data: string}[]]}}
         */
        const data = await db.query(/* sql */`
            SELECT Data FROM tblServers
            WHERE IP = @ip
        `, {ip: {type: Db.VARCHAR(15), value: ip}});
        return data && data.recordsets && data.recordsets[0] && data.recordsets[0][0] && JSON.parse(data.recordsets[0][0].Data) || {};
    }

    //              #     ##
    //              #    #  #
    //  ###   ##   ###    #     ##   ###   # #    ##   ###    ###
    // #  #  # ##   #      #   # ##  #  #  # #   # ##  #  #  ##
    //  ##   ##     #    #  #  ##    #     # #   ##    #       ##
    // #      ##     ##   ##    ##   #      #     ##   #     ###
    //  ###
    /**
     * Gets the list of visible servers.
     * @returns {Promise<object[]>} A promise that resolves with the list of servers.
     */
    static async getServers() {

        /**
         * @type {{recordsets: [{Data: string}[]]}}
         */
        const data = await db.query(/* sql */`
            SELECT Data FROM tblServers
            WHERE Visible = 1
        `);
        return data && data.recordsets && data.recordsets[0] && data.recordsets[0].map((row) => JSON.parse(row.Data)) || [];
    }

    //                #         #           ##
    //                #         #          #  #
    // #  #  ###    ###   ###  ###    ##    #     ##   ###   # #    ##   ###
    // #  #  #  #  #  #  #  #   #    # ##    #   # ##  #  #  # #   # ##  #  #
    // #  #  #  #  #  #  # ##   #    ##    #  #  ##    #     # #   ##    #
    //  ###  ###    ###   # #    ##   ##    ##    ##   #      #     ##   #
    //       #
    /**
     * Updates a server.
     * @param {object} server The server to update.
     * @returns {Promise} A promise that resolves when the server has been updated.
     */
    static async updateServer(server) {
        await db.query(/* sql */`
            MERGE tblServers s
                USING (VALUES (@ip, @data)) AS v (IPAddress, Data)
                ON s.IPAddress = v.IPAddress
            WHEN MATCHED THEN
                UPDATE SET Data = v.Data
            WHEN NOT MATCHED THEN
                INSERT (IPAddress, Visible, Data) VALUES (v.IPAddress, 1, v.Data);
        `, {
            ip: {type: Db.VARCHAR(15), value: server.ip},
            data: {type: Db.TEXT, value: JSON.stringify(server)}
        });
    }
}

module.exports = Database;
