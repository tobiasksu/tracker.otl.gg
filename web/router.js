const fs = require("fs"),
    promisify = require("util").promisify,

    express = require("express"),

    classes = {
        about: {file: "./views/about", path: "/about", methods: ["get"]},
        api: {file: "./views/api", path: "/api", methods: ["get", "post"]},
        common: {file: "./includes/common", includes: true},
        download: {file: "./views/download", path: "/download", methods: ["get"]},
        home: {file: "./views/home", path: "/", methods: ["get"]}
    };

//  ####                  #
//  #   #                 #
//  #   #   ###   #   #  ####    ###   # ##
//  ####   #   #  #   #   #     #   #  ##  #
//  # #    #   #  #   #   #     #####  #
//  #  #   #   #  #  ##   #  #  #      #
//  #   #   ###    ## #    ##    ###   #
/**
 * A class that handles the router for the website.
 */
class Router {
    //       #                 #      ##               #
    //       #                 #     #  #              #
    //  ##   ###    ##    ##   # #   #      ###   ##   ###    ##
    // #     #  #  # ##  #     ##    #     #  #  #     #  #  # ##
    // #     #  #  ##    #     # #   #  #  # ##  #     #  #  ##
    //  ##   #  #   ##    ##   #  #   ##    # #   ##   #  #   ##
    /**
     * Checks the cache and refreshes it if necessary.
     * @param {string} className The name of the class.
     * @returns {Promise} A promise that resolves once the cache is checked.
     */
    static async checkCache(className) {
        const classInfo = classes[className];

        if (!classInfo) {
            throw new Error("Invald class name.");
        }

        const stats = await promisify(fs.stat)(require.resolve(classInfo.file));

        if (!classInfo.lastModified || classInfo.lastModified !== stats.mtime) {
            delete require.cache[require.resolve(classInfo.file)];
            classInfo.class = require(classInfo.file);
            classInfo.lastModified = stats.mtime;
        }
    }

    //              #    ###                #
    //              #    #  #               #
    //  ###   ##   ###   #  #   ##   #  #  ###    ##   ###
    // #  #  # ##   #    ###   #  #  #  #   #    # ##  #  #
    //  ##   ##     #    # #   #  #  #  #   #    ##    #
    // #      ##     ##  #  #   ##    ###    ##   ##   #
    //  ###
    /**
     * Gets the router to use for the website.
     * @returns {express.Router} The router to use for the website.
     */
    static getRouter() {
        const router = express.Router(),
            classNames = Object.keys(classes),
            includes = classNames.filter((c) => classes[c].includes),
            pages = classNames.filter((c) => !classes[c].includes && classes[c].methods && classes[c].methods.length > 0);

        pages.forEach((className) => {
            const classInfo = classes[className];

            classInfo.methods.forEach((method) => {
                router[method](classInfo.path, async (req, res, next) => {
                    try {
                        for (const include of includes) {
                            await Router.checkCache(include);
                        }
                        await Router.checkCache(className);
                    } catch (err) {
                        console.log(err);
                    }

                    return classInfo.class[req.method.toLowerCase()](req, res, next);
                });
            });
        });

        return router;
    }
}

module.exports = Router.getRouter();
