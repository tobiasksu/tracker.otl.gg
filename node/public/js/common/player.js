/**
 * @typedef {import("../../../types/playerTypes").PlayerData} PlayerTypes.PlayerData
 */

//  ####    ##
//  #   #    #
//  #   #    #     ###   #   #   ###   # ##
//  ####     #        #  #   #  #   #  ##  #
//  #        #     ####  #  ##  #####  #
//  #        #    #   #   ## #  #      #
//  #       ###    ####      #   ###   #
//                       #   #
//                        ###
/**
 * A class that represents a player.
 */
class Player {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * Creates a new player from the data provided.
     * @param {PlayerTypes.PlayerData} data The data to create the player with.
     */
    constructor(data) {
        this.name = data.name;
        this.team = data.team;
        this.kills = data.kills;
        this.assists = data.assists;
        this.deaths = data.deaths;
        this.goals = data.goals;
        this.goalAssists = data.goalAssists;
        this.blunders = data.blunders;
        this.returns = data.returns;
        this.pickups = data.pickups;
        this.captures = data.captures;
        this.carrierKills = data.carrierKills;
        this.connected = data.connected;
        this.disconnected = data.disconnected || false;
        this.timeInGame = data.timeInGame;
    }
}

if (typeof module === "undefined") {
    window.Player = Player;
} else {
    module.exports = Player; // eslint-disable-line no-undef
}
