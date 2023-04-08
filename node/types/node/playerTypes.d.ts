declare namespace PlayerTypes {
    type PlayerData = {
        name: string
        team?: string
        kills: number
        assists: number
        deaths: number
        goals: number
        goalAssists: number
        blunders: number
        returns: number
        pickups: number
        captures: number
        carrierKills: number
        connected?: boolean
        disconnected?: boolean
    }
}

export = PlayerTypes
