/**
 * @typedef {import("../../../types/node/gameTypes").GameData} GameTypes.GameData
 * @typedef {import("../../../types/node/messageTypes").MessageTypeBlunder} MessageTypes.MessageTypeBlunder
 * @typedef {import("../../../types/node/messageTypes").MessageTypeConnect} MessageTypes.MessageTypeConnect
 * @typedef {import("../../../types/node/messageTypes").MessageTypeCTF} MessageTypes.MessageTypeCTF
 * @typedef {import("../../../types/node/messageTypes").MessageTypeDisconnect} MessageTypes.MessageTypeDisconnect
 * @typedef {import("../../../types/node/messageTypes").MessageTypeEndGame} MessageTypes.MessageTypeEndGame
 * @typedef {import("../../../types/node/messageTypes").MessageTypeGoal} MessageTypes.MessageTypeGoal
 * @typedef {import("../../../types/node/messageTypes").MessageTypeKill} MessageTypes.MessageTypeKill
 * @typedef {import("../../../types/node/messageTypes").MessageTypeStartGame} MessageTypes.MessageTypeStartGame
 * @typedef {import("../../../types/node/messageTypes").MessageTypeTeamChange} MessageTypes.MessageTypeTeamChange
 * @typedef {import("../../../types/node/serverTypes").LocalServer} ServerTypes.LocalServer
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
        this.remaining = data.remaining || (data.id ? 3600000 + data.date.getTime() - Date.now() : void 0);
        this.id = data.id || void 0;
        this.date = data.date || void 0;
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
     * @param {MessageTypes.MessageTypeBlunder} data The blunder data.
     * @returns {void}
     */
    blunder(data) {
        const {scorer, scorerTeam, time} = data;

        if (!this.settings) {
            this.settings = {matchMode: "MONSTERBALL"};
        }

        if (!this.settings.matchMode || this.settings.matchMode !== "MONSTERBALL") {
            this.settings.matchMode = "MONSTERBALL";
        }

        if (!this.teamScore) {
            this.teamScore = {"BLUE": 0, "ORANGE": 0};
        }

        const scorerPlayer = this.getPlayer(scorer);

        // If the player is invalid, bail.
        if (!scorerPlayer) {
            return;
        }

        this.goals.push({
            blunder: true,
            scorer: data.scorer,
            scorerTeam: data.scorerTeam,
            time
        });

        const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";

        this.events.push({
            time,
            type: "Blunder",
            description: `BLUNDER! ${scorer} own goals for ${otherTeam}!`
        });

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
     * @param {MessageTypes.MessageTypeConnect} data The connect data.
     * @returns {void}
     */
    connect(data) {
        const player = this.getPlayer(data.player);

        // If the player is invalid, bail.
        if (!player) {
            return;
        }

        player.disconnected = false;
        player.connected = true;

        this.events.push({
            time: data.time,
            type: "Connect",
            description: `${data.player} connected.`,
            player: data.player
        });
    }

    //        #      #
    //        #     # #
    //  ##   ###    #
    // #      #    ###
    // #      #     #
    //  ##     ##   #
    /**
     * Adds a CTF stat.
     * @param {MessageTypes.MessageTypeCTF} data The CTF data.
     * @returns {void}
     */
    ctf(data) {
        const {event, scorer, scorerTeam, time} = data;

        if (!this.settings) {
            this.settings = {matchMode: "CTF"};
        }

        if (!this.settings.matchMode || this.settings.matchMode !== "CTF") {
            this.settings.matchMode = "CTF";
        }

        if (!this.teamScore) {
            this.teamScore = {"BLUE": 0, "ORANGE": 0};
        }

        /** @type {InstanceType<Game.Player>} */
        let scorerPlayer = void 0;
        if (scorer) {
            scorerPlayer = this.getPlayer(scorer);
            scorerPlayer.team = scorerTeam;
        }

        let description = "";
        switch (event) {
            case "Return":
                if (scorer) {
                    description = `${scorer} returned the ${scorerTeam} flag.`;
                    scorerPlayer.returns++;
                } else {
                    description = `The ${scorerTeam} flag has been automatically returned.`;
                }
                break;
            case "Pickup": {
                // If the player is invalid, bail.
                if (!scorerPlayer) {
                    return;
                }

                const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";
                description = `${scorer} picked up the ${otherTeam} flag.`;
                scorerPlayer.pickups++;
                break;
            }
            case "Capture":
                // If the player is invalid, bail.
                if (!scorerPlayer) {
                    return;
                }

                description = `${scorer} scores for ${scorerTeam}!`;
                scorerPlayer.captures++;
                if (this.teamScore[scorerTeam]) {
                    this.teamScore[scorerTeam]++;
                } else {
                    this.teamScore[scorerTeam] = 1;
                }
                break;
            case "CarrierKill": {
                // If the player is invalid, bail.
                if (!scorerPlayer) {
                    return;
                }

                const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";
                description = `${scorer} killed the ${otherTeam} flag carrier!`;
                scorerPlayer.carrierKills++;
                break;
            }
        }

        this.flagStats.push({
            time,
            event: data.event,
            scorer: data.scorer,
            scorerTeam: data.scorerTeam
        });

        this.events.push({
            time,
            type: "CTF",
            description
        });
    }

    //    #   #                                                #
    //    #                                                    #
    //  ###  ##     ###    ##    ##   ###   ###    ##    ##   ###
    // #  #   #    ##     #     #  #  #  #  #  #  # ##  #      #
    // #  #   #      ##   #     #  #  #  #  #  #  ##    #      #
    //  ###  ###   ###     ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Indicates a player has disconnected.
     * @param {MessageTypes.MessageTypeDisconnect} data The connect data.
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
            player.connected = false;

            this.events.push({
                time: data.time,
                type: "Disconnect",
                description: `${data.player} disconnected.`,
                player: data.player
            });
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
     * @param {MessageTypes.MessageTypeEndGame} data The end game data.
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
     * @param {Game} game The game.
     * @returns {string} The condition that will end the game.
     */
    static getCondition(game) {
        let condition = "";

        if (game.settings) {
            if (game.settings.scoreLimit) {
                condition = `${condition}First to ${game.settings.scoreLimit}`;

                if (game.settings.timeLimit) {
                    condition = `${condition}, `;
                }
            }

            if (game.settings.timeLimit) {
                condition = `${condition}${Math.round(game.settings.timeLimit / 60)}:00 time limit`;
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
                connected: false
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
     * @param {MessageTypes.MessageTypeGoal} data The goal data.
     * @returns {void}
     */
    goal(data) {
        const {scorer, scorerTeam, assisted, time} = data;

        if (!this.settings) {
            this.settings = {matchMode: "MONSTERBALL"};
        }

        if (!this.settings.matchMode || this.settings.matchMode !== "MONSTERBALL") {
            this.settings.matchMode = "MONSTERBALL";
        }

        if (!this.teamScore) {
            this.teamScore = {"BLUE": 0, "ORANGE": 0};
        }

        const scorerPlayer = this.getPlayer(scorer),
            assistedPlayer = this.getPlayer(assisted);

        // If the player is invalid, bail.
        if (!scorerPlayer) {
            return;
        }

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

        this.goals.push({
            time,
            scorer: data.scorer,
            scorerTeam: data.scorerTeam,
            assisted: data.assisted,
            assistedTeam: data.assistedTeam,
            blunder: false
        });

        this.events.push({
            time,
            type: "Goal",
            description: `GOAL! ${scorer} scored for ${scorerTeam}!${assisted ? ` Assisted by ${assisted}.` : ""}`
        });
    }

    // #      #    ##    ##
    // #            #     #
    // # #   ##     #     #
    // ##     #     #     #
    // # #    #     #     #
    // #  #  ###   ###   ###
    /**
     * Adds a kill.
     * @param {MessageTypes.MessageTypeKill} data The kill data.
     * @returns {void}
     */
    kill(data) {
        const {attacker, attackerTeam, defender, defenderTeam, assisted, assistedTeam, weapon, time} = data;

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

        // If there is no attacker or defender, bail out.
        if (!attackerPlayer || !defenderPlayer) {
            return;
        }

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

        this.kills.push({
            time,
            attacker: data.attacker,
            attackerTeam: data.attackerTeam,
            defender: data.defender,
            defenderTeam: data.defenderTeam,
            assisted: data.assisted,
            assistedTeam: data.assistedTeam,
            weapon: data.weapon
        });

        this.events.push({
            time,
            type: "Kill",
            description: `${attacker} killed ${defender} with ${weapon}.${assisted ? ` Assisted by ${assisted}.` : ""}`
        });
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
     * @param {ServerTypes.LocalServer} server The server.
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
     * @param {MessageTypes.MessageTypeStartGame} data The start game data.
     * @returns {void}
     */
    startGame(data) {
        if (data.timeLimit && data.timeLimit === 2147483647) {
            delete data.timeLimit;
        }

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
            connected: true
        })) || [];

        this.condition = Game.getCondition(this);

        if (!this.inLobby) {
            if (["CTF", "MONSTERBALL"].indexOf(this.settings.matchMode) !== -1) {
                this.teamScore = {"BLUE": 0, "ORANGE": 0};
            }

            if (this.settings.timeLimit) {
                this.projectedEnd = new Date();
                this.projectedEnd.setSeconds(this.projectedEnd.getSeconds() + this.settings.timeLimit);
                this.countdown = this.settings.timeLimit * 1000;
            } else {
                this.startTime = new Date();
                this.elapsed = 0;
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
     * @param {MessageTypes.MessageTypeTeamChange} data The teamChange data.
     * @returns {void}
     */
    teamChange(data) {
        const {playerName, previousTeam, currentTeam, time} = data;

        const player = this.getPlayer(playerName);

        // If the player is invalid, bail.
        if (!player) {
            return;
        }

        player.team = currentTeam;

        this.teamChanges.push({
            time,
            playerName,
            previousTeam,
            currentTeam
        });

        this.events.push({
            time,
            type: "TeamChange",
            description: `${playerName} changed from ${previousTeam} to ${currentTeam} team`
        });
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
