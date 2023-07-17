import MongoDb from "mongodb"

declare namespace CompletedTypes {
    type CompletedMongoData = {
        _id: MongoDb.Long
        ipAddress: string
        dateAdded: Date
        data: {
            ip?: string
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
                joinInProgess?: boolean
                rearViewAllowed?: boolean
                teamCount?: number
                players?: string[]
                hasPassword?: boolean
                matchNotes?: string
                classicSpawnsEnabled?: boolean
                ctfCarrierBoostEnabled?: boolean
                suddenDeath?: boolean
            }
            server?: {
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
            start?: Date
            end?: Date
            players?: {
                name: string
                team?: string
                kills?: number
                assists?: number
                deaths?: number
                goals?: number
                goalAssists?: number
                blunders?: number
                returns?: number
                pickups?: number
                captures?: number
                carrierKills?: number
                connected?: boolean
                disconnected?: boolean
                timeInGame?: MongoDb.Double
            }[]
            kills?: {
                attacker: string
                attackerTeam?: string
                defender: string
                defenderTeam?: string
                assisted?: string
                assistedTeam?: string
                time: MongoDb.Double
                weapon?: string
            }[]
            goals?: {
                blunder?: boolean
                scorer: string
                scorerTeam: string
                assisted?: string
                assistedTeam?: string
                time: MongoDb.Double
            }[]
            flagStats?: {
                event: string
                scorer: string
                scorerTeam: string
                time: MongoDb.Double
            }[]
            events?: {
                time: MongoDb.Double
                type: string
                description: string
                player?: string
            }[]
            damage?: {
                attacker: string
                defender: string
                damage: MongoDb.Double
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
                time: number
                playerName: string
                previousTeam: string
                currentTeam: string
            }[]
            remaining?: number
            id?: number
            date?: Date
        }
    }
}

export = CompletedTypes
