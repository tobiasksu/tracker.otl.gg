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
//    {_id: "user", value: NumberLong(0)},
]);
