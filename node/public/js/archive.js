/**
 * @typedef {import("../../types/node/archiveTypes").DifferentialDataset} ArchiveTypes.DifferentialDataset
 * @typedef {import("chart.js").ChartEvent} ChartJs.ChartEvent
 * @typedef {typeof import("chart.js").Chart} ChartJs.Chart
 * @typedef {import("./common/game")} Game
 */

//    #                  #        #                    ###
//   # #                 #                               #
//  #   #  # ##    ###   # ##    ##    #   #   ###       #   ###
//  #   #  ##  #  #   #  ##  #    #    #   #  #   #      #  #
//  #####  #      #      #   #    #     # #   #####      #   ###
//  #   #  #      #   #  #   #    #     # #   #      #   #      #
//  #   #  #       ###   #   #   ###     #     ###    ###   ####
/**
 * A class that provides functions for the archive page.
 */
class ArchiveJs {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Makes sure all timeago fields are rendered.
     * @returns {void}
     */
    static DOMContentLoaded() {
        const damageChart = /** @type {HTMLCanvasElement} */(document.getElementById("damage-chart")), // eslint-disable-line no-extra-parens
            gameChart = /** @type {HTMLCanvasElement} */(document.getElementById("game-chart")), // eslint-disable-line no-extra-parens
            playerChart = /** @type {HTMLCanvasElement} */(document.getElementById("player-chart")), // eslint-disable-line no-extra-parens
            weaponChart = /** @type {HTMLCanvasElement} */(document.getElementById("weapon-chart")); // eslint-disable-line no-extra-parens

        ArchiveJs.Time.loadTimeAgo();

        document.getElementById("show-damage").addEventListener("click", (ev) => {
            ev.preventDefault();

            document.getElementById("damage").classList.remove("hidden");
            document.getElementById("damage-graphs").classList.add("hidden");
            document.getElementById("game-graphs").classList.add("hidden");
            document.getElementById("player-graphs").classList.add("hidden");
            document.getElementById("weapon-graphs").classList.add("hidden");

            return false;
        });

        document.getElementById("show-damage-graphs").addEventListener("click", (ev) => {
            ev.preventDefault();

            document.getElementById("damage").classList.add("hidden");
            document.getElementById("damage-graphs").classList.remove("hidden");
            document.getElementById("game-graphs").classList.add("hidden");
            document.getElementById("player-graphs").classList.add("hidden");
            document.getElementById("weapon-graphs").classList.add("hidden");

            return false;
        });

        document.getElementById("show-game").addEventListener("click", (ev) => {
            ev.preventDefault();

            document.getElementById("damage").classList.add("hidden");
            document.getElementById("damage-graphs").classList.add("hidden");
            document.getElementById("game-graphs").classList.remove("hidden");
            document.getElementById("player-graphs").classList.add("hidden");
            document.getElementById("weapon-graphs").classList.add("hidden");

            return false;
        });

        document.getElementById("show-player").addEventListener("click", (ev) => {
            ev.preventDefault();

            document.getElementById("damage").classList.add("hidden");
            document.getElementById("damage-graphs").classList.add("hidden");
            document.getElementById("game-graphs").classList.add("hidden");
            document.getElementById("player-graphs").classList.remove("hidden");
            document.getElementById("weapon-graphs").classList.add("hidden");

            return false;
        });

        document.getElementById("show-weapon-graphs").addEventListener("click", (ev) => {
            ev.preventDefault();

            document.getElementById("damage").classList.add("hidden");
            document.getElementById("damage-graphs").classList.add("hidden");
            document.getElementById("game-graphs").classList.add("hidden");
            document.getElementById("player-graphs").classList.add("hidden");
            document.getElementById("weapon-graphs").classList.remove("hidden");

            return false;
        });

        /** @type {NodeListOf<HTMLAnchorElement>} */(document.querySelectorAll("a.stats")).forEach((a) => a.addEventListener("click", (ev) => { // eslint-disable-line no-extra-parens
            document.getElementById("weapon").innerText = a.innerText;

            switch (a.innerText) {
                case "Damage":
                    for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                        let total = 0;
                        for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                            const damage = ArchiveJs.game.damage.filter((d) => d.attacker === ArchiveJs.game.players[x].name && d.defender === ArchiveJs.game.players[y].name).reduce((prev, cur) => prev + cur.damage, 0) || 0,
                                el = document.getElementById(`damage-${x}-${y}`);

                            el.innerText = damage === 0 ? "" : damage.toFixed(0);
                            if (!el.classList.contains("friendly") && !el.classList.contains("self")) {
                                total += damage;
                            }
                        }
                        document.getElementById(`damage-${x}-total`).innerText = total.toFixed(0);
                    }

                    for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                        let total = 0;
                        for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                            const damage = ArchiveJs.game.damage.filter((d) => d.defender === ArchiveJs.game.players[x].name && d.attacker === ArchiveJs.game.players[y].name).reduce((prev, cur) => prev + cur.damage, 0) || 0,
                                el = document.getElementById(`damage-${y}-${x}`);

                            if (!el.classList.contains("friendly") && !el.classList.contains("count")) {
                                total += damage;
                            }
                        }
                        document.getElementById(`damage-total-${x}`).innerText = total.toFixed(0);
                    }

                    break;
                case "Kills":
                    for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                        let total = 0;
                        for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                            const kills = ArchiveJs.game.kills.filter((d) => d.attacker === ArchiveJs.game.players[x].name && d.defender === ArchiveJs.game.players[y].name).length || 0,
                                el = document.getElementById(`damage-${x}-${y}`);

                            el.innerText = kills === 0 ? "" : kills.toFixed(0);
                            if (!el.classList.contains("friendly") && !el.classList.contains("self")) {
                                total += kills;
                            } else {
                                total -= kills;
                            }
                        }
                        document.getElementById(`damage-${x}-total`).innerText = total.toFixed(0);
                    }

                    for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                        let total = 0;
                        for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                            const kills = ArchiveJs.game.kills.filter((d) => d.defender === ArchiveJs.game.players[x].name && d.attacker === ArchiveJs.game.players[y].name).length || 0,
                                el = document.getElementById(`damage-${y}-${x}`);

                            if (!el.classList.contains("friendly") && !el.classList.contains("count")) {
                                total += kills;
                            }
                        }
                        document.getElementById(`damage-total-${x}`).innerText = total.toFixed(0);
                    }

                    break;
                case "Assists":
                    for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                        let total = 0;
                        for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                            const assists = ArchiveJs.game.kills.filter((d) => d.assisted === ArchiveJs.game.players[x].name && d.defender === ArchiveJs.game.players[y].name).length || 0,
                                el = document.getElementById(`damage-${x}-${y}`);

                            el.innerText = assists === 0 ? "" : assists.toFixed(0);
                            if (!el.classList.contains("friendly") && !el.classList.contains("self")) {
                                total += assists;
                            } else {
                                total -= assists;
                            }
                        }
                        document.getElementById(`damage-${x}-total`).innerText = total.toFixed(0);
                    }

                    for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                        let total = 0;
                        for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                            const assists = ArchiveJs.game.kills.filter((d) => d.defender === ArchiveJs.game.players[x].name && d.assisted === ArchiveJs.game.players[y].name).length || 0,
                                el = document.getElementById(`damage-${y}-${x}`);

                            if (!el.classList.contains("friendly") && !el.classList.contains("count")) {
                                total += assists;
                            }
                        }
                        document.getElementById(`damage-total-${x}`).innerText = total.toFixed(0);
                    }

                    break;
                case "Assisted":
                    for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                        let total = 0;
                        for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                            const assists = ArchiveJs.game.kills.filter((d) => d.assisted === ArchiveJs.game.players[x].name && d.attacker === ArchiveJs.game.players[y].name).length || 0,
                                el = document.getElementById(`damage-${x}-${y}`);

                            el.innerText = assists === 0 ? "" : assists.toFixed(0);
                            total += assists;
                        }
                        document.getElementById(`damage-${x}-total`).innerText = total.toFixed(0);
                    }

                    for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                        let total = 0;
                        for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                            const assists = ArchiveJs.game.kills.filter((d) => d.attacker === ArchiveJs.game.players[x].name && d.assisted === ArchiveJs.game.players[y].name).length || 0,
                                el = document.getElementById(`damage-${y}-${x}`);

                            if (!el.classList.contains("friendly") && !el.classList.contains("count")) {
                                total += assists;
                            }
                        }
                        document.getElementById(`damage-total-${x}`).innerText = total.toFixed(0);
                    }

                    break;
                case "Damage Per Kill":
                    for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                        let totalDamage = 0,
                            totalKills = 0;
                        for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                            const damage = ArchiveJs.game.damage.filter((d) => d.attacker === ArchiveJs.game.players[x].name && d.defender === ArchiveJs.game.players[y].name).reduce((prev, cur) => prev + cur.damage, 0) || 0,
                                kills = ArchiveJs.game.kills.filter((d) => d.attacker === ArchiveJs.game.players[x].name && d.defender === ArchiveJs.game.players[y].name).length || 0,
                                el = document.getElementById(`damage-${x}-${y}`);

                            el.innerText = damage / Math.max(kills, 1) === 0 ? "" : (damage / Math.max(kills, 1)).toFixed(2);
                            if (!el.classList.contains("friendly") && !el.classList.contains("self")) {
                                totalDamage += damage;
                                totalKills += kills;
                            }
                        }
                        document.getElementById(`damage-${x}-total`).innerText = (totalDamage / Math.max(totalKills, 1)).toFixed(2);
                    }

                    for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                        let totalDamage = 0,
                            totalKills = 0;
                        for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                            const damage = ArchiveJs.game.damage.filter((d) => d.defender === ArchiveJs.game.players[x].name && d.attacker === ArchiveJs.game.players[y].name).reduce((prev, cur) => prev + cur.damage, 0) || 0,
                                kills = ArchiveJs.game.kills.filter((d) => d.defender === ArchiveJs.game.players[x].name && d.attacker === ArchiveJs.game.players[y].name).length || 0,
                                el = document.getElementById(`damage-${y}-${x}`);

                            if (!el.classList.contains("friendly") && !el.classList.contains("count")) {
                                totalDamage += damage;
                                totalKills += kills;
                            }
                        }
                        document.getElementById(`damage-total-${x}`).innerText = (totalDamage / Math.max(totalKills, 1)).toFixed(2);
                    }

                    break;
            }

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }));

        const weapons = /** @type {NodeListOf<HTMLAnchorElement>} */(document.querySelectorAll("a.weapon")); // eslint-disable-line no-extra-parens

        weapons.forEach((a) => a.addEventListener("click", (ev) => {
            document.getElementById("weapon").innerText = a.title;

            for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                let total = 0;
                for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                    const damage = (ArchiveJs.game.damage.find((d) => d.attacker === ArchiveJs.game.players[x].name && d.defender === ArchiveJs.game.players[y].name && d.weapon === a.title) || {damage: 0}).damage,
                        el = document.getElementById(`damage-${x}-${y}`);

                    el.innerText = damage === 0 ? "" : damage.toFixed(0);
                    if (!el.classList.contains("friendly") && !el.classList.contains("self")) {
                        total += damage;
                    }
                }
                document.getElementById(`damage-${x}-total`).innerText = total.toFixed(0);
            }

            for (let x = 0; x < ArchiveJs.game.players.length; x++) {
                let total = 0;
                for (let y = 0; y < ArchiveJs.game.players.length; y++) {
                    const damage = (ArchiveJs.game.damage.find((d) => d.defender === ArchiveJs.game.players[x].name && d.attacker === ArchiveJs.game.players[y].name && d.weapon === a.title) || {damage: 0}).damage,
                        el = document.getElementById(`damage-${y}-${x}`);

                    if (!el.classList.contains("friendly") && !el.classList.contains("count")) {
                        total += damage;
                    }
                }
                document.getElementById(`damage-total-${x}`).innerText = total.toFixed(0);
            }

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }));

        document.getElementById("overall-damage").addEventListener("click", (ev) => {
            ArchiveJs.damageChartObj.destroy();
            ArchiveJs.damageChartObj = ArchiveJs.damageDoneChart(damageChart, "all");

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        });

        document.getElementById("damage-taken").addEventListener("click", (ev) => {
            ArchiveJs.damageChartObj.destroy();
            ArchiveJs.damageChartObj = ArchiveJs.damageDoneChart(damageChart, "taken");

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        });

        document.getElementById("net-damage").addEventListener("click", (ev) => {
            ArchiveJs.damageChartObj.destroy();
            ArchiveJs.damageChartObj = ArchiveJs.damageDoneChart(damageChart, "net");

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        });

        document.getElementById("damage-types").addEventListener("click", (ev) => {
            ArchiveJs.damageChartObj.destroy();
            ArchiveJs.damageChartObj = ArchiveJs.damageDoneChart(damageChart, "types");

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        });

        document.getElementById("primary-damage").addEventListener("click", (ev) => {
            ArchiveJs.damageChartObj.destroy();
            ArchiveJs.damageChartObj = ArchiveJs.damageDoneChart(damageChart, "primary");

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        });

        document.getElementById("secondary-damage").addEventListener("click", (ev) => {
            ArchiveJs.damageChartObj.destroy();
            ArchiveJs.damageChartObj = ArchiveJs.damageDoneChart(damageChart, "secondary");

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        });

        document.getElementById("score-over-time").addEventListener("click", (ev) => {
            ArchiveJs.gameChartObj.destroy();
            ArchiveJs.gameChartObj = ArchiveJs.gameGraphChart(gameChart, "score");

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        });

        document.getElementById("score-differential-over-time").addEventListener("click", (ev) => {
            ArchiveJs.gameChartObj.destroy();
            ArchiveJs.gameChartObj = ArchiveJs.gameGraphChart(gameChart, "differential");

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        });

        const weaponGraphs = /** @type {NodeListOf<HTMLAnchorElement>}*/(document.querySelectorAll("a.weapon-graph")); // eslint-disable-line no-extra-parens

        weaponGraphs.forEach((a) => a.addEventListener("click", (ev) => {
            ArchiveJs.weaponChartObj.destroy();
            ArchiveJs.weaponChartObj = ArchiveJs.weaponGraphChart(weaponChart, a.title);

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }));

        const playerGraphs = /** @type {NodeListOf<HTMLAnchorElement>}*/(document.querySelectorAll("a.player-graph")); // eslint-disable-line no-extra-parens

        playerGraphs.forEach((a) => a.addEventListener("click", (ev) => {
            ArchiveJs.playerChartObj.destroy();
            ArchiveJs.playerChartObj = ArchiveJs.playerGraphChart(playerChart, a.title);

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }));

        ArchiveJs.damageChartObj = ArchiveJs.damageDoneChart(damageChart, "all");
        ArchiveJs.gameChartObj = ArchiveJs.gameGraphChart(gameChart, "score");
        const weaponGraph = document.querySelector("a.weapon-graph");
        if (weaponGraph) {
            ArchiveJs.weaponChartObj = ArchiveJs.weaponGraphChart(weaponChart, /** @type {HTMLAnchorElement}*/(weaponGraph).title); // eslint-disable-line no-extra-parens
        }
        ArchiveJs.playerChartObj = ArchiveJs.playerGraphChart(playerChart, /** @type {HTMLAnchorElement}*/(document.querySelector("a.player-graph")).title); // eslint-disable-line no-extra-parens
        /** @type {HTMLAnchorElement}*/(document.querySelector("a.stats")).click(); // eslint-disable-line no-extra-parens
    }

    //    #                                ###                      ##   #                  #
    //    #                                #  #                    #  #  #                  #
    //  ###   ###  # #    ###   ###   ##   #  #   ##   ###    ##   #     ###    ###  ###   ###
    // #  #  #  #  ####  #  #  #  #  # ##  #  #  #  #  #  #  # ##  #     #  #  #  #  #  #   #
    // #  #  # ##  #  #  # ##   ##   ##    #  #  #  #  #  #  ##    #  #  #  #  # ##  #      #
    //  ###   # #  #  #   # #  #      ##   ###    ##   #  #   ##    ##   #  #   # #  #       ##
    //                          ###
    /**
     * Shows a damage done chart.
     * @param {HTMLCanvasElement} chart The chart element.
     * @param {string} type The type of chart.
     * @returns {InstanceType<ChartJs.Chart>} The chart.
     */
    static damageDoneChart(chart, type) {
        switch (type) {
            case "all": {
                const damage = ArchiveJs.game.players.map((player) => ({name: player.name, team: player.team, damage: ArchiveJs.game.damage.filter((d) => d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0}));

                return new ArchiveJs.Chart(chart, {
                    type: "bar",
                    data: {
                        labels: damage.map((d) => d.name),
                        datasets: [
                            {
                                label: "Damage Done",
                                data: damage.map((d) => d.damage),
                                backgroundColor: damage.map((d) => ArchiveJs.getColor(d.team))
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white",
                                    boxWidth: 0,
                                    boxHeight: 0
                                }
                            },
                            tooltip: {
                                titleFont: {
                                    family: "Industry Medium",
                                    weight: "bold"
                                },
                                bodyFont: {
                                    family: "Industry Medium"
                                },
                                callbacks: {
                                    label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(0)}`
                                }
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: damage.map((d) => ArchiveJs.getColor(d.team))
                                },
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                },
                                grid: {
                                    color: "#333333",
                                    drawTicks: false
                                }
                            }
                        }
                    }
                });
            }
            case "taken": {
                const taken = ArchiveJs.game.players.map((player) => ({name: player.name, team: player.team, damage: ArchiveJs.game.damage.filter((d) => d.defender === player.name && (ArchiveJs.game.settings && ArchiveJs.game.settings.friendlyFire || d.attacker === d.defender || (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || d.attacker && ArchiveJs.game.players.find((p) => p.name === d.attacker).team !== player.team))).reduce((total, dmg) => total + dmg.damage, 0) || 0}));

                return new ArchiveJs.Chart(chart, {
                    type: "bar",
                    data: {
                        labels: taken.map((d) => d.name),
                        datasets: [
                            {
                                label: "Damage Taken",
                                data: taken.map((d) => d.damage),
                                backgroundColor: taken.map((d) => ArchiveJs.getColor(d.team))
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white",
                                    boxWidth: 0,
                                    boxHeight: 0
                                }
                            },
                            tooltip: {
                                titleFont: {
                                    family: "Industry Medium",
                                    weight: "bold"
                                },
                                bodyFont: {
                                    family: "Industry Medium"
                                },
                                callbacks: {
                                    label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(0)}`
                                }
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: taken.map((d) => ArchiveJs.getColor(d.team))
                                },
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                },
                                grid: {
                                    color: "#333333",
                                    drawTicks: false
                                }
                            }
                        }
                    }
                });
            }
            case "net": {
                const net = ArchiveJs.game.players.map((player) => ({name: player.name, team: player.team, damage: (ArchiveJs.game.damage.filter((d) => d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0) - (ArchiveJs.game.damage.filter((d) => d.defender === player.name && (ArchiveJs.game.settings && ArchiveJs.game.settings.friendlyFire || d.attacker === d.defender || (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || d.attacker && ArchiveJs.game.players.find((p) => p.name === d.attacker).team !== player.team))).reduce((total, dmg) => total + dmg.damage, 0) || 0)}));

                return new ArchiveJs.Chart(chart, {
                    type: "bar",
                    data: {
                        labels: net.map((d) => d.name),
                        datasets: [
                            {
                                label: "Net Damage",
                                data: net.map((d) => d.damage),
                                backgroundColor: net.map((d) => ArchiveJs.getColor(d.team))
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white",
                                    boxWidth: 0,
                                    boxHeight: 0
                                }
                            },
                            tooltip: {
                                titleFont: {
                                    family: "Industry Medium",
                                    weight: "bold"
                                },
                                bodyFont: {
                                    family: "Industry Medium"
                                },
                                callbacks: {
                                    label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(0)}`
                                }
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: net.map((d) => ArchiveJs.getColor(d.team))
                                },
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                },
                                grid: {
                                    color: "#333333",
                                    drawTicks: false
                                }
                            }
                        }
                    }
                });
            }
            case "types": {
                const primary = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => ArchiveJs.getType(d.weapon) === "Primary" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    secondary = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => ArchiveJs.getType(d.weapon) === "Secondary" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    misc = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => ArchiveJs.getType(d.weapon) === "Miscellaneous" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0}));

                return new ArchiveJs.Chart(chart, {
                    type: "bar",
                    data: {
                        labels: ArchiveJs.game.players.map((player) => player.name),
                        datasets: [
                            {
                                label: "Primary",
                                data: primary.map((d) => d.damage),
                                backgroundColor: "#ff6600"
                            },
                            {
                                label: "Secondary",
                                data: secondary.map((d) => d.damage),
                                backgroundColor: "#0066ff"
                            },
                            {
                                label: "Miscellaneous",
                                data: misc.map((d) => d.damage),
                                backgroundColor: "#ffffff"
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                }
                            },
                            tooltip: {
                                titleFont: {
                                    family: "Industry Medium",
                                    weight: "bold"
                                },
                                bodyFont: {
                                    family: "Industry Medium"
                                },
                                callbacks: {
                                    label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(0)}`
                                }
                            }
                        },
                        scales: {
                            x: {
                                stacked: true,
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: ArchiveJs.game.players.map((player) => ArchiveJs.getColor(player.team))
                                },
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                stacked: true,
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                },
                                grid: {
                                    color: "#333333",
                                    drawTicks: false
                                }
                            }
                        }
                    }
                });
            }
            case "primary": {
                const impulse = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Impulse" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    cyclone = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Cyclone" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    reflex = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Reflex" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    crusher = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Crusher" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    driller = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Driller" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    flak = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Flak" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    thunderbolt = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Thunderbolt" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    lancer = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Lancer" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0}));

                return new ArchiveJs.Chart(chart, {
                    type: "bar",
                    data: {
                        labels: ArchiveJs.game.players.map((player) => player.name),
                        datasets: [
                            {
                                label: "Impulse",
                                data: impulse.map((d) => d.damage),
                                backgroundColor: "#0099ff"
                            },
                            {
                                label: "Cyclone",
                                data: cyclone.map((d) => d.damage),
                                backgroundColor: "#ffcc00"
                            },
                            {
                                label: "Reflex",
                                data: reflex.map((d) => d.damage),
                                backgroundColor: "#00cc00"
                            },
                            {
                                label: "Crusher",
                                data: crusher.map((d) => d.damage),
                                backgroundColor: "#333333"
                            },
                            {
                                label: "Driller",
                                data: driller.map((d) => d.damage),
                                backgroundColor: "#666666"
                            },
                            {
                                label: "Flak",
                                data: flak.map((d) => d.damage),
                                backgroundColor: "#999999"
                            },
                            {
                                label: "Thunderbolt",
                                data: thunderbolt.map((d) => d.damage),
                                backgroundColor: "#ff00ff"
                            },
                            {
                                label: "Lancer",
                                data: lancer.map((d) => d.damage),
                                backgroundColor: "#ff66ff"
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                }
                            },
                            tooltip: {
                                titleFont: {
                                    family: "Industry Medium",
                                    weight: "bold"
                                },
                                bodyFont: {
                                    family: "Industry Medium"
                                },
                                footerFont: {
                                    family: "Industry Medium",
                                    weight: "normal"
                                },
                                callbacks: {
                                    label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(0)}`,
                                    footer: (context) => `Click for ${context[0].dataset.label} damage chart`
                                }
                            }
                        },
                        scales: {
                            x: {
                                stacked: true,
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: ArchiveJs.game.players.map((player) => ArchiveJs.getColor(player.team))
                                },
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                stacked: true,
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                },
                                grid: {
                                    color: "#333333",
                                    drawTicks: false
                                }
                            }
                        },
                        onClick: (/** @type {ChartJs.ChartEvent & {chart?: InstanceType<ChartJs.Chart>}} */ev) => {
                            const els = ev.chart.getElementsAtEventForMode(ev.native, "nearest", {intersect: true}, false);
                            if (els.length > 0) {
                                document.getElementById("show-weapon-graphs").click();
                                ArchiveJs.weaponChartObj.destroy();
                                ArchiveJs.weaponChartObj = ArchiveJs.weaponGraphChart(/** @type {HTMLCanvasElement} */(document.getElementById("weapon-chart")), ev.chart.legend.legendItems[els[0].datasetIndex].text); // eslint-disable-line no-extra-parens
                            }
                        }
                    }
                });
            }
            case "secondary": {
                const falcon = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Falcon" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    hunter = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Hunter" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    pod = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Missile Pod" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    creeper = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Creeper" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    nova = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Nova" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    timeBomb = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Time Bomb" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    devastator = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Devastator" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0})),
                    vortex = ArchiveJs.game.players.map((player) => ({name: player.name, damage: ArchiveJs.game.damage.filter((d) => d.weapon === "Vortex" && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0}));

                return new ArchiveJs.Chart(chart, {
                    type: "bar",
                    data: {
                        labels: ArchiveJs.game.players.map((player) => player.name),
                        datasets: [
                            {
                                label: "Falcon",
                                data: falcon.map((d) => d.damage),
                                backgroundColor: "#ffff00"
                            },
                            {
                                label: "Hunter",
                                data: hunter.map((d) => d.damage),
                                backgroundColor: "#ff0000"
                            },
                            {
                                label: "Missile Pod",
                                data: pod.map((d) => d.damage),
                                backgroundColor: "#cc0000"
                            },
                            {
                                label: "Creeper",
                                data: creeper.map((d) => d.damage),
                                backgroundColor: "#990000"
                            },
                            {
                                label: "Nova",
                                data: nova.map((d) => d.damage),
                                backgroundColor: "#33ff33"
                            },
                            {
                                label: "Devastator",
                                data: devastator.map((d) => d.damage),
                                backgroundColor: "#660000"
                            },
                            {
                                label: "Time Bomb",
                                data: timeBomb.map((d) => d.damage),
                                backgroundColor: "#6600ff"
                            },
                            {
                                label: "Vortex",
                                data: vortex.map((d) => d.damage),
                                backgroundColor: "#990099"
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                }
                            },
                            tooltip: {
                                titleFont: {
                                    family: "Industry Medium",
                                    weight: "bold"
                                },
                                bodyFont: {
                                    family: "Industry Medium"
                                },
                                footerFont: {
                                    family: "Industry Medium",
                                    weight: "normal"
                                },
                                callbacks: {
                                    label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(0)}`,
                                    footer: (context) => `Click for ${context[0].dataset.label} damage chart`
                                }
                            }
                        },
                        scales: {
                            x: {
                                stacked: true,
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: ArchiveJs.game.players.map((player) => ArchiveJs.getColor(player.team))
                                },
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                stacked: true,
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                },
                                grid: {
                                    color: "#333333",
                                    drawTicks: false
                                }
                            }
                        },
                        onClick: (/** @type {ChartJs.ChartEvent & {chart?: InstanceType<ChartJs.Chart>}} */ev) => {
                            const els = ev.chart.getElementsAtEventForMode(ev.native, "nearest", {intersect: true}, false);
                            if (els.length > 0) {
                                document.getElementById("show-weapon-graphs").click();
                                ArchiveJs.weaponChartObj.destroy();
                                ArchiveJs.weaponChartObj = ArchiveJs.weaponGraphChart(/** @type {HTMLCanvasElement} */(document.getElementById("weapon-chart")), ev.chart.legend.legendItems[els[0].datasetIndex].text); // eslint-disable-line no-extra-parens
                            }
                        }
                    }
                });
            }
            default:
                return void 0;
        }
    }

    //                          ##                     #      ##   #                  #
    //                         #  #                    #     #  #  #                  #
    //  ###   ###  # #    ##   #     ###    ###  ###   ###   #     ###    ###  ###   ###
    // #  #  #  #  ####  # ##  # ##  #  #  #  #  #  #  #  #  #     #  #  #  #  #  #   #
    //  ##   # ##  #  #  ##    #  #  #     # ##  #  #  #  #  #  #  #  #  # ##  #      #
    // #      # #  #  #   ##    ###  #      # #  ###   #  #   ##   #  #   # #  #       ##
    //  ###                                      #
    /**
     * Shows a game graph chart.
     * @param {HTMLCanvasElement} chart The chart element.
     * @param {string} type The type of chart.
     * @returns {InstanceType<ChartJs.Chart>} The chart.
     */
    static gameGraphChart(chart, type) {
        switch (type) {
            case "score": {
                const data = {},
                    numPlayers = ArchiveJs.game.players.length;

                let max = 0,
                    datasets;

                if (!ArchiveJs.game.settings || ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1) {
                    for (const player of ArchiveJs.game.players) {
                        data[player.name] = [{x: 0, y: 0}];
                    }

                    for (const kill of ArchiveJs.game.kills.sort((a, b) => a.time - b.time)) {
                        if (kill.attacker === kill.defender) {
                            data[kill.attacker].push({x: kill.time / 60, y: data[kill.attacker][data[kill.attacker].length - 1].y - (numPlayers > 2 ? 3 : 1)});
                        } else {
                            data[kill.attacker].push({x: kill.time / 60, y: data[kill.attacker][data[kill.attacker].length - 1].y + (numPlayers > 2 ? 3 : 1)});
                            if (kill.assisted) {
                                data[kill.assisted].push({x: kill.time / 60, y: data[kill.assisted][data[kill.assisted].length - 1].y + 1});
                            }
                        }
                        max = Math.max(max, kill.time);
                    }

                    for (const player of ArchiveJs.game.players) {
                        if (data[player.name][data[player.name].length - 1].x !== max / 60) {
                            data[player.name].push({x: max / 60, y: data[player.name][data[player.name].length - 1].y});
                        }
                    }

                    datasets = Object.keys(data).map((player, i) => ({
                        label: player,
                        data: data[player],
                        borderColor: ArchiveJs.getAnarchyColor(i),
                        borderWidth: 1,
                        backgroundColor: ArchiveJs.getAnarchyColor(i),
                        pointRadius: 2,
                        stepped: true
                    }));
                } else if (ArchiveJs.game.settings.matchMode === "TEAM ANARCHY") {
                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        data[team] = [{x: 0, y: 0}];
                        data[`${team} ASSISTS`] = [{x: 0, y: 0}];
                    }

                    for (const kill of ArchiveJs.game.kills.sort((a, b) => a.time - b.time)) {
                        if (kill.attackerTeam === kill.defenderTeam) {
                            data[kill.attackerTeam].push({x: kill.time / 60, y: data[kill.attackerTeam][data[kill.attackerTeam].length - 1].y - 1});
                        } else {
                            data[kill.attackerTeam].push({x: kill.time / 60, y: data[kill.attackerTeam][data[kill.attackerTeam].length - 1].y + 1});
                            if (kill.assisted) {
                                data[`${kill.attackerTeam} ASSISTS`].push({x: kill.time / 60, y: data[`${kill.attackerTeam} ASSISTS`][data[`${kill.attackerTeam} ASSISTS`].length - 1].y + 1});
                            }
                        }
                        max = Math.max(max, kill.time);
                    }

                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        if (data[team][data[team].length - 1].x !== max / 60) {
                            data[team].push({x: max / 60, y: data[team][data[team].length - 1].y});
                        }
                        if (data[`${team} ASSISTS`][data[`${team} ASSISTS`].length - 1].x !== max / 60) {
                            data[`${team} ASSISTS`].push({x: max / 60, y: data[`${team} ASSISTS`][data[`${team} ASSISTS`].length - 1].y});
                        }
                    }

                    datasets = Object.keys(data).map((team) => ({
                        label: team,
                        data: data[team],
                        borderColor: ArchiveJs.getColor(team.replace(" ASSISTS", "")),
                        borderWidth: 1,
                        backgroundColor: ArchiveJs.getColor(team.replace(" ASSISTS", "")),
                        pointRadius: 2,
                        borderDash: team.endsWith(" ASSISTS") ? [2, 2] : void 0,
                        stepped: true
                    }));
                } else if (ArchiveJs.game.settings.matchMode === "CTF") {
                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        data[team] = [{x: 0, y: 0}];
                    }

                    for (const flag of ArchiveJs.game.flagStats.sort((a, b) => a.time - b.time)) {
                        if (flag.event === "Capture" && data[flag.scorerTeam]) {
                            data[flag.scorerTeam].push({x: flag.time / 60, y: data[flag.scorerTeam][data[flag.scorerTeam].length - 1].y + 1});
                        }
                        max = Math.max(max, flag.time);
                    }

                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        if (data[team][data[team].length - 1].x !== max / 60) {
                            data[team].push({x: max / 60, y: data[team][data[team].length - 1].y});
                        }
                    }

                    datasets = Object.keys(data).map((team) => ({
                        label: team,
                        data: data[team],
                        borderColor: ArchiveJs.getColor(team),
                        borderWidth: 1,
                        backgroundColor: ArchiveJs.getColor(team),
                        pointRadius: 2,
                        stepped: true
                    }));
                } else if (ArchiveJs.game.settings.matchMode === "MONSTERBALL") {
                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        data[team] = [{x: 0, y: 0}];
                        data[`${team} ASSISTS`] = [{x: 0, y: 0}];
                    }

                    for (const goal of ArchiveJs.game.goals.sort((a, b) => a.time - b.time)) {
                        if (goal.blunder) {
                            const team = Object.keys(ArchiveJs.game.teamScore).find((s) => s !== goal.scorerTeam);
                            if (data[team]) {
                                data[team].push({x: goal.time / 60, y: data[team][data[team].length - 1].y + 1});
                            }
                        } else if (data[goal.scorerTeam]) {
                            data[goal.scorerTeam].push({x: goal.time / 60, y: data[goal.scorerTeam][data[goal.scorerTeam].length - 1].y + 1});
                            if (goal.assisted) {
                                data[`${goal.scorerTeam} ASSISTS`].push({x: goal.time / 60, y: data[`${goal.scorerTeam} ASSISTS`][data[`${goal.scorerTeam} ASSISTS`].length - 1].y + 1});
                            }
                        }
                        max = Math.max(max, goal.time);
                    }

                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        if (data[team][data[team].length - 1].x !== max / 60) {
                            data[team].push({x: max / 60, y: data[team][data[team].length - 1].y});
                        }
                        if (data[`${team} ASSISTS`][data[`${team} ASSISTS`].length - 1].x !== max / 60) {
                            data[`${team} ASSISTS`].push({x: max / 60, y: data[`${team} ASSISTS`][data[`${team} ASSISTS`].length - 1].y});
                        }
                    }

                    datasets = Object.keys(data).map((team) => ({
                        label: team,
                        data: data[team],
                        borderColor: ArchiveJs.getColor(team.replace(" ASSISTS", "")),
                        borderWidth: 1,
                        backgroundColor: ArchiveJs.getColor(team.replace(" ASSISTS", "")),
                        pointRadius: 2,
                        borderDash: team.endsWith(" ASSISTS") ? [2, 2] : void 0,
                        stepped: true
                    }));
                }

                return new ArchiveJs.Chart(chart, {
                    type: "line",
                    data: {
                        datasets
                    },
                    options: {
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                }
                            },
                            tooltip: {
                                titleFont: {
                                    family: "Industry Medium",
                                    weight: "bold"
                                },
                                bodyFont: {
                                    family: "Industry Medium"
                                },
                                callbacks: {
                                    title: (context) => `${ArchiveJs.minutesToTime(+context[0].parsed.x)}`,
                                    label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(0)}`
                                }
                            }
                        },
                        scales: {
                            x: {
                                type: "linear",
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                },
                                grid: {
                                    color: "#333333",
                                    drawTicks: false
                                }
                            },
                            y: {
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                },
                                grid: {
                                    color: "#333333",
                                    drawTicks: false
                                }
                            }
                        }
                    }
                });
            }
            case "differential": {
                /** @type {ArchiveTypes.DifferentialDataset} */
                const data = {};

                const numPlayers = ArchiveJs.game.players.length;

                let max = 0,
                    datasets;

                if (!ArchiveJs.game.settings || ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1) {
                    for (const player of ArchiveJs.game.players) {
                        data[player.name] = [{x: 0, y: 0}];
                    }

                    for (const kill of ArchiveJs.game.kills.sort((a, b) => a.time - b.time)) {
                        if (kill.attacker === kill.defender) {
                            data[kill.attacker].push({x: kill.time / 60, y: data[kill.attacker][data[kill.attacker].length - 1].y - (numPlayers > 2 ? 3 : 1)});
                        } else {
                            data[kill.attacker].push({x: kill.time / 60, y: data[kill.attacker][data[kill.attacker].length - 1].y + (numPlayers > 2 ? 3 : 1)});
                            if (kill.assisted) {
                                data[kill.assisted].push({x: kill.time / 60, y: data[kill.assisted][data[kill.assisted].length - 1].y + 1});
                            }
                        }
                        max = Math.max(max, kill.time);
                    }

                    for (const player of ArchiveJs.game.players) {
                        if (data[player.name][data[player.name].length - 1].x !== max / 60) {
                            data[player.name].push({x: max / 60, y: data[player.name][data[player.name].length - 1].y});
                        }
                    }

                    const differential = ArchiveJs.getDifferential(data);

                    datasets = Object.keys(data).map((player, i) => ({
                        label: player,
                        data: differential[player],
                        borderColor: ArchiveJs.getAnarchyColor(i),
                        borderWidth: 1,
                        backgroundColor: ArchiveJs.getAnarchyColor(i),
                        pointRadius: 2,
                        stepped: true
                    }));
                } else if (ArchiveJs.game.settings.matchMode === "TEAM ANARCHY") {
                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        data[team] = [{x: 0, y: 0}];
                    }

                    for (const kill of ArchiveJs.game.kills.sort((a, b) => a.time - b.time)) {
                        if (kill.attackerTeam === kill.defenderTeam) {
                            data[kill.attackerTeam].push({x: kill.time / 60, y: data[kill.attackerTeam][data[kill.attackerTeam].length - 1].y - 1});
                        } else {
                            data[kill.attackerTeam].push({x: kill.time / 60, y: data[kill.attackerTeam][data[kill.attackerTeam].length - 1].y + 1});
                        }
                        max = Math.max(max, kill.time);
                    }

                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        if (data[team][data[team].length - 1].x !== max / 60) {
                            data[team].push({x: max / 60, y: data[team][data[team].length - 1].y});
                        }
                    }

                    const differential = ArchiveJs.getDifferential(data);

                    datasets = Object.keys(data).map((team) => ({
                        label: team,
                        data: differential[team],
                        borderColor: ArchiveJs.getColor(team),
                        borderWidth: 1,
                        backgroundColor: ArchiveJs.getColor(team),
                        pointRadius: 2,
                        stepped: true
                    }));
                } else if (ArchiveJs.game.settings.matchMode === "CTF") {
                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        data[team] = [{x: 0, y: 0}];
                    }

                    for (const flag of ArchiveJs.game.flagStats.sort((a, b) => a.time - b.time)) {
                        if (flag.event === "Capture" && data[flag.scorerTeam]) {
                            data[flag.scorerTeam].push({x: flag.time / 60, y: data[flag.scorerTeam][data[flag.scorerTeam].length - 1].y + 1});
                        }
                        max = Math.max(max, flag.time);
                    }

                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        if (data[team][data[team].length - 1].x !== max / 60) {
                            data[team].push({x: max / 60, y: data[team][data[team].length - 1].y});
                        }
                    }

                    const differential = ArchiveJs.getDifferential(data);

                    datasets = Object.keys(data).map((team) => ({
                        label: team,
                        data: differential[team],
                        borderColor: ArchiveJs.getColor(team),
                        borderWidth: 1,
                        backgroundColor: ArchiveJs.getColor(team),
                        pointRadius: 2,
                        stepped: true
                    }));
                } else if (ArchiveJs.game.settings.matchMode === "MONSTERBALL") {
                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        data[team] = [{x: 0, y: 0}];
                    }

                    for (const goal of ArchiveJs.game.goals.sort((a, b) => a.time - b.time)) {
                        if (goal.blunder) {
                            const team = Object.keys(ArchiveJs.game.teamScore).find((s) => s !== goal.scorerTeam);
                            if (data[team]) {
                                data[team].push({x: goal.time / 60, y: data[team][data[team].length - 1].y + 1});
                            }
                        } else if (data[goal.scorerTeam]) {
                            data[goal.scorerTeam].push({x: goal.time / 60, y: data[goal.scorerTeam][data[goal.scorerTeam].length - 1].y + 1});
                        }
                        max = Math.max(max, goal.time);
                    }

                    for (const team of Object.keys(ArchiveJs.game.teamScore)) {
                        if (data[team][data[team].length - 1].x !== max / 60) {
                            data[team].push({x: max / 60, y: data[team][data[team].length - 1].y});
                        }
                    }

                    const differential = ArchiveJs.getDifferential(data);

                    datasets = Object.keys(data).map((team) => ({
                        label: team,
                        data: differential[team],
                        borderColor: ArchiveJs.getColor(team),
                        borderWidth: 1,
                        backgroundColor: ArchiveJs.getColor(team),
                        pointRadius: 2,
                        stepped: true
                    }));
                }

                return new ArchiveJs.Chart(chart, {
                    type: "line",
                    data: {
                        datasets
                    },
                    options: {
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                }
                            },
                            tooltip: {
                                titleFont: {
                                    family: "Industry Medium",
                                    weight: "bold"
                                },
                                bodyFont: {
                                    family: "Industry Medium"
                                },
                                callbacks: {
                                    title: (context) => `${ArchiveJs.minutesToTime(+context[0].parsed.x)}`,
                                    label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(0)}`
                                }
                            }
                        },
                        scales: {
                            x: {
                                type: "linear",
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                },
                                grid: {
                                    color: "#333333",
                                    drawTicks: false
                                }
                            },
                            y: {
                                ticks: {
                                    font: {
                                        family: "Industry Medium"
                                    },
                                    color: "white"
                                },
                                grid: {
                                    color: "#333333",
                                    drawTicks: false
                                }
                            }
                        }
                    }
                });
            }
            default:
                return void 0;
        }
    }

    //                                      ##                     #      ##   #                  #
    //                                     #  #                    #     #  #  #                  #
    // #  #   ##    ###  ###    ##   ###   #     ###    ###  ###   ###   #     ###    ###  ###   ###
    // #  #  # ##  #  #  #  #  #  #  #  #  # ##  #  #  #  #  #  #  #  #  #     #  #  #  #  #  #   #
    // ####  ##    # ##  #  #  #  #  #  #  #  #  #     # ##  #  #  #  #  #  #  #  #  # ##  #      #
    // ####   ##    # #  ###    ##   #  #   ###  #      # #  ###   #  #   ##   #  #   # #  #       ##
    //                   #                                   #
    /**
     * Shows a weapon graph chart.
     * @param {HTMLCanvasElement} chart The chart element.
     * @param {string} weapon The weapon.
     * @returns {InstanceType<ChartJs.Chart>} The chart.
     */
    static weaponGraphChart(chart, weapon) {
        const damage = ArchiveJs.game.players.map((player) => ({name: player.name, team: player.team, damage: ArchiveJs.game.damage.filter((d) => d.weapon === weapon && d.attacker === player.name && d.defender !== player.name && (ArchiveJs.game.settings && ["TEAM ANARCHY", "CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1 || ArchiveJs.game.players.find((p) => p.name === d.defender).team !== player.team)).reduce((total, dmg) => total + dmg.damage, 0) || 0}));

        return new ArchiveJs.Chart(chart, {
            type: "bar",
            data: {
                labels: ArchiveJs.game.players.map((player) => player.name),
                datasets: [
                    {
                        label: weapon,
                        data: damage.map((d) => d.damage),
                        backgroundColor: damage.map((d) => ArchiveJs.getColor(d.team))
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: "Industry Medium"
                            },
                            color: "white",
                            boxWidth: 0,
                            boxHeight: 0
                        }
                    },
                    tooltip: {
                        titleFont: {
                            family: "Industry Medium",
                            weight: "bold"
                        },
                        bodyFont: {
                            family: "Industry Medium"
                        },
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(0)}`
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            font: {
                                family: "Industry Medium"
                            },
                            color: ArchiveJs.game.players.map((player) => ArchiveJs.getColor(player.team))
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            font: {
                                family: "Industry Medium"
                            },
                            color: "white"
                        },
                        grid: {
                            color: "#333333",
                            drawTicks: false
                        }
                    }
                }
            }
        });
    }

    //       ##                             ##                     #      ##   #                  #
    //        #                            #  #                    #     #  #  #                  #
    // ###    #     ###  #  #   ##   ###   #     ###    ###  ###   ###   #     ###    ###  ###   ###
    // #  #   #    #  #  #  #  # ##  #  #  # ##  #  #  #  #  #  #  #  #  #     #  #  #  #  #  #   #
    // #  #   #    # ##   # #  ##    #     #  #  #     # ##  #  #  #  #  #  #  #  #  # ##  #      #
    // ###   ###    # #    #    ##   #      ###  #      # #  ###   #  #   ##   #  #   # #  #       ##
    // #                  #                                  #
    /**
     * Shows a weapon graph chart.
     * @param {HTMLCanvasElement} chart The chart element.
     * @param {string} player The player.
     * @returns {InstanceType<ChartJs.Chart>} The chart.
     */
    static playerGraphChart(chart, player) {
        const data = {};

        let max = 0,
            datasets;

        if (!ArchiveJs.game.settings || ["CTF", "MONSTERBALL"].indexOf(ArchiveJs.game.settings.matchMode) === -1) {
            data.Kills = [{x: 0, y: 0}];
            data.Deaths = [{x: 0, y: 0}];
            data.Assists = [{x: 0, y: 0}];

            for (const kill of ArchiveJs.game.kills.sort((a, b) => a.time - b.time)) {
                if (kill.attacker === player) {
                    if (kill.attacker === kill.defender) {
                        data.Kills.push({x: kill.time / 60, y: data.Kills[data.Kills.length - 1].y - 1});
                    } else {
                        data.Kills.push({x: kill.time / 60, y: data.Kills[data.Kills.length - 1].y + 1});
                    }
                }
                if (kill.assisted === player) {
                    data.Assists.push({x: kill.time / 60, y: data.Assists[data.Assists.length - 1].y + 1});
                }
                if (kill.defender === player) {
                    data.Deaths.push({x: kill.time / 60, y: data.Deaths[data.Deaths.length - 1].y + 1});
                }
                max = Math.max(max, kill.time);
            }

            for (const ev of Object.keys(data)) {
                if (data[ev][data[ev].length - 1].x !== max / 60) {
                    data[ev].push({x: max / 60, y: data[ev][data[ev].length - 1].y});
                }
            }

            datasets = Object.keys(data).map((ev) => ({
                label: ev,
                data: data[ev],
                borderColor: ev === "Kills" ? "#00cc00" : ev === "Deaths" ? "#ff0000" : "#ffffff",
                borderWidth: 1,
                backgroundColor: ev === "Kills" ? "#00cc00" : ev === "Deaths" ? "#ff0000" : "#ffffff",
                borderDash: ev === "Assists" ? [2, 2] : void 0,
                pointRadius: 2,
                stepped: true
            }));
        } else if (ArchiveJs.game.settings.matchMode === "CTF") {
            data.Kills = [{x: 0, y: 0}];
            data.Deaths = [{x: 0, y: 0}];
            data.Assists = [{x: 0, y: 0}];
            data.Captures = [{x: 0, y: 0}];
            data.Pickups = [{x: 0, y: 0}];
            data["Carrier Kills"] = [{x: 0, y: 0}];
            data.Returns = [{x: 0, y: 0}];

            for (const kill of ArchiveJs.game.kills.sort((a, b) => a.time - b.time)) {
                if (kill.attacker === player) {
                    if (kill.attacker === kill.defender) {
                        data.Kills.push({x: kill.time / 60, y: data.Kills[data.Kills.length - 1].y - 1});
                    } else {
                        data.Kills.push({x: kill.time / 60, y: data.Kills[data.Kills.length - 1].y + 1});
                    }
                }
                if (kill.assisted === player) {
                    data.Assists.push({x: kill.time / 60, y: data.Assists[data.Assists.length - 1].y + 1});
                }
                if (kill.defender === player) {
                    data.Deaths.push({x: kill.time / 60, y: data.Deaths[data.Deaths.length - 1].y + 1});
                }
                max = Math.max(max, kill.time);
            }

            for (const stat of ArchiveJs.game.flagStats.sort((a, b) => a.time - b.time)) {
                if (stat.scorer === player) {
                    if (stat.event === "Capture") {
                        data.Captures.push({x: stat.time / 60, y: data.Captures[data.Captures.length - 1].y + 1});
                    } else if (stat.event === "Pickup") {
                        data.Pickups.push({x: stat.time / 60, y: data.Pickups[data.Pickups.length - 1].y + 1});
                    } else if (stat.event === "CarrierKill") {
                        data["Carrier Kills"].push({x: stat.time / 60, y: data["Carrier Kills"][data["Carrier Kills"].length - 1].y + 1});
                    } else if (stat.event === "Return") {
                        data.Returns.push({x: stat.time / 60, y: data.Returns[data.Returns.length - 1].y + 1});
                    }
                }
            }

            for (const ev of Object.keys(data)) {
                if (data[ev][data[ev].length - 1].x !== max / 60) {
                    data[ev].push({x: max / 60, y: data[ev][data[ev].length - 1].y});
                }
            }

            datasets = Object.keys(data).map((ev) => ({
                label: ev,
                data: data[ev],
                borderColor: ["Kills", "Captures"].indexOf(ev) === -1 ? ev === "Deaths" ? "#ff0000" : ev === "Pickups" ? "#0066ff" : ev === "Carrier Kills" ? "#ffff00" : ev === "Returns" ? "#ff6600" : "#ffffff" : "#00cc00",
                borderWidth: 1,
                backgroundColor: ["Kills", "Captures"].indexOf(ev) === -1 ? ev === "Deaths" ? "#ff0000" : ev === "Pickups" ? "#0066ff" : ev === "Carrier Kills" ? "#ffff00" : ev === "Returns" ? "#ff6600" : "#ffffff" : "#00cc00",
                borderDash: ["Kills", "Deaths", "Assists", "Carrier Kills", "Pickups", "Returns"].indexOf(ev) === -1 ? void 0 : [2, 2],
                pointRadius: 2,
                stepped: true
            }));
        } else if (ArchiveJs.game.settings.matchMode === "MONSTERBALL") {
            data.Kills = [{x: 0, y: 0}];
            data.Deaths = [{x: 0, y: 0}];
            data.Assists = [{x: 0, y: 0}];
            data.Goals = [{x: 0, y: 0}];
            data["Goal Assists"] = [{x: 0, y: 0}];
            data.Blunders = [{x: 0, y: 0}];

            for (const kill of ArchiveJs.game.kills.sort((a, b) => a.time - b.time)) {
                if (kill.attacker === player) {
                    if (kill.attacker === kill.defender) {
                        data.Kills.push({x: kill.time / 60, y: data.Kills[data.Kills.length - 1].y - 1});
                    } else {
                        data.Kills.push({x: kill.time / 60, y: data.Kills[data.Kills.length - 1].y + 1});
                    }
                }
                if (kill.assisted === player) {
                    data.Assists.push({x: kill.time / 60, y: data.Assists[data.Assists.length - 1].y + 1});
                }
                if (kill.defender === player) {
                    data.Deaths.push({x: kill.time / 60, y: data.Deaths[data.Deaths.length - 1].y + 1});
                }
                max = Math.max(max, kill.time);
            }

            for (const goal of ArchiveJs.game.goals.sort((a, b) => a.time - b.time)) {
                if (goal.scorer === player) {
                    if (goal.blunder) {
                        data.Blunders.push({x: goal.time / 60, y: data.Blunders[data.Blunders.length - 1].y + 1});
                    } else {
                        data.Goals.push({x: goal.time / 60, y: data.Goals[data.Goals.length - 1].y + 1});
                    }
                }
                if (goal.assisted === player) {
                    data["Goal Assists"].push({x: goal.time / 60, y: data["Goal Assists"][data["Goal Assists"].length - 1].y + 1});
                }
            }

            for (const ev of Object.keys(data)) {
                if (data[ev][data[ev].length - 1].x !== max / 60) {
                    data[ev].push({x: max / 60, y: data[ev][data[ev].length - 1].y});
                }
            }

            datasets = Object.keys(data).map((ev) => ({
                label: ev,
                data: data[ev],
                borderColor: ["Kills", "Goals"].indexOf(ev) === -1 ? ["Deaths", "Blunders"].indexOf(ev) === -1 ? "#ffffff" : "#ff0000" : "#00cc00",
                borderWidth: 1,
                backgroundColor: ["Kills", "Goals"].indexOf(ev) === -1 ? ["Deaths", "Blunders"].indexOf(ev) === -1 ? "#ffffff" : "#ff0000" : "#00cc00",
                borderDash: ["Kills", "Deaths", "Assists"].indexOf(ev) === -1 ? void 0 : [2, 2],
                pointRadius: 2,
                stepped: true
            }));
        }

        return new ArchiveJs.Chart(chart, {
            type: "line",
            data: {
                datasets
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: "Industry Medium"
                            },
                            color: "white"
                        }
                    },
                    tooltip: {
                        titleFont: {
                            family: "Industry Medium",
                            weight: "bold"
                        },
                        bodyFont: {
                            family: "Industry Medium"
                        },
                        callbacks: {
                            title: (context) => `${ArchiveJs.minutesToTime(+context[0].parsed.x)}`,
                            label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(0)}`
                        }
                    }
                },
                scales: {
                    x: {
                        type: "linear",
                        ticks: {
                            font: {
                                family: "Industry Medium"
                            },
                            color: "white"
                        },
                        grid: {
                            color: "#333333",
                            drawTicks: false
                        }
                    },
                    y: {
                        ticks: {
                            font: {
                                family: "Industry Medium"
                            },
                            color: "white"
                        },
                        grid: {
                            color: "#333333",
                            drawTicks: false
                        }
                    }
                }
            }
        });
    }

    //              #     ##                           #            ##         ##
    //              #    #  #                          #           #  #         #
    //  ###   ##   ###   #  #  ###    ###  ###    ##   ###   #  #  #      ##    #     ##   ###
    // #  #  # ##   #    ####  #  #  #  #  #  #  #     #  #  #  #  #     #  #   #    #  #  #  #
    //  ##   ##     #    #  #  #  #  # ##  #     #     #  #   # #  #  #  #  #   #    #  #  #
    // #      ##     ##  #  #  #  #   # #  #      ##   #  #    #    ##    ##   ###    ##   #
    //  ###                                                   #
    /**
     * Gets a random anarchy color for a player.
     * @param {number} index The index.
     * @returns {string} The color.
     */
    static getAnarchyColor(index) {
        switch (index) {
            case 0:
                return "#850000";
            case 1:
                return "#ffd700";
            case 2:
                return "#0000ff";
            case 3:
                return "#ff4500";
            case 4:
                return "#25dcfc";
            case 5:
                return "#ff00ff";
            case 6:
                return "#ff0000";
            case 7:
                return "#f0e68c";
            case 8:
                return "#4169eb";
            case 9:
                return "#ffa500";
            case 10:
                return "#006400";
            case 11:
                return "#32cd32";
            case 12:
                return "#e9386d";
            case 13:
                return "#696969";
            case 14:
                return "#008080";
            case 15:
                return "#ffffff";
            default:
                return "white";
        }
    }

    //              #     ##         ##
    //              #    #  #         #
    //  ###   ##   ###   #      ##    #     ##   ###
    // #  #  # ##   #    #     #  #   #    #  #  #  #
    //  ##   ##     #    #  #  #  #   #    #  #  #
    // #      ##     ##   ##    ##   ###    ##   #
    //  ###
    /**
     * Gets the color from the team name.
     * @param {string} team The team.
     * @returns {string} The color.
     */
    static getColor(team) {
        switch (team) {
            case "AQUA":
                return "#00ffff";
            case "BLUE":
                return "#0066ff";
            case "GREEN":
                return "#00ff00";
            case "PINK":
                return "#ff0066";
            case "PURPLE":
                return "#6600ff";
            case "RED":
                return "#ff0000";
            case "WHITE":
                return "#ffffff";
            case "ORANGE":
            default:
                return "#ff6600";
        }
    }

    //              #    ###    #      #     #                            #     #          ##
    //              #    #  #         # #   # #                           #                 #
    //  ###   ##   ###   #  #  ##     #     #     ##   ###    ##   ###   ###   ##     ###   #
    // #  #  # ##   #    #  #   #    ###   ###   # ##  #  #  # ##  #  #   #     #    #  #   #
    //  ##   ##     #    #  #   #     #     #    ##    #     ##    #  #   #     #    # ##   #
    // #      ##     ##  ###   ###    #     #     ##   #      ##   #  #    ##  ###    # #  ###
    //  ###
    /**
     * Gets the differential stats from a dataset.
     * @param {ArchiveTypes.DifferentialDataset} data The dataset.
     * @returns {ArchiveTypes.DifferentialDataset} The differential dataset.
     */
    static getDifferential(data) {
        /** @type {ArchiveTypes.DifferentialDataset} */
        const differential = {};

        const entities = Object.keys(data),
            index = {};
        let time = 0;

        for (const entity of entities) {
            differential[entity] = [{x: 0, y: 0}];
            index[entity] = 1;
        }

        for (;;) {
            // Find next time entry, bail if there is none.
            let minTime = Infinity;

            for (const entity of entities) {
                if (data[entity].length > index[entity] && data[entity][index[entity]].x < minTime) {
                    minTime = data[entity][index[entity]].x;
                }
            }

            if (minTime === Infinity) {
                break;
            }

            time = minTime;

            // Get the latest score for all time entries.
            const scores = [];

            for (const entity of entities) {
                const stats = data[entity].filter((stat) => stat.x <= minTime);
                index[entity] = stats.length;
                scores.push({entity, y: stats[stats.length - 1].y});
            }

            // Add to differentials if it is different from the last differential entry.
            scores.sort((a, b) => b.y - a.y);

            const top = scores[0].y;
            let first = false;

            for (const score of scores) {
                const y = first ? score.y - top : 0;
                first = true;

                if (differential[score.entity][differential[score.entity].length - 1].y !== y) {
                    differential[score.entity].push({x: time, y});
                }
            }
        }

        for (const entity of Object.keys(differential)) {
            if (differential[entity][differential[entity].length - 1].x !== time) {
                differential[entity].push({x: time, y: differential[entity][differential[entity].length - 1].y});
            }
        }

        return differential;
    }

    //              #    ###
    //              #     #
    //  ###   ##   ###    #    #  #  ###    ##
    // #  #  # ##   #     #    #  #  #  #  # ##
    //  ##   ##     #     #     # #  #  #  ##
    // #      ##     ##   #      #   ###    ##
    //  ###                     #    #
    /**
     * Gets a weapon type by a weapon
     * @param {string} weapon The weapon
     * @returns {string} The weapon type.
     */
    static getType(weapon) {
        switch (weapon) {
            case "Impulse":
            case "Cyclone":
            case "Reflex":
            case "Driller":
            case "Crusher":
            case "Flak":
            case "Thunderbolt":
            case "Lancer":
                return "Primary";
            case "Falcon":
            case "Hunter":
            case "Missile Pod":
            case "Creeper":
            case "Nova":
            case "Time Bomb":
            case "Devastator":
            case "Vortex":
                return "Secondary";
            default:
                return "Miscellaneous";
        }
    }

    //        #                 #                 ###         ###    #
    //                          #                  #           #
    // # #   ##    ###   #  #  ###    ##    ###    #     ##    #    ##    # #    ##
    // ####   #    #  #  #  #   #    # ##  ##      #    #  #   #     #    ####  # ##
    // #  #   #    #  #  #  #   #    ##      ##    #    #  #   #     #    #  #  ##
    // #  #  ###   #  #   ###    ##   ##   ###     #     ##    #    ###   #  #   ##
    /**
     * Converts minutes to a timestamp.
     * @param {number} minutes The number of minutes.
     * @returns {string} The timestamp.
     */
    static minutesToTime(minutes) {
        const milliseconds = Math.floor(minutes * 60 * 1000);

        return `${Math.floor(milliseconds / 60000)}:${Math.floor(milliseconds % 60000 / 1000).toFixed(0).padStart(2, "0")}.${(milliseconds % 1000).toFixed(0).padStart(3, "0")}`;
    }
}

/** @type {Game} */
ArchiveJs.game = null;

/** @type {InstanceType<ChartJs.Chart>} */
ArchiveJs.damageChartObj = null;

/** @type {InstanceType<ChartJs.Chart>} */
ArchiveJs.gameChartObj = null;

/** @type {InstanceType<ChartJs.Chart>} */
ArchiveJs.playerChartObj = null;

/** @type {InstanceType<ChartJs.Chart>} */
ArchiveJs.weaponChartObj = null;

document.addEventListener("DOMContentLoaded", ArchiveJs.DOMContentLoaded);

/** @type {ChartJs.Chart} */
// @ts-ignore
ArchiveJs.Chart = typeof Chart === "undefined" ? require("../../node_modules/chart.js/dist/chart") : Chart; // eslint-disable-line no-undef

/** @type {typeof import("./common/time")} */
// @ts-ignore
ArchiveJs.Time = typeof Time === "undefined" ? require("./common/time") : Time; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.ArchiveJs = ArchiveJs;
} else {
    module.exports = ArchiveJs; // eslint-disable-line no-undef
}
