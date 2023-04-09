/**
 * @typedef {import("../../../types/node/gameTypes").GameData} GameTypes.GameData
 */

//   ###
//  #   #
//  #       ###   ## #    ###
//  #          #  # # #  #   #
//  #  ##   ####  # # #  #####
//  #   #  #   #  # # #  #
//   ###    ####  #   #   ###
/**
 * A class that represents a game.
 */
class Game {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * Creates a new game from the data provided.
     * @param {GameTypes.GameData} data The data to create the game with.
     */
    constructor(data) {
        this.ip = data.ip;
        this.settings = data.settings;
        this.server = data.server;
        this.start = data.start;
        this.end = data.end;
        this.players = data.players || [];
        this.kills = data.kills || [];
        this.goals = data.goals || [];
        this.flagStats = data.flagStats || [];
        this.events = data.events || [];
        this.damage = data.damage || [];
        this.teamScore = data.teamScore || {};
        this.teamChanges = data.teamChanges || [];
        this.countdown = data.countdown;
        this.elapsed = /** @type {number} */(void 0); // eslint-disable-line no-extra-parens
        this.inLobby = /** @type {boolean} */(void 0); // eslint-disable-line no-extra-parens
    }

    //              #     ##
    //              #    #  #
    //  ###   ##   ###   #      ###  # #    ##
    // #  #  # ##   #    # ##  #  #  ####  # ##
    //  ##   ##     #    #  #  # ##  #  #  ##
    // #      ##     ##   ###   # #  #  #   ##
    //  ###
    /**
     * Gets the game data for the specified IP, or creates it if it doesn't exit.
     * @param {string} ip The IP to get the game data for.
     * @returns {Game} The game data.
     */
    static getGame(ip) {
        let game = Game.games.find((g) => g.ip === ip);
        if (!game) {
            Game.games.push(game = new Game({ip}));
        }

        return game;
    }

    // #     ##                   #
    // #      #                   #
    // ###    #    #  #  ###    ###   ##   ###
    // #  #   #    #  #  #  #  #  #  # ##  #  #
    // #  #   #    #  #  #  #  #  #  ##    #
    // ###   ###    ###  #  #   ###   ##   #
    /**
     * Adds a blunder.
     * @param {{time: number, scorer: string, scorerTeam: string, blunder: boolean, assisted: string}} data The blunder data.
     * @returns {void}
     */
    blunder(data) {
        const {scorer, scorerTeam} = data;

        if (!this.settings) {
            this.settings = {matchMode: "MONSTERBALL"};
        }

        if (!this.settings.matchMode || this.settings.matchMode !== "MONSTERBALL") {
            this.settings.matchMode = "MONSTERBALL";
        }

        if (!this.teamScore) {
            this.teamScore = {"BLUE": 0, "ORANGE": 0};
        }

        this.events.push(data);
        this.goals.push(data);

        const scorerPlayer = this.getPlayer(scorer);
        scorerPlayer.team = scorerTeam;
        scorerPlayer.blunders++;

        const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";

        if (this.teamScore[otherTeam]) {
            this.teamScore[otherTeam]++;
        } else {
            this.teamScore[otherTeam] = 1;
        }
    }

    //                                      #
    //                                      #
    //  ##    ##   ###   ###    ##    ##   ###
    // #     #  #  #  #  #  #  # ##  #      #
    // #     #  #  #  #  #  #  ##    #      #
    //  ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Indicates a player has connected.
     * @param {{time: number, player: string, description: string}} data The connect data.
     * @returns {void}
     */
    connect(data) {
        const player = this.getPlayer(data.player);

        player.disconnected = false;
        player.connected = true;
        data.description = `${data.player} connected.`;
        this.events.push(data);
    }

    //        #      #
    //        #     # #
    //  ##   ###    #
    // #      #    ###
    // #      #     #
    //  ##     ##   #
    /**
     * Adds a CTF stat.
     * @param {{time: number, event: string, scorer: string, scorerTeam: string}} data The CTF data.
     * @returns {void}
     */
    ctf(data) {
        const {event, scorer, scorerTeam} = data;

        if (!this.settings) {
            this.settings = {matchMode: "CTF"};
        }

        if (!this.settings.matchMode || this.settings.matchMode !== "CTF") {
            this.settings.matchMode = "CTF";
        }

        if (!this.teamScore) {
            this.teamScore = {"BLUE": 0, "ORANGE": 0};
        }

        this.flagStats.push(data);
        this.events.push(data);

        if (event === "Return" && !scorer) {
            return;
        }

        const scorerPlayer = this.getPlayer(scorer);
        scorerPlayer.team = scorerTeam;

        switch (event) {
            case "Return":
                scorerPlayer.returns++;
                break;
            case "Pickup":
                scorerPlayer.pickups++;
                break;
            case "Capture":
                scorerPlayer.captures++;

                if (this.teamScore[scorerTeam]) {
                    this.teamScore[scorerTeam]++;
                } else {
                    this.teamScore[scorerTeam] = 1;
                }
                break;
            case "CarrierKill":
                scorerPlayer.carrierKills++;
                break;
        }
    }

