// Get databases.
const admin = db.getSiblingDB("admin");
const tracker = db.getSiblingDB("tracker");

// Set profiling to minimum level.
admin.setProfilingLevel(0);
tracker.setProfilingLevel(0);

// Create web user for access.
admin.createUser({
    user: "web_tracker",
    pwd: WEB_TRACKER_PASSWORD,
    roles: [{
        role: "readWrite",
        db: "tracker"
    }],
    mechanisms: ["SCRAM-SHA-256"]
});

// Create counters collection.
tracker.createCollection("counters", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "value"],
            additionalProperties: false,
            properties: {
                _id: {
                    bsonType: "string"
                },
                value: {
                    bsonType: "long"
                }
            }
        }
    }
});

tracker.counters.insert([
    {_id: "completed", value: NumberLong(0)},
]);

// Create completed collection.
tracker.createCollection("completed", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "ipAddress", "dateAdded", "data"],
            additionalProperties: false,
            properties: {
                _id: {
                    bsonType: "long"
                },
                ipAddress: {
                    bsonType: "string"
                },
                dateAdded: {
                    bsonType: "date"
                },
                data: {
                    bsonType: "object",
                    additionalProperties: true,
                    properties: {
                        ip: {
                            bsonType: "string"
                        },
                        settings: {
                            bsonType: "object",
                            additionalProperties: true,
                            properties: {
                                creator: {
                                    bsonType: "string"
                                },
                                forceModifier1: {
                                    bsonType: "string"
                                },
                                forceModifier2: {
                                    bsonType: "string"
                                },
                                forceMissile1: {
                                    bsonType: "string"
                                },
                                forceMissile2: {
                                    bsonType: "string"
                                },
                                forceWeapon1: {
                                    bsonType: "string"
                                },
                                forceWeapon2: {
                                    bsonType: "string"
                                },
                                forceLoadout: {
                                    bsonType: "string"
                                },
                                powerupFilterBitmask: {
                                    bsonType: "int"
                                },
                                powerupBigSpawn: {
                                    bsonType: "string"
                                },
                                powerupInitial: {
                                    bsonType: "string"
                                },
                                turnSpeedLimit: {
                                    bsonType: "string"
                                },
                                powerupSpawn: {
                                    bsonType: "string"
                                },
                                friendlyFire: {
                                    bsonType: "bool"
                                },
                                matchMode: {
                                    bsonType: "string"
                                },
                                maxPlayers: {
                                    bsonType: "int"
                                },
                                showEnemyNames: {
                                    bsonType: "string"
                                },
                                timeLimit: {
                                    bsonType: "int"
                                },
                                scoreLimit: {
                                    bsonType: "int"
                                },
                                respawnTimeSeconds: {
                                    bsonType: "int"
                                },
                                respawnShieldTimeSeconds: {
                                    bsonType: "int"
                                },
                                level: {
                                    bsonType: "string"
                                },
                                joinInProgress: {
                                    bsonType: "bool"
                                },
                                rearViewAllowed: {
                                    bsonType: "bool"
                                },
                                teamCount: {
                                    bsonType: "int"
                                },
                                players: {
                                    bsonType: "array",
                                    minItems: 0,
                                    uniqueItems: true,
                                    additionalProperties: false,
                                    items: {
                                        bsonType: "string"
                                    }
                                },
                                hasPassword: {
                                    bsonType: "bool"
                                },
                                matchNotes: {
                                    bsonType: "string"
                                },
                                classicSpawnsEnabled: {
                                    bsonType: "bool"
                                },
                                ctfCarrierBoostEnabled: {
                                    bsonType: "bool"
                                },
                                suddenDeath: {
                                    bsonType: "bool"
                                }
                            }
                        },
                        server: {
                            bsonType: "object",
                            required: ["ip"],
                            additionalProperties: true,
                            properties: {
                                ip: {
                                    bsonType: "string"
                                },
                                keepListed: {
                                    bsonType: "bool"
                                },
                                name: {
                                    bsonType: "string"
                                },
                                notes: {
                                    bsonType: "string"
                                },
                                version: {
                                    bsonType: "string"
                                },
                                numPlayers: {
                                    bsonType: "int"
                                },
                                maxNumPlayers: {
                                    bsonType: "int"
                                },
                                map: {
                                    bsonType: "string"
                                },
                                mode: {
                                    bsonType: "string"
                                },
                                lastSeen: {
                                    bsonType: "date"
                                },
                                gameStarted: {
                                    bsonType: "date"
                                },
                                old: {
                                    bsonType: "bool"
                                }
                            }
                        },
                        start: {
                            bsonType: "date"
                        },
                        end: {
                            bsonType: "date"
                        },
                        players: {
                            bsonType: "array",
                            minItems: 0,
                            uniqueItems: true,
                            additionalProperties: false,
                            items: {
                                bsonType: "object",
                                required: ["name"],
                                additionalProperties: false,
                                properties: {
                                    name: {
                                        bsonType: "string"
                                    },
                                    team: {
                                        bsonType: "string"
                                    },
                                    kills: {
                                        bsonType: "int"
                                    },
                                    assists: {
                                        bsonType: "int"
                                    },
                                    deaths: {
                                        bsonType: "int"
                                    },
                                    goals: {
                                        bsonType: "int"
                                    },
                                    goalAssists: {
                                        bsonType: "int"
                                    },
                                    blunders: {
                                        bsonType: "int"
                                    },
                                    returns: {
                                        bsonType: "int"
                                    },
                                    pickups: {
                                        bsonType: "int"
                                    },
                                    captures: {
                                        bsonType: "int"
                                    },
                                    carrierKills: {
                                        bsonType: "int"
                                    },
                                    connected: {
                                        bsonType: "bool"
                                    },
                                    disconnected: {
                                        bsonType: "bool"
                                    },
                                    timeInGame: {
                                        bsonType: "double"
                                    }
                                }
                            }
                        },
                        kills: {
                            bsonType: "array",
                            minItems: 0,
                            uniqueItems: true,
                            additionalProperties: false,
                            items: {
                                bsonType: "object",
                                required: ["attacker", "defender", "time", "weapon"],
                                additionalProperties: true,
                                properties: {
                                    attackder: {
                                        bsonType: "string"
                                    },
                                    attackerTeam: {
                                        bsonType: "string"
                                    },
                                    defender: {
                                        bsonType: "string"
                                    },
                                    defenderTeam: {
                                        bsonType: "string"
                                    },
                                    assisted: {
                                        bsonType: "string"
                                    },
                                    assistedTeam: {
                                        bsonType: "string"
                                    },
                                    time: {
                                        bsonType: "double"
                                    },
                                    weapon: {
                                        bsonType: "string"
                                    }
                                }
                            }
                        },
                        goals: {
                            bsonType: "array",
                            minItems: 0,
                            uniqueItems: true,
                            additionalProperties: false,
                            items: {
                                bsonType: "object",
                                required: ["scorer", "scorerTeam", "time"],
                                additionalProperties: true,
                                properties: {
                                    blunder: {
                                        bsonType: "bool"
                                    },
                                    scorer: {
                                        bsonType: "string"
                                    },
                                    scorerTeam: {
                                        bsonType: "string"
                                    },
                                    assisted: {
                                        bsonType: "string"
                                    },
                                    assistedTeam: {
                                        bsonType: "string"
                                    },
                                    time: {
                                        bsonType: "double"
                                    }
                                }
                            }
                        },
                        flagStats: {
                            bsonType: "array",
                            minItems: 0,
                            uniqueItems: true,
                            additionalProperties: false,
                            items: {
                                bsonType: "object",
                                required: ["event", "scorer", "scorerTeam", "time"],
                                additionalProperties: true,
                                properties: {
                                    event: {
                                        bsonType: "string"
                                    },
                                    scorer: {
                                        bsonType: "string"
                                    },
                                    scorerTeam: {
                                        bsonType: "string"
                                    },
                                    time: {
                                        bsonType: "double"
                                    }
                                }
                            }
                        },
                        events: {
                            bsonType: "array",
                            minItems: 0,
                            uniqueItems: true,
                            additionalProperties: false,
                            items: {
                                bsonType: "object",
                                required: ["time", "type", "description"],
                                additionalProperties: true,
                                properties: {
                                    time: {
                                        bsonType: "double"
                                    },
                                    type: {
                                        bsonType: "string"
                                    },
                                    description: {
                                        bsonType: "string"
                                    },
                                    player: {
                                        bsonType: "string"
                                    }
                                }
                            }
                        },
                        damage: {
                            bsonType: "array",
                            minItems: 0,
                            uniqueItems: true,
                            additionalProperties: false,
                            items: {
                                bsonType: "object",
                                required: ["attacker", "defender", "damage", "weapon"],
                                additionalProperties: true,
                                properties: {
                                    attacker: {
                                        bsonType: "string"
                                    },
                                    defender: {
                                        bsonType: "string"
                                    },
                                    damage: {
                                        bsonType: "double"
                                    },
                                    weapon: {
                                        bsonType: "string"
                                    }
                                }
                            }
                        },
                        teamScore: {
                            bsonType: "array",
                            minItems: 0,
                            uniqueItems: true,
                            additionalProperties: false,
                            items: {
                                bsonType: "object",
                                additionalProperties: true,
                                properties: {}
                            }
                        },
                        startTime: {
                            bsonType: "date"
                        },
                        projectedEnd: {
                            bsonType: "date"
                        },
                        countdown: {
                            bsonType: "int"
                        },
                        elapsed: {
                            bsonType: "int"
                        },
                        inLobby: {
                            bsonType: "bool"
                        },
                        teamChanges: {
                            bsonType: "array",
                            minItems: 0,
                            uniqueItems: false,
                            additionalProperties: false,
                            items: {
                                bsonType: "object",
                                required: ["playerName", "previousTeam", "currentTeam"],
                                additionalProperties: true,
                                properties: {
                                    playerName: {
                                        bsonType: "string"
                                    },
                                    previousTeam: {
                                        bsonType: "string"
                                    },
                                    currentTeam: {
                                        bsonType: "string"
                                    }
                                }
                            }
                        },
                        remaining: {
                            bsonType: "int"
                        },
                        id: {
                            bsonType: "int"
                        },
                        date: {
                            bsonType: "date"
                        }
                    }
                }
            }
        }
    }
});

tracker.completed.createIndex({"$**": "text"});

// Create server collection.
tracker.createCollection("server", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "ipAddress", "visible", "data"],
            additionalProperties: false,
            properties: {
                _id: {
                    bsonType: "objectId"
                },
                ipAddress: {
                    bsonType: "string"
                },
                visible: {
                    bsonType: "bool"
                },
                data: {
                    bsonType: "object",
                    additionalProperties: true,
                    properties: {
                        ip: {
                            bsonType: "string"
                        },
                        keepListed: {
                            bsonType: "bool"
                        },
                        name: {
                            bsonType: "string"
                        },
                        notes: {
                            bsonType: "string"
                        },
                        version: {
                            bsonType: "string"
                        },
                        lastSeen: {
                            bsonType: "date"
                        }
                    }
                }
            }
        }
    }
});
