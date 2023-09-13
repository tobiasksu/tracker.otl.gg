const MongoDb = require("mongodb");

/**
 * @type {MongoDb.MongoClient}
 */
let client;

/**
 * @type {MongoDb.Db}
 */
let db;

//  ####   #
//   #  #  #
//   #  #  # ##
//   #  #  ##  #
//   #  #  #   #
//   #  #  ##  #
//  ####   # ##
/**
 * A class that handles setting up the database.
 */
class Db {
    //   #                     ###               #     ##
    //  # #                    #  #              #      #
    //  #    ###    ##   # #   #  #   ##   #  #  ###    #     ##
    // ###   #  #  #  #  ####  #  #  #  #  #  #  #  #   #    # ##
    //  #    #     #  #  #  #  #  #  #  #  #  #  #  #   #    ##
    //  #    #      ##   #  #  ###    ##    ###  ###   ###    ##
    /**
     * Converts a value from a MongoDb.Double to a number.
     * @param {MongoDb.Double|number} val The number.
     * @returns {number} The number.
     */
    static fromDouble(val) {
        return val ? typeof val === "number" ? val : val.value : void 0;
    }

    //   #                     #
    //  # #                    #
    //  #    ###    ##   # #   #      ##   ###    ###
    // ###   #  #  #  #  ####  #     #  #  #  #  #  #
    //  #    #     #  #  #  #  #     #  #  #  #   ##
    //  #    #      ##   #  #  ####   ##   #  #  #
    //                                            ###
    /**
     * Converts a value from a MongoDb.Long to a number.
     * @param {MongoDb.Long|number} val The number.
     * @returns {number} The number.
     */
    static fromLong(val) {
        return val ? typeof val === "number" ? val : val.toNumber() : void 0;
    }

    //  #          ###               #     ##
    //  #          #  #              #      #
    // ###    ##   #  #   ##   #  #  ###    #     ##
    //  #    #  #  #  #  #  #  #  #  #  #   #    # ##
    //  #    #  #  #  #  #  #  #  #  #  #   #    ##
    //   ##   ##   ###    ##    ###  ###   ###    ##
    /**
     * Converts a value from a number to a MongoDb.Double.
     * @param {MongoDb.Double|number} val The number.
     * @returns {MongoDb.Double} The number.
     */
    static toDouble(val) {
        return typeof val === "number" ? new MongoDb.Double(val) : val;
    }

    //  #          #
    //  #          #
    // ###    ##   #      ##   ###    ###
    //  #    #  #  #     #  #  #  #  #  #
    //  #    #  #  #     #  #  #  #   ##
    //   ##   ##   ####   ##   #  #  #
    //                                ###
    /**
     * Converts a value from a number to a MongoDb.Long.
     * @param {MongoDb.Long|number} val The number.
     * @returns {MongoDb.Long} The number.
     */
    static toLong(val) {
        return typeof val === "number" ? MongoDb.Long.fromNumber(val) : val;
    }

    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the database object.
     * @returns {Promise<MongoDb.Db>} The database.
     */
    static async get() {
        if (!client) {
            client = new MongoDb.MongoClient(`mongodb://web_tracker:${process.env.WEB_TRACKER_PASSWORD}@db:27017/tracker`, {
                authMechanism: "SCRAM-SHA-256",
                authSource: "admin",
                promoteLongs: false,
                ignoreUndefined: true
            });
        }

        await client.connect();

        if (!db) {
            db = client.db("tracker");
        }

        return db;
    }

    //  #       #
    //          #
    // ##     ###
    //  #    #  #
    //  #    #  #
    // ###    ###
    /**
     * Appends an ID to an object.
     * @param {object} object The object to append the ID to.
     * @param {string} collection The collection the ID belongs to.
     * @returns {Promise} A promise that resolves when the ID has been appended.
     */
    static async id(object, collection) {
        if (!db) {
            await Db.get();
        }

        object._id = (await db.collection("counters").findOneAndUpdate({_id: collection}, {$inc: {value: MongoDb.Long.fromNumber(1)}})).value.add(1);
    }
}

module.exports = Db;
