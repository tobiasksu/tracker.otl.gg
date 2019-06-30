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
    //          #     #   ##                     ##           #             #
    //          #     #  #  #                     #           #             #
    //  ###   ###   ###  #      ##   # #   ###    #     ##   ###    ##    ###
    // #  #  #  #  #  #  #     #  #  ####  #  #   #    # ##   #    # ##  #  #
    // # ##  #  #  #  #  #  #  #  #  #  #  #  #   #    ##     #    ##    #  #
    //  # #   ###   ###   ##    ##   #  #  ###   ###    ##     ##   ##    ###
    //                                     #
    /**
     * Adds a completed game to the database.
     * @param {string} ip The IP address.
     * @param {object} data The data to save.
     * @returns {Promise} A promise that resolves when the completed game is added.
     */
    static async addCompleted(ip, data) {
        await db.query(/* sql */`
            INSERT INTO tblCompleted (IPAddress, Data) VALUES (@ip, @data)
        `, {
            ip: {type: Db.VARCHAR(15), value: ip},
            data: {type: Db.TEXT, value: JSON.stringify(data)}
        });
    }

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
            WHERE IPAddress = @ip
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
     * @param {boolean} [visible] Whether the server should be visible.
     * @returns {Promise} A promise that resolves when the server has been updated.
     */
    static async updateServer(server, visible) {
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

module.exports = Database;
