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

    //              #    ###         ###      #
    //              #    #  #         #       #
    //  ###   ##   ###   ###   #  #   #     ###
    // #  #  # ##   #    #  #  #  #   #    #  #
    //  ##   ##     #    #  #   # #   #    #  #
    // #      ##     ##  ###     #   ###    ###
    //  ###                     #
    /**
     * Gets a completed game by ID.
     * @param {number} id The Game ID.
     * @returns {Promise<{id: number, ip: string, data: object, date: Date}>} A promise that resolves with the game.
     */
    static async getById(id) {
        /**
         * @type {{recordsets: [{CompletedId: number, IPAddress: string, Data: string, CrDate: Date}[]]}}
         */
        const data = await db.query(/* sql */`
            SELECT CompletedId, IPAddress, Data, CrDate FROM tblCompleted WHERE CompletedId = @id
        `, {id: {type: Db.INT, value: id}});
        return data && data.recordsets && data.recordsets[0] && data.recordsets[0][0] && {
            id: data.recordsets[0][0].CompletedId,
            ip: data.recordsets[0][0].IPAddress,
            data: data.recordsets[0][0].Data,
            date: data.recordsets[0][0].CrDate
        } || void 0;
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
     * @returns {Promise<{id: number, ip: string, data: object, date: Date}[]>} A promise that resolves with the recent games.
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
