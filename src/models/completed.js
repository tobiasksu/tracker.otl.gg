/**
 * @typedef {{id: number, ip: string, data: object, date: Date, remaining?: number, server?: object}} CompletedGame
 */

const Db = require("../database/completed"),
    ServersDb = require("../database/servers");

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
 * A class that represents completed games.
 */
class Completed {
    //              #    ###                            #
    //              #    #  #                           #
    //  ###   ##   ###   #  #   ##    ##    ##   ###   ###
    // #  #  # ##   #    ###   # ##  #     # ##  #  #   #
    //  ##   ##     #    # #   ##    #     ##    #  #   #
    // #      ##     ##  #  #   ##    ##    ##   #  #    ##
    //  ###
    /**
     * Gets the games that completed within the past hour.
     * @returns {Promise<CompletedGame[]>} The recent games.
     */
    static async getRecent() {
        /**
         * @type {CompletedGame[]}
         */
        const games = await Db.getRecent();

        for (const game of games) {
            game.remaining = 3600000 + game.date.getTime() + new Date().getTime();
            game.data = JSON.parse(game.data);
            game.server = await ServersDb.getByIp(game.ip);
        }

        return games.filter((g) => g.data && g.data.events && g.data.events.length && g.data.events.length > 0);
    }
}

module.exports = Completed;
