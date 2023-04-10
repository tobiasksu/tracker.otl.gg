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
        this.startTime = data.startTime;
        this.projectedEnd = data.projectedEnd;
        this.countdown = data.countdown;
        this.elapsed = data.elapsed;
        this.inLobby = data.inLobby;
        this.lastUpdate = new Date();
        this.teamChanges = data.teamChanges || [];
    }

    //              #     ##   ##    ##
    //              #    #  #   #     #
    //  ###   ##   ###   #  #   #     #
    // #  #  # ##   #    ####   #     #
    //  ##   ##     #    #  #   #     #
    // #      ##     ##  #  #  ###   ###
    //  ###
    /**
     * Gets the list of current games, except for games that haven't received a ping in more than 5 minutes.
     * @returns {Game[]} The list of games.
     */
    static getAll() {
        return Game.games.filter((g) => new Date().getTime() - g.lastUpdate.getTime() < 5 * 60 * 1000 && (
            !g.settings || !g.settings.suddenDeath || g.teamScore.BLUE !== g.teamScore.ORANGE || !g.countdown || g.countdown >= -10000
        ) && (
            !g.settings || g.settings.suddenDeath || !g.countdown || g.countdown >= -10000
        ));
    }

    //              #    ###         ###
    //              #    #  #         #
    //  ###   ##   ###   ###   #  #   #    ###
    // #  #  # ##   #    #  #  #  #   #    #  #
    //  ##   ##     #    #  #   # #   #    #  #
    // #      ##     ##  ###     #   ###   ###
    //  ###                     #          #
    /**
     * Gets the game data for the specified IP.
     * @param {string} ip The IP to get the game data for.
     * @returns {Game} The game data.
     */
    static getByIp(ip) {
        return this.games.find((g) => g.ip === ip);
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

        game.lastUpdate = new Date();

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
     * @param {{time: number, scorer: string, scorerTeam: string, blunder: boolean, assisted: string, assistedTeam: string, description: string}} data The blunder data.
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

        this.goals.push(data);

        const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";

        data.description = `BLUNDER! ${scorer} own goals for ${otherTeam}!`;
        this.events.push(data);

        const scorerPlayer = this.getPlayer(scorer);
        scorerPlayer.team = scorerTeam;
        scorerPlayer.blunders++;

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

        // If the player is invalid, bail.
        if (!player) {
            return;
        }

        player.disconnected = false;
        player.connected = data.time;
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
     * @param {{time: number, event: string, scorer: string, scorerTeam: string, description: string}} data The CTF data.
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

        if (event === "Return" && !scorer) {
            this.flagStats.push(data);
            data.description = `The ${scorerTeam} flag has been automatically returned.`;
            this.events.push(data);
            return;
        }

        const scorerPlayer = this.getPlayer(scorer);
        scorerPlayer.team = scorerTeam;

        this.flagStats.push(data);

        switch (event) {
            case "Return":
                data.description = `${scorer} returned the ${scorerTeam} flag.`;
                scorerPlayer.returns++;
                break;
            case "Pickup": {
                const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";
                data.description = `${scorer} picked up the ${otherTeam} flag.`;
                scorerPlayer.pickups++;
                break;
            }
            case "Capture":
                data.description = `${scorer} scores for ${scorerTeam}!`;
                scorerPlayer.captures++;
                if (this.teamScore[scorerTeam]) {
                    this.teamScore[scorerTeam]++;
                } else {
                    this.teamScore[scorerTeam] = 1;
                }
                break;
            case "CarrierKill": {
                const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";
                data.description = `${scorer} killed the ${otherTeam} flag carrier!`;
                scorerPlayer.carrierKills++;
                break;
            }
        }

        this.events.push(data);
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

        // If the player is invalid, bail.
        if (!player) {
            return;
        }

        if (!this.end) {
            player.disconnected = true;
            player.connected = void 0;
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
     * @param {{start: Date, end: Date, damage: object[], kills: object[], goals: object[], flagStats: object[], players: object[], teamScore: object, teamChanges: object[]}} data The end game data.
     * @returns {void}
     */
    endGame(data) {
        const {start, end, damage, kills, goals, flagStats, players, teamScore, teamChanges} = data;

        this.start = new Date(start);
        this.end = new Date(end);
        this.damage = damage;
        this.kills = kills;
        this.goals = goals;
        this.flagStats = flagStats;
        this.players = players;
        this.teamScore = teamScore;
        this.teamChanges = teamChanges;
    }

    //              #     ##                  #   #     #     #
    //              #    #  #                 #         #
    //  ###   ##   ###   #      ##   ###    ###  ##    ###   ##     ##   ###
    // #  #  # ##   #    #     #  #  #  #  #  #   #     #     #    #  #  #  #
    //  ##   ##     #    #  #  #  #  #  #  #  #   #     #     #    #  #  #  #
    // #      ##     ##   ##    ##   #  #   ###  ###     ##  ###    ##   #  #
    //  ###
    /**
     * Gets the condition that will end the game.
     * @returns {string} The condition that will end the game.
     */
    getCondition() {
        let condition = "";

        if (this.settings) {
            if (this.settings.scoreLimit) {
                condition = `${condition}First to ${this.settings.scoreLimit}`;

                if (this.settings.timeLimit) {
                    condition = `${condition}, `;
                }
            }

            if (this.settings.timeLimit) {
                condition = `${condition}${Math.round(this.settings.timeLimit / 60)}:00 time limit`;
            }
        }

        return condition;
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
     * @param {string} [team] The team the player is currently on.
     * @returns {InstanceType<Game.Player>} The player. // TODO: Fix return type.
     */
    getPlayer(name, team) {
        if (!name) {
            return void 0;
        }

        if (!this.players.find((p) => p.name === name)) {
            this.players.push(new Game.Player({
                name,
                team,
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
                connected: 0
            }));
        }

        return this.players.find((p) => p.name === name);
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
     * @param {{time: number, scorer: string, scorerTeam: string, assisted: string, assistedTeam: string, blunder: boolean, description: string}} data The goal data.
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

        this.goals.push(data);
        data.description = `GOAL! ${scorer} scored for ${scorerTeam}!${assisted ? ` Assisted by ${assisted}.` : ""}`;
        this.events.push(data);

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
     * @param {{time: number, attacker: string, attackerTeam: string, defender: string, defenderTeam: string, assisted: string, assistedTeam: string, weapon: string, description: string}} data The kill data.
     * @returns {void}
     */
    kill(data) {
        const {attacker, attackerTeam, defender, defenderTeam, assisted, assistedTeam, weapon} = data;

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

        const attackerPlayer = this.getPlayer(attacker, attackerTeam),
            defenderPlayer = this.getPlayer(defender, defenderTeam),
            assistedPlayer = this.getPlayer(assisted, assistedTeam);

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

        this.kills.push(data);
        data.description = `${attacker} killed ${defender} with ${weapon}.${assisted ? ` Assisted by ${assisted}.` : ""}`;
        this.events.push(data);
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
        if (data.timeLimit && data.timeLimit === 2147483647) {
            delete data.timeLimit;
        }

        if (data.server) {
            this.server = data.server;
        }

        if (data.settings) {
            this.settings = data;
        }

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

        if (data.condition) {
            this.condition = data.condition;
        } else {
            this.condition = this.getCondition();
        }

        if (!this.inLobby) {
            if (["CTF", "MONSTERBALL"].indexOf(this.settings.matchMode) !== -1) {
                this.teamScore = {"BLUE": 0, "ORANGE": 0};
            }

            if (this.settings.timeLimit) {
                this.projectedEnd = new Date();
                this.projectedEnd.setSeconds(this.projectedEnd.getSeconds() + this.settings.timeLimit);
                if (data.countdown) {
                    this.countdown = data.countdown;
                } else {
                    this.countdown = this.settings.timeLimit * 1000;
                }
            } else {
                this.startTime = new Date();
                if (data.elapsed) {
                    this.elapsed = data.elapsed;
                } else {
                    this.elapsed = 0;
                }
            }
        }
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
     * @param {{time: number, playerName: string, previousTeam: string, currentTeam: string, description: string}} data The teamChange data.
     * @returns {void}
     */
    teamChange(data) {
        const {playerName, previousTeam, currentTeam} = data;

        this.teamChanges.push(data);
        data.description = `${playerName} changed from ${previousTeam} to ${currentTeam} team`;
        this.events.push(data);

        const player = this.getPlayer(playerName);
        player.team = currentTeam;
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
