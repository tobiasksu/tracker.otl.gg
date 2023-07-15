import Player from "../../public/js/common/player"
import ServerTypes from "./serverTypes"

declare namespace MessageTypes {
    interface IMessage {
        name: string
    }

    type Message = MessageServer | MessageStats

    type MessageData = {
        ip: string
        data: Message
    }

    type MessageServer = {
        name: "Server"
        visible: boolean
        server: ServerTypes.LocalServer
    }

    type MessageStats = {
        name: "Stats"
    } & (MessageTypeBlunder | MessageTypeConnect | MessageTypeCTF | MessageTypeDisconnect | MessageTypeEndGame | MessageTypeGoal | MessageTypeKill | MessageTypeLobbyExit | MessageTypeStartGame | MessageTypeTeamChange)

    type MessageTypeBlunder = {
        type: "Blunder"
        time: number
        scorer: string
        scorerTeam: string
    }

    type MessageTypeConnect = {
        type: "Connect"
        time: number
        player: string
    }

    type MessageTypeCTF = {
        type: "CTF"
        time: number
        event: string
        scorer: string
        scorerTeam: string
    }

    type MessageTypeDisconnect = {
        type: "Disconnect"
        time: number
        player: string
    }

    type MessageTypeEndGame = {
        type: "EndGame"
        start: string
        end: string
        damage: {
            attacker: string
            defender: string
            weapon: string
            damage: number
        }[]
        kills: {
            time: number
            attacker: string
            attackerTeam: string
            defender: string
            defenderTeam: string
            assisted: string
            assistedTeam: string
            weapon: string
        }[]
        goals: {
            time: number
            scorer: string
            scorerTeam: string
            assisted: string
            blunder: boolean
        }[]
        flagStats: {
            time: number
            event: string
            scorer: string
            scorerTeam: string
        }[]
        teamChanges: {
            time: number
            playerName: string
            previousTeam: string
            currentTeam: string
        }[]
        teamScore?: {
            [x: string]: number
        }
        players?: Player[]
        id?: number
    }

    type MessageTypeGoal = {
        type: "Goal"
        time: number
        scorer: string
        scorerTeam: string
        assisted: string
        assistedTeam: string
    }

    type MessageTypeKill = {
        type: "Kill"
        time: number
        attacker: string
        attackerTeam: string
        defender: string
        defenderTeam: string
        assisted: string
        assistedTeam: string
        weapon: string
    }

    type MessageTypeLobbyExit = {
        type: "LobbyExit"
    }

    type MessageTypeStartGame = {
        type: "StartGame" | "LobbyStatus"
        start?: string
        time?: number
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
        server?: ServerTypes.LocalServer
    }

    type MessageTypeTeamChange = {
        type: "TeamChange"
        time: number
        playerName: string
        previousTeam: string
        currentTeam: string
    }
}

export = MessageTypes
