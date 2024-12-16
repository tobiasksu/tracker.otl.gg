const Db = require("../database/challengemode");

/**
 * A class that represents challenge mode.
 */
class ChallengeMode {
    /**
     * Get leaderboard data.
     * @param {string} levelHash The level hash.
     * @param {string} difficultyLevelId The difficulty level.
     * @param {string} modeId The CM mode (e.g. countdown, infinite, future)
     * @returns {Promise} A promise that resolves when the leaderboard has been processed.
     */
    static async getLeaderboard(levelHash, difficultyLevelId, modeId) {
        return await Db.getLeaderboard(levelHash, difficultyLevelId, modeId);
    }

    /**
     * Process adding a run.
     * @param {string} ipAddress The IP address of the remote client.
     * @param {object} data The run data.
     * @returns {Promise} A promise that resolves when the run has been processed.
     */
    static async addRun(ipAddress, data) {
        return await Db.add(ipAddress, data);
    }
}

module.exports = ChallengeMode;