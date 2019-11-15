//   ###                                      #   #    #
//  #   #                                     #   #
//  #       ###   # ##   #   #   ###   # ##   #   #   ##     ###   #   #
//   ###   #   #  ##  #  #   #  #   #  ##  #   # #     #    #   #  #   #
//      #  #####  #       # #   #####  #       # #     #    #####  # # #
//  #   #  #      #       # #   #      #       # #     #    #      # # #
//   ###    ###   #        #     ###   #        #     ###    ###    # #
/**
 * A class that represents the server view.
 */
class ServerView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered server page template.
     * @returns {string} An HTML string of the server page.
     */
    static get() {
        return /* html */`
            <h2>Server Setup</h2>
            <div class="section">
                <div class="header">Overview</div>
                <div>
                    Running an private Overload server requires a few things:<br /><br />
                    1) Open UDP ports 7000 to 8001.  Note: this guide does not cover opening these ports.<br />
                    2) An installation of Overload<br />
                    3) olmod v0.2.7 or later.  Use the instructions on the <a href="/download">download</a> page to download and configure your server.<br />
                </div>
            </div>
            <div class="section">
                <div class="header">olmod on Windows with Steam or GoG</div>
                <div>
                    If you have Overload on Steam or GoG, you should just be able to launch olmod.exe from anywhere.  If it does not work for you, either uninstall and reinstall Overload, or follow the instructions for using olmod alongside Overload.
                </div>
            </div>
            <div class="section">
                <div class="header">olmod alongside Overload</div>
                <div>
                    Unzip the olmod package into the same directory as Overload.  This directory is the same directory that contains the Overload executable as well as the subdirectory Overload_Data.  You can then run olmod from within the same directory as Overload.<br /><br />
                </div>
            </div>
            <div class="section">
                <div class="header">Example: Ubuntu 18.04 with Overload download from gog.com</div>
                <div>
                    The file setup.sh is available from <a target="_blank" href="https://gist.github.com/roncli/602d747ce28a57b801f53f6a29438834">https://gist.github.com/roncli/602d747ce28a57b801f53f6a29438834</a>.  This is a simple, all-in-one script that downloads and installs everything necessary to get Overload and olmod running as a service.  It does require some user input, just agree and accept defaults where necessary.  Don't forget to use the instructions on the <a href="/download">download</a> page to edit the olmodsettings.json file to ensure that your server appears on the tracker.
                </div>
            </div>
            <div class="section">
                <div class="header">Adding Examples</div>
                <div>
                    If you'd like to add an example script for your operating system, please issue a pull request to the repository for this website at <a target="_blank" href="https://github.com/roncli/olproxy.otl.gg">https://github.com/roncli/olproxy.otl.gg</a>, adding your example to /web/views/server.js.
                </div>
            </div>
        `;
    }
}

if (typeof module !== "undefined") {
    module.exports = ServerView; // eslint-disable-line no-undef
}
