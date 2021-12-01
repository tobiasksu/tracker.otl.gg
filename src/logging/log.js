const request = require("@root/request"),
    util = require("util"),

    settings = require("../../settings");

/**
 * @type {{type: string, date: Date, obj?: object, message?: string}[]}
 */
const queue = [];

//  #
//  #
//  #       ###    ## #
//  #      #   #  #  #
//  #      #   #   ##
//  #      #   #  #
//  #####   ###    ###
//                #   #
//                 ###
/**
 * A class that handles logging.
 */
class Log {
    // ##
    //  #
    //  #     ##    ###
    //  #    #  #  #  #
    //  #    #  #   ##
    // ###    ##   #
    //              ###
    /**
     * Logs a message.
     * @param {string} message The message to log.
     * @returns {void}
     */
    static log(message) {
        queue.push({
            type: "log",
            date: new Date(),
            message
        });
        Log.output();
    }

    //                          #
    //
    // #  #   ###  ###   ###   ##    ###    ###
    // #  #  #  #  #  #  #  #   #    #  #  #  #
    // ####  # ##  #     #  #   #    #  #   ##
    // ####   # #  #     #  #  ###   #  #  #
    //                                      ###
    /**
     * Logs a warning.
     * @param {string} message The string to log.
     * @returns {void}
     */
    static warning(message) {
        queue.push({
            type: "warning",
            date: new Date(),
            message
        });
        Log.output();
    }

    //                                #     #
    //                                #
    //  ##   #  #   ##    ##   ###   ###   ##     ##   ###
    // # ##   ##   #     # ##  #  #   #     #    #  #  #  #
    // ##     ##   #     ##    #  #   #     #    #  #  #  #
    //  ##   #  #   ##    ##   ###     ##  ###    ##   #  #
    //                         #
    /**
     * Logs an exception.
     * @param {string} message The message describing the error.
     * @param {object} [obj] The object to log.
     * @returns {void}
     */
    static exception(message, obj) {
        queue.push({
            type: "exception",
            date: new Date(),
            message,
            obj
        });
        Log.output();
    }

    //              #                 #
    //              #                 #
    //  ##   #  #  ###   ###   #  #  ###
    // #  #  #  #   #    #  #  #  #   #
    // #  #  #  #   #    #  #  #  #   #
    //  ##    ###    ##  ###    ###    ##
    //                   #
    /**
     * Outputs the log queue.
     * @returns {Promise} A promise that resolves when the output has been completed.
     */
    static async output() {
        for (const log of queue) {
            if (log.obj.message && log.obj.innerError && log.obj.innerError.message && log.obj.innerError.code === "ETIMEOUT") {
                log.obj = `${log.obj.message} - ${log.obj.innerError.message} - ETIMEOUT`;
            }

            if (log.obj.message && log.obj.originalError && log.obj.originalError.message && log.obj.originalError.code === "ETIMEOUT") {
                log.obj = `${log.obj.message} - ${log.obj.originalError.message} - ETIMEOUT`;
            }

            if (log.obj.message && log.obj.syscall && log.obj.code === "ETIMEDOUT") {
                log.obj = `${log.obj.message} - ${log.obj.syscall} - ETIMEDOUT`;
            }

            if (log.obj.name === "TimeoutError") {
                log.obj = `${log.obj.message} - TimeoutError`;
            }

            if (log.obj.error && log.obj.message && log.obj.error.syscall && log.obj.error.code === "ETIMEDOUT") {
                log.obj = `${log.obj.message} - ${log.obj.error.syscall} - ETIMEDOUT`;
            }

            if (log.obj.message && log.obj.message === "Unexpected server response: 502") {
                log.obj = `${log.obj.message}`;
            }

            try {
                if (settings.disableLogger) {
                    console.log(log.message, log.obj);
                } else {
                    await request.post({
                        uri: settings.logger.url,
                        body: {
                            key: settings.logger.key,
                            application: "olproxy.otl.gg",
                            category: "exception",
                            message: `${log.message}\n${util.inspect(log.obj)}`,
                            date: new Date().getTime()
                        },
                        json: true
                    });
                }
            } catch (err) {
                console.log("Error while writing log:", err);
                console.log("Error that failed to be written:", log.message, log.obj);
            }
        }

        queue.splice(0, queue.length);
    }
}

module.exports = Log;
