const Db = require("node-database"),
    db = require("./index"),
    FtsQuery = require("full-text-search-query"),
    ftsQuery = new FtsQuery(true);

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
     * @param {object} saveData The data to save.
     * @returns {Promise<number>} A promise that resolves when the completed game is added.
     */
    static async add(ip, saveData) {
        /**
         * @type {{recordsets: [{CompletedId: number}[]]}}
         */
        const data = await db.query(/* sql */`
            INSERT INTO tblCompleted (IPAddress, Data) VALUES (@ip, @data)

            SELECT SCOPE_IDENTITY() CompletedId
        `, {
            ip: {type: Db.VARCHAR(15), value: ip},
            data: {type: Db.NTEXT, value: JSON.stringify(saveData)}
        });

        return data && data.recordsets && data.recordsets[0] && data.recordsets[0][0] && data.recordsets[0][0].CompletedId || void 0;
    }

    //              #     ##   ##    ##    ###      #
    //              #    #  #   #     #     #       #
    //  ###   ##   ###   #  #   #     #     #     ###   ###
    // #  #  # ##   #    ####   #     #     #    #  #  ##
    //  ##   ##     #    #  #   #     #     #    #  #    ##
    // #      ##     ##  #  #  ###   ###   ###    ###  ###
    //  ###
    /**
     * Gets all IDs for completed games.
     * @returns {Promise<number[]>} A promise that resolves with the list of completed IDs.
     */
    static async getAllIds() {
        /**
         * @type {{recordsets: [{CompletedId: number}[]]}}
         */
        const data = await db.query(/* sql */`
            SELECT CompletedId FROM tblCompleted ORDER BY CompletedId
        `);
        return data && data.recordsets && data.recordsets[0] && data.recordsets[0].map((row) => row.CompletedId) || [];
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

    //              #    #      #            #
    //              #    #                   #
    //  ###   ##   ###   #     ##     ###   ###
    // #  #  # ##   #    #      #    ##      #
    //  ##   ##     #    #      #      ##    #
    // #      ##     ##  ####  ###   ###      ##
    //  ###
    /**
     * Gets the paginated list of games.
     * @param {number} page The page number.
     * @param {number} pageSize The size of the page.
     * @returns {Promise<{games: {id: number, ip: string, data: object, date: Date}[], count: number}>} A promise that resolves with the recent games.
     */
    static async getList(page, pageSize) {
        /**
         * @type {{recordsets: [{CompletedId: number, IPAddress: string, Data: string, CrDate: Date}[], {Games: number}[]]}}
         */
        const data = await db.query(/* sql */`
            WITH g AS (
                SELECT ROW_NUMBER() OVER (ORDER BY CompletedId DESC) RowNum, CompletedId, IPAddress, Data, CrDate
                FROM tblCompleted
            )
            SELECT CompletedId, IPAddress, Data, CrDate
            FROM g
            WHERE RowNum BETWEEN (@page - 1) * @pageSize + 1 AND @page * @pageSize
            ORDER BY CompletedId DESC

            SELECT COUNT(CompletedId) Games FROM tblCompleted
        `, {
            page: {type: Db.INT, value: page},
            pageSize: {type: Db.INT, value: pageSize}
        });
        return data && data.recordsets && data.recordsets.length === 2 && {
            games: data.recordsets[0].map((row) => ({
                id: row.CompletedId,
                ip: row.IPAddress,
                data: row.Data,
                date: row.CrDate
            })),
            count: data.recordsets[1][0].Games
        } || {games: [], count: 0};
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

    //                                #
    //                                #
    //  ###    ##    ###  ###    ##   ###
    // ##     # ##  #  #  #  #  #     #  #
    //   ##   ##    # ##  #     #     #  #
    // ###     ##    # #  #      ##   #  #
    /**
     * Gets the paginated list of games by user search.
     * @param {string} query The query.
     * @param {number} page The page number.
     * @param {number} pageSize The size of the page.
     * @returns {Promise<{games: {id: number, ip: string, data: object, date: Date}[], count: number}>} A promise that resolves with the recent games.
     */
    static async search(query, page, pageSize) {
        /**
         * @type {{recordsets: [{CompletedId: number, IPAddress: string, Data: string, CrDate: Date}[], {Games: number}[]]}}
         */
        const data = await db.query(/* sql */`
            WITH g AS (
                SELECT ROW_NUMBER() OVER (ORDER BY CompletedId DESC) RowNum, CompletedId, IPAddress, Data, CrDate
                FROM tblCompleted
                WHERE CONTAINS(tblCompleted.Data, @query)
            )
            SELECT CompletedId, IPAddress, Data, CrDate
            FROM g
            WHERE RowNum BETWEEN (@page - 1) * @pageSize + 1 AND @page * @pageSize
            ORDER BY CompletedId DESC

            SELECT COUNT(CompletedId) Games FROM tblCompleted WHERE CONTAINS(tblCompleted.Data, @query)
        `, {
            query: {type: Db.VARCHAR(8000), value: ftsQuery.transform(query)}
            page: {type: Db.INT, value: page},
            pageSize: {type: Db.INT, value: pageSize}
        });
        return data && data.recordsets && data.recordsets.length === 2 && {
            games: data.recordsets[0].map((row) => ({
                id: row.CompletedId,
                ip: row.IPAddress,
                data: row.Data,
                date: row.CrDate
            })),
            count: data.recordsets[1][0].Games
        } || {games: [], count: 0};
    }

    //                #         #
    //                #         #
    // #  #  ###    ###   ###  ###    ##
    // #  #  #  #  #  #  #  #   #    # ##
    // #  #  #  #  #  #  # ##   #    ##
    //  ###  ###    ###   # #    ##   ##
    //       #
    /**
     * Updates a completed game.
     * @param {number} id The completed ID.
     * @param {object} data The data to save.
     * @param {Date} start The start date of the match.
     * @returns {Promise} A promise that resolves when the update is complete.
     */
    static async update(id, data, start) {
        await db.query(/* sql */`
            UPDATE tblCompleted SET Data = @data, CrDate = CASE WHEN @start IS NULL THEN CrDate ELSE @start END WHERE CompletedId = @id
        `, {
            id: {type: Db.INT, value: id},
            data: {type: Db.NTEXT, value: JSON.stringify(data)},
            start: {type: Db.DATETIME, value: start}
        });
    }
}

module.exports = CompletedDb;
