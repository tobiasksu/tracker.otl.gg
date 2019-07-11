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
}

module.exports = CompletedDb;
