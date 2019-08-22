/**
 * @typedef {import("express").Request} Express.Request
 */

const HtmlMinifier = require("html-minifier"),
    pjson = require("../../package.json"),
    settings = require("../../settings");

/**
 * @type {typeof import("../../public/views/index")}
 */
let IndexView;

//   ###
//  #   #
//  #       ###   ## #   ## #    ###   # ##
//  #      #   #  # # #  # # #  #   #  ##  #
//  #      #   #  # # #  # # #  #   #  #   #
//  #   #  #   #  # # #  # # #  #   #  #   #
//   ###    ###   #   #  #   #   ###   #   #
/**
 * A class that handles common web functions.
 */
class Common {
    //   #                            #    ###    #                 ##
    //  # #                           #     #                      #  #
    //  #     ##   ###   # #    ###  ###    #    ##    # #    ##    #    ###    ###  ###
    // ###   #  #  #  #  ####  #  #   #     #     #    ####  # ##    #   #  #  #  #  #  #
    //  #    #  #  #     #  #  # ##   #     #     #    #  #  ##    #  #  #  #  # ##  #  #
    //  #     ##   #     #  #   # #    ##   #    ###   #  #   ##    ##   ###    # #  #  #
    //                                                                   #
    /**
     * Formats a time span.
     * @param {number} seconds The number of seconds.
     * @returns {string} The formatted time span.
     */
    static formatTimeSpan(seconds) {
        return `${seconds > 3600 ? `${Math.floor(seconds / 3600)}:` : ""}${seconds > 60 ? `${Common.pad(Math.floor(seconds / 60) % 60, seconds >= 600 ? 2 : 1)}:` : ""}${Common.pad(Math.floor(seconds % 60), seconds >= 10 ? 2 : 1)}.${Common.pad(Math.floor(seconds * 1000) % 1000, 3)}`;
    }

    //                #
    //                #
    // ###    ###   ###
    // #  #  #  #  #  #
    // #  #  # ##  #  #
    // ###    # #   ###
    // #
    /**
     * Pads a number with leading zeros.
     * @param {number} value The value.  Must be a whole number.
     * @param {number} digits The desired number of digits in the result.
     * @returns {string} A string with the number padded with the appropriate amount of leading zeros.
     */
    static pad(value, digits) {
        let ret = value.toString();

        while (ret.length < digits) {
            ret = `0${ret}`;
        }

        return ret;
    }

    // ###    ###   ###   ##
    // #  #  #  #  #  #  # ##
    // #  #  # ##   ##   ##
    // ###    # #  #      ##
    // #            ###
    /**
     * Generates a webpage from the provided HTML using a common template.
     * @param {string} head The HTML to insert into the header.
     * @param {string} html The HTML to make a full web page from.
     * @param {Express.Request} req The request of the page.
     * @returns {string} The HTML of the full web page.
     */
    static page(head, html, req) {
        if (!IndexView) {
            IndexView = require("../../public/views/index");
        }

        return HtmlMinifier.minify(
            IndexView.get({
                head,
                html,
                protocol: req.protocol,
                host: req.get("host"),
                originalUrl: req.originalUrl,
                year: new Date().getFullYear(),
                version: pjson.version
            }),
            settings.htmlMinifier
        );
    }

    // #      #          ##    ####                       #
    // #      #           #    #                          #
    // ###   ###   # #    #    ###   ###    ##    ##    ###   ##
    // #  #   #    ####   #    #     #  #  #     #  #  #  #  # ##
    // #  #   #    #  #   #    #     #  #  #     #  #  #  #  ##
    // #  #    ##  #  #  ###   ####  #  #   ##    ##    ###   ##
    /**
     * HTML-encodes a string.
     * @param {string} str The string.
     * @returns {string} The encoded string.
     */
    static htmlEncode(str) {
        return str.replace(/[\u0080-\uFFFF<>&]/gim, (i) => `&#${i.charCodeAt(0)};`);
    }

    //   #          ####                       #
    //              #                          #
    //   #    ###   ###   ###    ##    ##    ###   ##
    //   #   ##     #     #  #  #     #  #  #  #  # ##
    //   #     ##   #     #  #  #     #  #  #  #  ##
    // # #   ###    ####  #  #   ##    ##    ###   ##
    //  #
    /**
     * Javascript-encodes a string.
     * @param {*} str The string.
     * @returns {string} The encoded string.
     */
    static jsEncode(str) {
        return str.replace(/"/gim, "\\\"");
    }
}

Common.route = {
    include: true
};

module.exports = Common;
