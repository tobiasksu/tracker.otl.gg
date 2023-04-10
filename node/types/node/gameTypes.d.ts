import Player from "../../public/js/common/player"

declare namespace GameTypes {
    type GameData = {
        ip: string
        settings?: {
            friendlyFire?: boolean
            matchMode: string
            timeLimit?: number
            scoreLimit?: number
            suddenDeath?: boolean
            maxPlayers?: number
            level?: string
            joinInProgress?: boolean
            hasPassword?: boolean
            matchNotes?: string
            creator?: string
        }
        server?: string
        start?: Date
        end?: Date
        players?: Player[]
        kills?: {
            attacker: string
            attackerTeam: string
            defender: string
            defenderTeam: string
            assisted: string
            assistedTeam: string
            time: number
            weapon: string
        }[]
        goals?: {
            blunder: boolean
            scorer: string
            scorerTeam: string
            assisted: string
            assistedTeam: string
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
            description: string
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
    }
}

export = GameTypes
