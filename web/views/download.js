const HtmlMinifier = require("html-minifier"),

    Common = require("../includes/common"),

    settings = require("../../settings");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//  ####                         ##                      #
//   #  #                         #                      #
//   #  #   ###   #   #  # ##     #     ###    ###    ## #
//   #  #  #   #  #   #  ##  #    #    #   #      #  #  ##
//   #  #  #   #  # # #  #   #    #    #   #   ####  #   #
//   #  #  #   #  # # #  #   #    #    #   #  #   #  #  ##
//  ####    ###    # #   #   #   ###    ###    ####   ## #
/**
 * A class that represents the download page.
 */
class Download {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Processes the request.
     * @param {express.Request} req The request.
     * @param {express.Response} res The response.
     * @returns {void} A promise that resolves when the request is complete.
     */
    static get(req, res) {
        const html = Common.page("", /* html */`
            <h2>Download olproxy</h2>
            <div class="section">
                <div class="header">Windows</div>
                <div>
                    Download olproxy directly from Github.  Visit <a href="https://github.com/arbruijn/olproxy/releases" target="_blank">https://github.com/arbruijn/olproxy/releases</a> and download the first .zip file listed under the latest release.
                </div>
            </div>
            <div class="section">
                <div class="header">Mac or Linux</div>
                <div>
                    You must compile a Mac or Linux version yourself.
                    <ol style="list-style: decimal; padding-left: 30px;">
                        <li>Download and install the latest <a href="https://dotnet.microsoft.com/download/dotnet-core/2.2" target="_blank">.NET Core 2.2 SDK</a>.  Note that you want the SDK and not the runtime.</li>
                        <li>Using git, clone the olproxy repository from <a href="https://github.com/arbruijn/olproxy" target="_blank">https://github.com/arbruijn/olproxy</a>.</li>
                        <li>Find the appropriate RID listed at <a href="https://docs.microsoft.com/en-us/dotnet/core/rid-catalog" target="_blank">https://docs.microsoft.com/en-us/dotnet/core/rid-catalog</a> for your system.</li>
                        <li>Run the following command, replacing the &lt;RID> with the one you found in the step above.<div class="code">dotnet publish --configuration Release --framework netcoreapp2.2 --runtime &lt;RID> --self-contained</div></li>
                        <li>To run olproxy, execute the file olproxy from the directory ./bin/Release/netcoreapp2.2/&lt;RID>, again replacing the &lt;RID> as above.</li>
                    </ol>
                </div>
            </div>
            <h2>Using olproxy with a server</h2>
            <div class="section">
                <div>
                    There is one additional step you must do to get your server listed on this site's server browser.  There is a file distributed with olproxy called appsettings.json that you need to edit to get into the Overload Game Browser:
                </div>
                <div class="code">
                    {<br />
                    <pre>    </pre>isServer: true,<br />
                    <pre>    </pre>trackerBaseUrl: "http://olproxy.otl.gg",<br />
                    <pre>    </pre>serverName: "roncli's Testing Server",<br />
                    <pre>    </pre>notes: "Contact roncli@roncli.com for details!"<br />
                    }
                </div>
                <div>
                    You must set isServer to true and ensure the trackerBaseUrl is http://olproxy.otl.gg to get listed.  You should also set the serverName to name your server, and add any notes that you would like listed alongside your server within the Overload Game Browser.
                </div>
            </div>
        `, req);

        res.status(200).send(HtmlMinifier.minify(html, settings.HtmlMinifier));
    }
}

module.exports = Download;
