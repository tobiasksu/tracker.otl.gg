declare namespace ServerTypes {
    type Server = {
        keepListed: boolean
        name: string
        notes: string
        version: string
    }

    type LocalServer = {
        ip: string
        keepListed?: boolean
        name?: string
        notes?: string
        version?: string
        numPlayers?: number
        maxNumPlayers?: number
        map?: string
        mode?: string
        lastSeen?: Date
        gameStarted?: Date
        old?: boolean
    }
}

export = ServerTypes