    //    #   #                                                #
    //    #                                                    #
    //  ###  ##     ###    ##    ##   ###   ###    ##    ##   ###
    // #  #   #    ##     #     #  #  #  #  #  #  # ##  #      #
    // #  #   #      ##   #     #  #  #  #  #  #  ##    #      #
    //  ###  ###   ###     ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Indicates a player has disconnected.
     * @param {{time: number, player: string, description: string}} data The connect data.
     * @returns {void}
     */
    disconnect(data) {
        const player = this.getPlayer(data.player);

        if (!this.end) {
            player.disconnected = true;
            player.connected = false;
            data.description = `${data.player} disconnected.`;
            this.events.push(data);
        }
    }

    //                #   ##
    //                #  #  #
    //  ##   ###    ###  #      ###  # #    ##
    // # ##  #  #  #  #  # ##  #  #  ####  # ##
    // ##    #  #  #  #  #  #  # ##  #  #  ##
    //  ##   #  #   ###   ###   # #  #  #   ##
    /**
     * Ends the game.
     * @param {{start: Date, end: Date, damage: object[], kills: object[], goals: object[], flagStats: object[], players: object[], teamScore: object}} data The end game data.
     * @returns {void}
     */
    endGame(data) {
        const {start, end, damage, kills, goals, flagStats, players, teamScore} = data;

        this.start = new Date(start);
        this.end = new Date(end);
        this.damage = damage;
        this.kills = kills;
        this.goals = goals;
        this.flagStats = flagStats;
        this.players = players;
        this.teamScore = teamScore;
    }

    //              #    ###   ##
    //              #    #  #   #
    //  ###   ##   ###   #  #   #     ###  #  #   ##   ###
    // #  #  # ##   #    ###    #    #  #  #  #  # ##  #  #
    //  ##   ##     #    #      #    # ##   # #  ##    #
    // #      ##     ##  #     ###    # #    #    ##   #
    //  ###                                 #
    /**
     * Retrieves a player from a game.
     * @param {string} name The name of the player.
     * @returns {InstanceType<Game.Player>} The player. // TODO: Fix return type.
     */
    getPlayer(name) {
        if (!name) {
            return void 0;
        }

        const players = this.players.find((p) => p.name === name);

        if (!players) {
            const player = new Game.Player({
                name,
                kills: 0,
                assists: 0,
                deaths: 0,
                goals: 0,
                goalAssists: 0,
                blunders: 0,
                returns: 0,
                pickups: 0,
                captures: 0,
                carrierKills: 0
            });
            this.players.push(player);
            return player;
        }

        return void 0;
    }

    //                   ##
    //                    #
    //  ###   ##    ###   #
    // #  #  #  #  #  #   #
    //  ##   #  #  # ##   #
    // #      ##    # #  ###
    //  ###
    /**
     * Add a goal.
     * @param {{time: number, scorer: string, scorerTeam: string, assisted: string, blunder: boolean}} data The goal data.
     * @returns {void}
     */
    goal(data) {
        const {scorer, scorerTeam, assisted} = data;

        if (!this.settings) {
            this.settings = {matchMode: "MONSTERBALL"};
        }

        if (!this.settings.matchMode || this.settings.matchMode !== "MONSTERBALL") {
            this.settings.matchMode = "MONSTERBALL";
        }

        if (!this.teamScore) {
            this.teamScore = {"BLUE": 0, "ORANGE": 0};
        }

        this.events.push(data);
        this.goals.push(data);

        const scorerPlayer = this.getPlayer(scorer),
            assistedPlayer = this.getPlayer(assisted);

        scorerPlayer.team = scorerTeam;
        if (assistedPlayer) {
            assistedPlayer.team = scorerTeam;
        }

        scorerPlayer.goals++;
        if (assistedPlayer) {
            assistedPlayer.goalAssists++;
        }

        if (this.teamScore[scorerTeam]) {
            this.teamScore[scorerTeam]++;
        } else {
            this.teamScore[scorerTeam] = 1;
        }
    }

