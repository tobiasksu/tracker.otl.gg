const Db = require("node-database"),
    db = require("./index");

//   ###                         ##            #                #  ####   #
//  #   #                         #            #                #   #  #  #
//  #       ###   ## #   # ##     #     ###   ####    ###    ## #   #  #  # ##
//  #      #   #  # # #  ##  #    #    #   #   #     #   #  #  ##   #  #  ##  #
//  #      #   #  # # #  ##  #    #    #####   #     #####  #   #   #  #  #   #
//  #   #  #   #  # # #  # ##     #    #       #  #  #      #  ##   #  #  ##  #
//   ###    ###   #   #  #       ###    ###     ##    ###    ## #  ####   # ##
//                       #
//                       #
/**
 * A class that handles calls to the database for completed matches.
 */
class CompletedDb {
    //          #     #
    //          #     #
    //  ###   ###   ###
    // #  #  #  #  #  #
    // # ##  #  #  #  #
    //  # #   ###   ###
    /**
     * Adds a completed game to the database.
     * @param {string} ip The IP address.
     * @param {object} data The data to save.
     * @returns {Promise} A promise that resolves when the completed game is added.
     */
    static async add(ip, data) {
        await db.query(/* sql */`
            INSERT INTO tblCompleted (IPAddress, Data) VALUES (@ip, @data)
        `, {
            ip: {type: Db.VARCHAR(15), value: ip},
            data: {type: Db.TEXT, value: JSON.stringify(data)}
        });
    }

    //              #    ###                            #
    //              #    #  #                           #
    //  ###   ##   ###   #  #   ##    ##    ##   ###   ###
    // #  #  # ##   #    ###   # ##  #     # ##  #  #   #
    //  ##   ##     #    # #   ##    #     ##    #  #   #
    // #      ##     ##  #  #   ##    ##    ##   #  #    ##
    //  ###
    /**
     * Gets the games that completed within the past hour.
     * @returns {Promise<{id: number, ip: string, data: object, date: Date}[]>} The recent games.
     */
    static async getRecent() {
        /**
         * @type {{recordsets: [{CompletedId: number, IPAddress: string, Data: string, CrDate: Date}[]]}}
         */
        const data = await db.query(/* sql */`
            SELECT CompletedId, IPAddress, Data, CrDate FROM tblCompleted WHERE CrDate >= DATEADD(hour, -1, GETUTCDATE()) ORDER BY CrDate, CompletedId
        `);
        return data && data.recordsets && data.recordsets[0] && data.recordsets[0].map((row) => ({
            id: row.CompletedId,
            ip: row.IPAddress,
            data: row.Data,
            date: row.CrDate
        })) || [];
    }
}

module.exports = CompletedDb;
