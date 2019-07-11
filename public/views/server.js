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
                    3) A compiled version of olproxy<br />
                    4) A collection of custom maps (recommended)
                </div>
            </div>
            <div class="section">
                <div class="header">Setup on Windows</div>
                <div>
                    Windows setup is relatively simple.  With Overload installed and olproxy for Windows downloaded, simply run the file RunDedicatedServer.bat as well as olproxy.exe, and your server is ready to go.<br /><br />
                    For custom maps, download maps from either <a target="_blank" href="https://overloadmaps.com">https://overloadmaps.com</a> or from <a target="_blank" href="https://github.com/roncli/overload-maps">https://github.com/roncli/overload-maps</a>, and copy the .zip files for each map into c:\\ProgramData\\Revival\\Overload, creating the directory if it doesn't exist.  You do not need to unzip the files.
                </div>
            </div>
            <div class="section">
                <div class="header">Setup on Mac or Linux</div>
                <div>
                    With Overload installed, use the instructions on the <a href="/download">download</a> page to install olproxy.<br /><br />
                    For custom maps, download maps from either <a target="_blank" href="https://overloadmaps.com">https://overloadmaps.com</a> or from <a target="_blank" href="https://github.com/roncli/overload-maps">https://github.com/roncli/overload-maps</a>, and copy the .zip files for each map into /usr/share/Revival/Overload, creating the directory if it doesn't exist.  You do not need to unzip the files.
                </div>
            </div>
            <div class="section">
                <div class="header">Example: Ubuntu 18.04 with Overload download from gog.com</div>
                <div>
                    The file setup.sh is available from <a target="_blank" href="https://gist.github.com/roncli/602d747ce28a57b801f53f6a29438834">https://gist.github.com/roncli/602d747ce28a57b801f53f6a29438834</a>.  This is a simple, all-in-one script that downloads and installs everything necessary to get Overload and olproxy running as a service.  It does require some user input, just agree and accept defaults where necessary.  Don't forget to use the instructions on the <a href="/download">download</a> page to edit the appsettings.json file to ensure that your server appears on the tracker.
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
