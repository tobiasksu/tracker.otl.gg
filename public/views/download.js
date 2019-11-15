//  ####                         ##                      #  #   #    #
//   #  #                         #                      #  #   #
//   #  #   ###   #   #  # ##     #     ###    ###    ## #  #   #   ##     ###   #   #
//   #  #  #   #  #   #  ##  #    #    #   #      #  #  ##   # #     #    #   #  #   #
//   #  #  #   #  # # #  #   #    #    #   #   ####  #   #   # #     #    #####  # # #
//   #  #  #   #  # # #  #   #    #    #   #  #   #  #  ##   # #     #    #      # # #
//  ####    ###    # #   #   #   ###    ###    ####   ## #    #     ###    ###    # #
/**
 * A class that represents the download view.
 */
class DownloadView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered download page template.
     * @returns {string} An HTML string of the download page.
     */
    static get() {
        return /* html */`
            <h2>Download olmod</h2>
            <div class="section">
                <div>
                    Download olmod directly from Github.  Visit <a href="https://github.com/arbruijn/olmod/releases" target="_blank">https://github.com/arbruijn/olmod/releases</a> and download the first .zip file listed under the latest release.
                </div>
            </div>
            <h2>Connecting to the Overload Server Browser</h2>
            <div class="section">
                <div>
                    There is one additional step you must do to get your server listed on this site's server browser.  There is a file distributed with olmod called olmodsettings.json that you need to edit to get into the Overload Game Browser:
                </div>
                <div class="code">
                    {<br />
                    <pre>    </pre>"isServer": true,<br />
                    <pre>    </pre>"trackerBaseUrl": "https://olproxy.otl.gg",<br />
                    <pre>    </pre>"keepListed": false,<br />
                    <pre>    </pre>"serverName": "roncli's Testing Server",<br />
                    <pre>    </pre>"notes": "Contact roncli@roncli.com for details!"<br />
                    }
                </div>
                <div>
                    You must set isServer to true and ensure the trackerBaseUrl is http://olproxy.otl.gg to get listed.  You should also set the serverName to name your server, and add any notes that you would like listed alongside your server within the Overload Game Browser.  If you wish for your server to remain listed even after it is offline, set keepListed to true.
                </div>
            </div>
        `;
    }
}

if (typeof module !== "undefined") {
    module.exports = DownloadView; // eslint-disable-line no-undef
}
