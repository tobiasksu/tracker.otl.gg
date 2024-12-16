/**
 * @typedef {import("../../types/node/challengeModeTypes").ChallengeModeTypes} ChallengeModeTypes.Run
 */

/**
 * A class that represents a challenge mode run.
 */
class ChallengeModeRun {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * Creates a new game from the data provided.
     * @param {ChallengeModeTypes.Run} data The data to create the challenge mode run with.
     */
    constructor(data) {
        this.ip = data.ip;
        this.playerId = data.playerId;
        this.pilotName = data.pilotName;
        this.levelName = data.levelName;
        this.levelHash = data.levelHash;
        this.killerId = data.killerId;
        this.favoriteWeaponId = data.favoriteWeaponId;
        this.difficultyLevelId = data.difficultyLevelId;
        this.modeId = data.modeId;
        this.robotsDestroyed = data.robotsDestroyed;
        this.aliveTime = data.aliveTime;
        this.score = data.score;
        this.smashDamage = data.smashDamage;
        this.smashKills = data.smashKills;
        this.autoOpDamage = data.autoOpDamage;
        this.autoOpKills = data.autoOpKills;
        this.selfDamage = data.selfDamage;
        this.playerStats = data.playerStats || [];
        this.robotStats = data.robotStats || [];
        this.id = data.id || void 0;
    }
}

module.exports = ChallengeModeRun; // eslint-disable-line no-undef
