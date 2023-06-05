import Player from "../../public/js/common/player"
import ServerTypes from "./serverTypes"

declare namespace GameTypes {
    type GameData = {
        ip: string
        settings?: {
            creator?: string
            forceModifier1?: string
            forceModifier2?: string
            forceMissile1?: string
            forceMissile2?: string
            forceWeapon1?: string
            forceWeapon2?: string
            forceLoadout?: string
            powerupFilterBitmask?: number
            powerupBigSpawn?: string
            powerupInitial?: string
            turnSpeedLimit?: string
            powerupSpawn?: string
            friendlyFire?: boolean
            matchMode: string
            maxPlayers?: number
            showEnemyNames?: string
            timeLimit?: number
            scoreLimit?: number
            respawnTimeSeconds?: number
            respawnShieldTimeSeconds?: number
            level?: string
            joinInProgress?: boolean
            rearViewAllowed?: boolean
            teamCount?: number
            players?: string[]
            hasPassword?: boolean
            matchNotes?: string
            classicSpawnsEnabled?: boolean
            ctfCarrierBoostEnabled?: boolean
            suddenDeath?: boolean
        }
        server?: ServerTypes.LocalServer
        start?: Date
        end?: Date
        players?: Player[]
        kills?: {
            attacker: string
            attackerTeam?: string
            defender: string
            defenderTeam?: string
            assisted?: string
            assistedTeam?: string
            time: number
            weapon: string
        }[]
        goals?: {
            blunder?: boolean
            scorer: string
            scorerTeam: string
            assisted?: string
            assistedTeam?: string
            time: number
        }[]
        flagStats?: {
            event: string
            scorer: string
            scorerTeam: string
            time: number
        }[]
        events?: {
            time: number
            type: string
            description: string
            player?: string
        }[]
        damage?: {
            attacker: string
            defender: string
            damage: number
            weapon: string
        }[]
        teamScore?: {
            [x: string]: number
        }
        startTime?: Date
        projectedEnd?: Date
        countdown?: number
        elapsed?: number
        inLobby?: boolean
        teamChanges?: {
            playerName: string
            previousTeam: string
            currentTeam: string
        }[]
        remaining?: number
        id?: number
        date?: Date
    }
}

export = GameTypes
