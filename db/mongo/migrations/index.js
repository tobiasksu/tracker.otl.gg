const admin = db.getSiblingDB("admin");
const tracker = db.getSiblingDB("tracker");

// Update this with the latest migration number.
const currentMigration = 1;

// Check to see if the migration collection exists yet.  If not, create it.
const found = tracker.getCollectionInfos({name: "migration"}).length;
if (found === 0) {
    tracker.createCollection("migration", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["_id", "current"],
                additionalProperties: false,
                properties: {
                    _id: {
                        bsonType: "objectId"
                    },
                    current: {
                        bsonType: "int"
                    }
                }
            }
        }
    });

    tracker.migration.insert([{current: NumberInt(0)}]);
}

// Get the migration in the database and determine if any need to be ran.
const migration = tracker.migration.findOne();
if (migration.current < currentMigration) {
    // Loop through the migrations that need to be run and run them.
    for (let i = migration.current + 1; i <= currentMigration; i++) {
        load(`/var/mongo/migrations/${i}.js`);
        tracker.migration.findOneAndUpdate({}, {$set: {current: NumberInt(i)}});
    }
}

admin.shutdownServer();
