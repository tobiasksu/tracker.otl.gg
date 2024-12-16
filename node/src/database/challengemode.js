/**
 * @typedef {import("../../types/node/challengeModeTypes").Leaderboard} ChallengeModeTypes.Leaderboard
 */

const Db = require("."),
      MongoDb = require("mongodb");

/**
 * A class that handles calls to the database for challenge mode.
 */
class ChallengeModeDb {
    /**
     * Gets leaderboard data.
     * @param {string} levelHash The level hash.
     * @param {string} difficultyLevelId The difficulty id.
     * @param {string} modeId The mode id.
     * @returns {Promise<ChallengeModeTypes.Leaderboard[]>} The leaderboard data.
     */
    static async getLeaderboard(levelHash, difficultyLevelId, modeId) {
        const db = await Db.get();

        const runs = await db.collection("challengemode").find({
            'data.levelHash': { $eq: levelHash },
            'data.difficultyLevelId': { $eq: parseInt(difficultyLevelId) },
            'data.modeId': { $eq: parseInt(modeId) }
        },
        {
            sort: { 'data.score': -1 }
        }).project({
            _id: 1,
            dateAdded: 1,
            data: {
                pilotName: 1,
                score: 1,
                robotsDestroyed: 1,
                aliveTime: 1,
                favoriteWeaponId: 1
            }
        }).toArray();

        if (!runs) {
            return [];
        }

        return runs.map((run, rank) => ({
            rank: rank+1,
            pilotName: run.data.pilotName,
            score: run.data.score,
            kills: run.data.robotsDestroyed,
            time: run.data.aliveTime,
            favoriteWeaponId: run.data.favoriteWeaponId,
            dateAdded: run.dateAdded
        }));
    }

    /**
     * Adds a challenge mode run.
     * @param {string} ipAddress The IP address of the remote client.
     * @param {ChallengeModeTypes.ChallengeModeRun} data The challenge mode run to add.
     * @returns {Promise} A promise that resolves when the server has been updated.
     */
    static async add(ipAddress, saveData) {
        const db = await Db.get();

        const run = {
            _id: MongoDb.Long.ZERO,
            dateAdded: new Date(),
            data: {
                ip: ipAddress,
                playerId: saveData.playerId,
                pilotName: saveData.pilotName,
                levelName: saveData.levelName,
                levelHash: saveData.levelHash,
                killerId: saveData.killerId,
                favoriteWeaponId: saveData.favoriteWeaponId,
                difficultyLevelId: saveData.difficultyLevelId,
                modeId: saveData.modeId,
                robotsDestroyed: saveData.robotsDestroyed,
                aliveTime: saveData.aliveTime,
                score: saveData.score,
                smashDamage: saveData.smashDamage,
                smashKills: saveData.smashKills,
                autoOpDamage: saveData.autoOpDamage,
                autoOpKills: saveData.autoOpKills,
                selfDamage: saveData.selfDamage,
                playerStats: saveData.playerStats || [],
                robotStats: saveData.robotStats || []
            }
        };

        await Db.id(run, "challengemode");

        await db.collection("challengemode").insertOne(run);

        saveData.id = Db.fromLong(run._id);

        return Db.fromLong(run._id);
    }
}

module.exports = ChallengeModeDb;