// Drop all indexes on the database.
tracker.completed.dropIndexes();

// Re-create the date added index.
tracker.completed.createIndex({dateAdded: -1});

// Add new indicies.
tracker.completed.createIndex({ipAddress: 1});
tracker.completed.createIndex({"data.settings.level": 1});
tracker.completed.createIndex({"data.settings.matchMode": 1});
tracker.completed.createIndex({"data.players.name": 1});
tracker.completed.createIndex({"data.teamScore.$**": 1});
