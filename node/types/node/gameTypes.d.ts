import Player from "../../public/js/common/player"

declare namespace GameTypes {
    type GameData = {
        ip: string
        settings?: {
            friendlyFire: boolean
            matchMode: string
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
            time: number
        }[]
        goals?: {
            blunder: boolean
            scorer: string
            scorerTeam: string
            assisted: string
            time: number
        }[]
        flagStats?: {
            event: string
            scorer: string
            scorerTeam: string
            time: number
        }[]
        events?: object[]
        damage?: {
            attacker: string
            defender: string
            damage: number
            weapon: string
        }[]
        teamScore?: {
            [x: string]: number
        }
        teamChanges?: object[]
        countdown?: number
    }
}

export = GameTypes
