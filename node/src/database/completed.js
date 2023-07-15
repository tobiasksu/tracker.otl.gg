const Db = require("."),
    Game = require("../../public/js/common/game"),
    MongoDb = require("mongodb");

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
     * @param {Game} saveData The data to save.
     * @returns {Promise<number>} A promise that returns the ID of the completed game.
     */
    static async add(ip, saveData) {
        const db = await Db.get();

        const game = {
            _id: MongoDb.Long.ZERO,
            ipAddress: saveData.ip,
            dateAdded: new Date(),
            data: {
                ip: saveData.ip,
                settings: saveData.settings,
                server: saveData.server,
                start: saveData.start,
                end: saveData.end,
                players: saveData.players ? saveData.players.map((player) => ({
                    name: player.name,
                    team: player.team,
                    kills: player.kills,
                    assists: player.assists,
                    deaths: player.deaths,
                    goals: player.goals,
                    goalAssists: player.goalAssists,
                    blunders: player.blunders,
                    returns: player.returns,
                    pickups: player.pickups,
                    captures: player.captures,
                    carrierKills: player.carrierKills,
                    connected: player.connected,
                    disconnected: player.disconnected,
                    timeInGame: Db.toDouble(player.timeInGame)
                })) : void 0,
                kills: saveData.kills ? saveData.kills.map((kill) => ({
                    attacker: kill.attacker,
                    attackerTeam: kill.attackerTeam,
                    defender: kill.defender,
                    defenderTeam: kill.defenderTeam,
                    assisted: kill.assisted,
                    assistedTeam: kill.assistedTeam,
                    time: Db.toDouble(kill.time),
                    weapon: kill.weapon
                })) : void 0,
                goals: saveData.goals ? saveData.goals.map((goal) => ({
                    blunder: goal.blunder,
                    scorer: goal.scorer,
                    scorerTeam: goal.scorerTeam,
                    assisted: goal.assisted,
                    assistedTeam: goal.assistedTeam,
                    time: Db.toDouble(goal.time)
                })) : void 0,
                flagStats: saveData.flagStats ? saveData.flagStats.map((stat) => ({
                    event: stat.event,
                    scorer: stat.scorer,
                    scorerTeam: stat.scorerTeam,
                    time: Db.toDouble(stat.time)
                })) : void 0,
                events: saveData.events ? saveData.events.map((event) => ({
                    time: Db.toDouble(event.time),
                    type: event.type,
                    description: event.description,
                    player: event.player
                })) : void 0,
                damage: saveData.damage ? saveData.damage.map((stat) => ({
                    attacker: stat.attacker,
                    defender: stat.defender,
                    damage: Db.toDouble(stat.damage),
                    weapon: stat.weapon
                })) : void 0,
                teamScore: saveData.teamScore,
                startTime: saveData.startTime,
                projectedEnd: saveData.projectedEnd,
                countdown: saveData.countdown,
                elapsed: saveData.countdown,
                inLobby: saveData.inLobby,
                teamChanges: saveData.teamChanges,
                remaining: saveData.remaining,
                id: saveData.id,
                date: saveData.date
            }
        };

        Db.id(game, "completed");

        await db.collection("completed").insertOne(game);

        saveData.id = Db.fromLong(game._id);

        return Db.fromLong(game._id);
    }

    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets a completed game by ID.
     * @param {number} id The Game ID.
     * @returns {Promise<Game>} A promise that returns the completed game.
     */
    static async get(id) {
        const db = await Db.get();

        const game = await db.collection("completed").findOne({_id: new MongoDb.Long(id)});

        if (!game) {
            return void 0;
        }

        return new Game({
            ip: game.ipAddress,
            settings: game.data.settings,
            server: game.data.server,
            start: game.data.start,
            end: game.data.end,
            players: game.data.players ? game.data.players.map((player) => ({
                name: player.name,
                team: player.team,
                kills: player.kills,
                assists: player.assists,
                deaths: player.deaths,
                goals: player.goals,
                goalAssists: player.goalAssists,
                blunders: player.blunders,
                returns: player.returns,
                pickups: player.pickups,
                captures: player.captures,
                carrierKills: player.carrierKills,
                connected: player.connected,
                disconnected: player.disconnected,
                timeInGame: Db.fromDouble(player.timeInGame)
            })) : void 0,
            kills: game.data.kills ? game.data.kills.map((kill) => ({
                attacker: kill.attacker,
                attackerTeam: kill.attackerTeam,
                defender: kill.defender,
                defenderTeam: kill.defenderTeam,
                assisted: kill.assisted,
                assistedTeam: kill.assistedTeam,
                time: Db.fromDouble(kill.time),
                weapon: kill.weapon
            })) : void 0,
            goals: game.data.goals ? game.data.goals.map((goal) => ({
                blunder: goal.blunder,
                scorer: goal.scorer,
                scorerTeam: goal.scorerTeam,
                assisted: goal.assisted,
                assistedTeam: goal.assistedTeam,
                time: Db.fromDouble(goal.time)
            })) : void 0,
            flagStats: game.data.flagStats ? game.data.flagStats.map((stat) => ({
                event: stat.event,
                scorer: stat.scorer,
                scorerTeam: stat.scorerTeam,
                time: Db.fromDouble(stat.time)
            })) : void 0,
            events: game.data.events ? game.data.events.map((event) => ({
                time: Db.fromDouble(event.time),
                type: event.type,
                description: event.description,
                player: event.player
            })) : void 0,
            damage: game.data.damage ? game.data.damage.map((stat) => ({
                attacker: stat.attacker,
                defender: stat.defender,
                damage: Db.fromDouble(stat.damage),
                weapon: stat.weapon
            })) : void 0,
            teamScore: game.data.teamScore,
            startTime: game.data.startTime,
            projectedEnd: game.data.projectedEnd,
            countdown: game.data.countdown,
            elapsed: game.data.elapsed,
            inLobby: game.data.inLobby,
            teamChanges: game.data.teamChanges,
            remaining: game.data.remaining,
            id: Db.fromLong(game._id),
            date: game.dateAdded
        });
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
     * @returns {Promise<{games: Game[], count: number}>} A promise that returns the recent completed games.
     */
    static async getList(page, pageSize) {
        const db = await Db.get();

        const games = await db.collection("completed").find({}, {
            sort: {_id: -1},
            skip: (page - 1) * pageSize,
            limit: pageSize
        }).project({
            _id: 1,
            ipAddress: 1,
            data: {settings: 1, server: 1, players: 1, teamScore: 1},
            dateAdded: 1
        }).toArray();

        const count = await db.collection("completed").countDocuments();

        if (!games) {
            return {games: [], count: 0};
        }

        const completed = games.map((game) => new Game({
            ip: game.ipAddress,
            settings: game.data.settings,
            server: game.data.server,
            players: game.data.players ? game.data.players.map((player) => ({
                name: player.name,
                team: player.team,
                kills: player.kills,
                assists: player.assists,
                deaths: player.deaths,
                goals: player.goals,
                goalAssists: player.goalAssists,
                blunders: player.blunders,
                returns: player.returns,
                pickups: player.pickups,
                captures: player.captures,
                carrierKills: player.carrierKills,
                connected: player.connected,
                disconnected: player.disconnected,
                timeInGame: Db.fromDouble(player.timeInGame)
            })) : void 0,
            teamScore: game.data.teamScore,
            id: Db.fromLong(game._id),
            date: game.dateAdded
        }));

        return {games: completed, count};
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
     * @returns {Promise<Game[]>} A promise that resolves with the recent games.
     */
    static async getRecent() {
        const db = await Db.get();

        const games = await db.collection("completed").find({dateAdded: {$gt: new Date(Date.now() - 3600000)}}, {sort: {dateAdded: 1}}).toArray();

        if (!games) {
            return [];
        }

        return games.map((game) => new Game({
            ip: game.ipAddress,
            settings: game.data.settings,
            server: game.data.server,
            start: game.data.start,
            end: game.data.end,
            players: game.data.players ? game.data.players.map((player) => ({
                name: player.name,
                team: player.team,
                kills: player.kills,
                assists: player.assists,
                deaths: player.deaths,
                goals: player.goals,
                goalAssists: player.goalAssists,
                blunders: player.blunders,
                returns: player.returns,
                pickups: player.pickups,
                captures: player.captures,
                carrierKills: player.carrierKills,
                connected: player.connected,
                disconnected: player.disconnected,
                timeInGame: Db.fromDouble(player.timeInGame)
            })) : void 0,
            kills: game.data.kills ? game.data.kills.map((kill) => ({
                attacker: kill.attacker,
                attackerTeam: kill.attackerTeam,
                defender: kill.defender,
                defenderTeam: kill.defenderTeam,
                assisted: kill.assisted,
                assistedTeam: kill.assistedTeam,
                time: Db.fromDouble(kill.time),
                weapon: kill.weapon
            })) : void 0,
            goals: game.data.goals ? game.data.goals.map((goal) => ({
                blunder: goal.blunder,
                scorer: goal.scorer,
                scorerTeam: goal.scorerTeam,
                assisted: goal.assisted,
                assistedTeam: goal.assistedTeam,
                time: Db.fromDouble(goal.time)
            })) : void 0,
            flagStats: game.data.flagStats ? game.data.flagStats.map((stat) => ({
                event: stat.event,
                scorer: stat.scorer,
                scorerTeam: stat.scorerTeam,
                time: Db.fromDouble(stat.time)
            })) : void 0,
            events: game.data.events ? game.data.events.map((event) => ({
                time: Db.fromDouble(event.time),
                type: event.type,
                description: event.description,
                player: event.player
            })) : void 0,
            damage: game.data.damage ? game.data.damage.map((stat) => ({
                attacker: stat.attacker,
                defender: stat.defender,
                damage: Db.fromDouble(stat.damage),
                weapon: stat.weapon
            })) : void 0,
            teamScore: game.data.teamScore,
            startTime: game.data.startTime,
            projectedEnd: game.data.projectedEnd,
            countdown: game.data.countdown,
            elapsed: game.data.elapsed,
            inLobby: game.data.inLobby,
            teamChanges: game.data.teamChanges,
            remaining: game.data.remaining,
            id: Db.fromLong(game._id),
            date: game.dateAdded
        }));
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
     * @returns {Promise<{games: Game[], count: number}>} A promise that returns the searched completed games.
     */
    static async search(query, page, pageSize) {
        const db = await Db.get();

        const games = await db.collection("completed").find({"$text": {"$search": query}}, {
            sort: {_id: -1},
            skip: (page - 1) * pageSize, limit: pageSize
        }).project({
            _id: 1,
            ipAddress: 1,
            data: {settings: 1, server: 1, players: 1, teamScore: 1},
            dateAdded: 1
        }).toArray();

        const count = await db.collection("completed").countDocuments();

        if (!games) {
            return {games: [], count: 0};
        }

        const completed = games.map((game) => new Game({
            ip: game.ipAddress,
            settings: game.data.settings,
            server: game.data.server,
            players: game.data.players ? game.data.players.map((player) => ({
                name: player.name,
                team: player.team,
                kills: player.kills,
                assists: player.assists,
                deaths: player.deaths,
                goals: player.goals,
                goalAssists: player.goalAssists,
                blunders: player.blunders,
                returns: player.returns,
                pickups: player.pickups,
                captures: player.captures,
                carrierKills: player.carrierKills,
                connected: player.connected,
                disconnected: player.disconnected,
                timeInGame: Db.fromDouble(player.timeInGame)
            })) : void 0,
            teamScore: game.data.teamScore,
            id: Db.fromLong(game._id),
            date: game.dateAdded
        }));

        return {games: completed, count};
    }
}

module.exports = CompletedDb;
