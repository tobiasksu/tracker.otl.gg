import MongoDb from "mongodb"

declare namespace ServerTypes {
    type ServerMongoData = {
        _id: MongoDb.ObjectId
        ipAddress: string
        visible: boolean
        data: {
            ip?: string
            keepListed?: boolean
            name?: string
            notes?: string
            version?: string
            lastSeen?: Date
        }
    }

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