    // #      #    ##    ##
    // #            #     #
    // # #   ##     #     #
    // ##     #     #     #
    // # #    #     #     #
    // #  #  ###   ###   ###
    /**
     * Adds a kill.
     * @param {{time: number, attacker: string, attackerTeam: string, defender: string, defenderTeam: string, assisted: string, assistedTeam: string, weapon: string}} data The kill data.
     * @returns {void}
     */
    kill(data) {
        const {attacker, attackerTeam, defender, defenderTeam, assisted, assistedTeam} = data;

        if (!this.settings) {
            this.settings = {matchMode: "ANARCHY"};
        }

        if (!this.settings.matchMode) {
            this.settings.matchMode = "ANARCHY";
        }

        if (this.settings.matchMode === "ANARCHY" && (attackerTeam || defenderTeam)) {
            this.settings.matchMode = "TEAM ANARCHY";
        }

        if (this.settings.matchMode === "TEAM ANARCHY" && !this.teamScore) {
            this.teamScore = {"BLUE": 0, "ORANGE": 0};
        }

        this.events.push(data);
        this.kills.push(data);

        const attackerPlayer = this.getPlayer(attacker),
            defenderPlayer = this.getPlayer(defender),
            assistedPlayer = this.getPlayer(assisted);

        attackerPlayer.team = attackerTeam;
        defenderPlayer.team = defenderTeam;
        if (assistedPlayer) {
            assistedPlayer.team = assistedTeam;
        }

        if (attackerTeam && !this.teamScore[attackerTeam]) {
            this.teamScore[attackerTeam] = 0;
        }

        if (defenderTeam && !this.teamScore[defenderTeam]) {
            this.teamScore[defenderTeam] = 0;
        }

        if (attackerTeam && attackerTeam !== "ANARCHY" && attackerTeam === defenderTeam) {
            attackerPlayer.kills--;
            defenderPlayer.deaths++;

            if (this.settings.matchMode === "ANARCHY" || this.settings.matchMode === "TEAM ANARCHY") {
                if (this.teamScore[attackerTeam]) {
                    this.teamScore[attackerTeam]--;
                } else {
                    this.teamScore[attackerTeam] = -1;
                }
            }
        } else {
            attackerPlayer.kills++;
            defenderPlayer.deaths++;
            if (assistedPlayer) {
                assistedPlayer.assists++;
            }

            if (this.settings.matchMode === "ANARCHY" || this.settings.matchMode === "TEAM ANARCHY") {
                if (this.teamScore[attackerTeam]) {
                    this.teamScore[attackerTeam]++;
                } else {
                    this.teamScore[attackerTeam] = 1;
                }
            }
        }
    }

    // ###    ##   # #    ##   # #    ##
    // #  #  # ##  ####  #  #  # #   # ##
    // #     ##    #  #  #  #  # #   ##
    // #      ##   #  #   ##    #     ##
    /**
     * Removes a game from the list of games.
     * @returns {void}
     */
    remove() {
        Game.games.splice(Game.games.indexOf(this), 1);
    }

    //               #     ##
    //               #    #  #
    //  ###    ##   ###    #     ##   ###   # #    ##   ###
    // ##     # ##   #      #   # ##  #  #  # #   # ##  #  #
    //   ##   ##     #    #  #  ##    #     # #   ##    #
    // ###     ##     ##   ##    ##   #      #     ##   #
    /**
     * Sets the server for the game.
     * @param {string} server The server.
     * @returns {void}
     */
    setServer(server) {
        this.server = server;
    }

    //         #                 #     ##
    //         #                 #    #  #
    //  ###   ###    ###  ###   ###   #      ###  # #    ##
    // ##      #    #  #  #  #   #    # ##  #  #  ####  # ##
    //   ##    #    # ##  #      #    #  #  # ##  #  #  ##
    // ###      ##   # #  #       ##   ###   # #  #  #   ##
    /**
     * Starts the game.
     * @param {object} data The start game data.
     * @returns {void}
     */
    startGame(data) {
        this.server = data.server;
        this.settings = data;
        this.inLobby = data.type === "LobbyStatus";
        this.players = data.players && data.players.map((player) => new Game.Player({
            name: player,
            kills: 0,
            assists: 0,
            deaths: 0,
            goals: 0,
            goalAssists: 0,
            blunders: 0,
            returns: 0,
            pickups: 0,
            captures: 0,
            carrierKills: 0,
            connected: data.time
        })) || [];
        this.countdown = data.countdown;
        this.elapsed = data.elapsed;
    }

    //  #                       ##   #
    //  #                      #  #  #
    // ###    ##    ###  # #   #     ###    ###  ###    ###   ##
    //  #    # ##  #  #  ####  #     #  #  #  #  #  #  #  #  # ##
    //  #    ##    # ##  #  #  #  #  #  #  # ##  #  #   ##   ##
    //   ##   ##    # #  #  #   ##   #  #   # #  #  #  #      ##
    //                                                  ###
    /**
     * Adds a team change.
     * @param {{time: number, playerName: string, previousTeam: string, currentTeam: string}} data The teamChange data.
     * @returns {void}
     */
    teamChange(data) {
        this.events.push(data);
        this.teamChanges.push(data);

        const player = this.getPlayer(data.playerName);
        player.team = data.currentTeam;
    }
}

/** @type {Game[]} */
Game.games = [];

/** @type {typeof import("./player")} */
// @ts-ignore
Game.Player = typeof Player === "undefined" ? require("./player") : Player; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.Game = Game;
} else {
    module.exports = Game; // eslint-disable-line no-undef
}
