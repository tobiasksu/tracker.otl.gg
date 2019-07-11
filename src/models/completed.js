const Db = require("../database/completed");

//   ###                         ##            #                #
//  #   #                         #            #                #
//  #       ###   ## #   # ##     #     ###   ####    ###    ## #
//  #      #   #  # # #  ##  #    #    #   #   #     #   #  #  ##
//  #      #   #  # # #  ##  #    #    #####   #     #####  #   #
//  #   #  #   #  # # #  # ##     #    #       #  #  #      #  ##
//   ###    ###   #   #  #       ###    ###     ##    ###    ## #
//                       #
//                       #
/**
 * A class that represents a completed match.
 */
class Completed {
    //          #     #
    //          #     #
    //  ###   ###   ###
    // #  #  #  #  #  #
    // # ##  #  #  #  #
    //  # #   ###   ###
    /**
     * Adds a completed game to a server.
     * @param {string} ip The IP address of the server to update.
     * @param {object} data The data with the stat to add.
     * @returns {Promise} A promise that resolves when the stat has been added.
     */
    static async add(ip, data) {
        if (data.name === "Stats") {
            switch (data.type) {
                case "EndGame":
                    await Db.add(ip, data);
                    break;
            }
        }
    }
}

module.exports = Completed;
