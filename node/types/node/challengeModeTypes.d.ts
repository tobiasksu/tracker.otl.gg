import MongoDb from "mongodb"

declare namespace ChallengeModeTypes {
    type ChallengeModeMongoData = {
        _id: MongoDb.ObjectId
        data: {
            ip?: string
            playerId?: string
            pilotName?: string
            levelName?: string
            levelHash?: string
            killerId?: number
            favoriteWeaponId?: number
            difficultyLevelId?: number
            modeId?: number
            robotsDestroyed?: number
            aliveTime?: number
            score?: number
            smashDamage?: number
            smashKills?: number
            autoOpDamage?: number
            autoOpKills?: number
            selfDamage?: number
            playerStats?: {
                weaponTypeId?: number
                isPrimary?: boolean
                damageDealt?: number
                numKilled?: number
            }[]
            robotStats?: {
                enemyTypeId?: number
                isSuper?: boolean
                damageReceived?: number
                damageDealt?: number
                numKilled?: number
            }[]
        }
    }

    type Leaderboard = {
        rank: number,
        pilotName: string,
        score: number,
        kills: number,
        time: number,
        favoriteWeaponId: number,
        dateAdded: Date
    }

    type Run = {
        ip: string,
        playerId: string,
        pilotName: string,
        levelName: string,
        levelHash: string,
        killerId: number,
        favoriteWeaponId: number,
        difficultyLevelId: number,
        modeId: number,
        robotsDestroyed: number,
        aliveTime: number,
        score: number,
        smashDamage: number,
        smashKills: number,
        autoOpDamage: number,
        autoOpKills:number,
        selfDamage: number,
        playerStats: PlayerStat[],
        robotStats: RobotStat[]
    }

    type PlayerStat = {
        weaponTypeId: number,
        isPrimary: boolean,
        damageDealt: number,
        numKilled: number
    }

    type RobotStat = {
        enemyTypeId: number,
        isSuper: boolean,
        damageReceived: number,
        damageDealt: number,
        numKilled: number
    }
}

export = ChallengeModeTypes
