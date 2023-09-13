# tracker.otl.gg

The source code for the website at https://tracker.otl.gg.

## Running Locally

To run this locally, you first need to be running Docker with Docker Compose.

Next, replace docker-compose.yml with docker-compose.local.yml.  This is a commented-out version of the docker-compose.yml file that removes unnecessary containers and disables unnecessary volumes.

Finally, you must create the `/secrets` directory with the following files (no extensions):

* `APPINSIGHTS_INSTRUMENTATIONKEY` - Leave this blank.
* `MONGO_INITDB_ROOT_PASSWORD_FILE` - This should be a strong password.  Its only use is to initialize the MongoDB instance.
* `MONGO_INITDB_ROOT_USERNAME_FILE` - This should be `admin`.
* `REDIS_PASSWORD_FILE` - This should be a strong password.  Redis is used by the website to cache minified resources.
* `WEB_TRACKER_PASSWORD_FILE` - This is the password that the website uses to connect to the MongoDB database.  Once your containers are started, you can use MongoDB compass to connect directly to the database using Username/Password authentication.  Username is `web_tracker` and the contents of this file is the password.  No authentication database is necessary, and you should use the Default authentication mechanism.

Simply running `docker compose up --build` in the root directory of the repository should get the site up and running for you.  You can test the website by running `https://localhost`.

To connect to your server from an olmod server, edit olmodsettings.json so that the `isServer` is `true` and the `trackerBaseUrl` is `https://localhost`, or use `https://` with the IP address of the computer if connecting from across a network.

## Version History

### v3.0.5 - 9/12/2023

* Fix bug with page count in search results.
* Don't log opcode 0 errors as they are frequent and unavoidable due to the nature of websockets.
* Package updates.

### v3.0.4 - 8/7/2023

* Fix bug with websocket crashes.
* Package updates.

### v3.0.3 - 7/26/2023

* Increase max allowed size posted to `/api/stats` from 100 KB to 1 MB.

### v3.0.2 - 7/24/2023

* Fix bug with suicides counting as kills while game is ongoing.  Suicides still count correctly in the archive.

### v3.0.1 - 7/24/2023

* Fix bug with games disappearing when there is activity on them.
* Package updates.

### v3.0.0 - 7/23/2023

* Now uses Docker containers for easier setup.
* Replace SQL Server with MongoDB.
* Refactor views.
* When a game ends, the tracker will now redirect to the archive page created by the game.
* Fixed a number of bugs with the website.

### v2.2.0 - 12/10/2022

* Fix error when creator is missing from game settings.
* New stats and graphs on the archive pages, inspired by https://pudlez.net/otl.  Ironically, this will probably break that site for a bit.
* Package updates.

### v2.1.8 - 8/24/2022

* Added creator to /api/browser list.
* Fixed a bug that was causing the game page to remove the player count and not display events when it started.
* Removed a bunch of unnecessary data from the API that powers the archive list.
* Players lists on the archive page that are longer than 4 players will have an ellipsis after the player list to indicate there were more than 4 players.
* Package updates.

### v2.1.7 - 7/24/2022

* Package updates.

### v2.1.6 - 5/22/2022

* Package updates.

### v2.1.5 - 3/9/2022

* Player count shows after a game starts.
* Fix bug with team changes not being recorded.
* Fix bug when game settings are missing when the game ends.
* Handle JSON errors from bad actors better.
* Fix bug when archive search query results in no parameters.  Note that player names like "..." are currently unsearchable.
* Fix a number of bugs when no player name is passed with an event.  Note players that have no player name will not be recorded on the tracker, because name is the only way we have to track players currently.

### v2.1.4 - 1/3/2022

* Fix bug with player counts not updating live.
* Rebranded as tracker.otl.gg.  The old URL will continue to work for historical purposes, but new users should use the URL tracker.otl.gg.

### v2.1.3 - 12/29/2021

* Note if an olmod server is on an old version.
* Show max number of players in the game if it's Join in Progress.
* Include self damage taken in total damage taken numbers.
* Counts friendly fire as damage taken in friendly fire games, shown in a different color than self-damage.
* Games with no data received in 5 minutes are removed from the tracker.
* Games fall off the tracker if they are over 10 seconds past end time, unless it's an overtime game, then it falls off immediately.
* Friendly fire kills are now counted correctly for players.
* Update redis caching to reduce issues with redis.
* Show team changes in join in progress games.
* Package updates.

### v2.1.2 - 8/30/2021

* Package updates.

### v2.1.1 - 6/30/2021

* Server browser includes game version for olmod 0.4.1 and later.
* End game packets will better rewrite the game's history if it missed anything while it was live.
* Fixed memory leak.
* Fixed bug when searching for nothing.
* Fixed encoding bugs.

### v2.1.0 - 3/26/2020

* Updated archive list with better pagination.
* Added search to archive list.
* Archived games now show damage taken totals and time in game.
* Game settings now appear on the game page.
* Live updates can be disabled.
* New summary page that shows all games and servers in a simple table.
* Copy button extended to the server list.
* New game browser API for future olmod usage.
* Servers seen more than 5 minutes ago are now considered "old", instead of 1 hour ago.
* Fixed bug causing games in lobby to not update when they have been started.
* Fixed bug causing games to appear like they had 24 hours remaining in recent versions of Chrome.
* Fixed bug with some meta tags.

### v2.0.3 - 1/28/2020

* Onboarding update with current information about olmod and how to play.
* Added IP address and copy button to games where joining is possible.
* Fixed bugs with unofficial game modes.
* Add minification and combination of CSS & JS files.

### v2.0.2 - 12/10/2019

* Update server list API to not draw from the database.
* Other fixes to server list API.
* Remove active API.

### v2.0.1 - 11/19/2019

* Active lobbys are now shown with number of players and max players.
* Archive now displays the initial page in local time like the rest of the pages.
* Players who took damage but did not record another start are removed from the damage grid.
* Fixed timeago implementation.
* Added more HTML encoding to server and map names.
* Fixed non-existent game IDs crashing instead of 
* Fixed bug with completed games linking to an invalid page.
* Replaced original websocket implementation with express-ws.

### v2.0.0 - 11/14/2019

* Stats are now tracked and displayed in real time using websockets.
* Support for CTF and Monsterball.
* New archived games list.
* New completed game API.
* Backend website improvements.

### v1.1.0 - 6/30/2019

* Save end game stats received from olmod to the database.
* Update appsettings.json with the "signOff" parameter.

### v1.0.3 - 4/30/2019

* Fix bug with HTML encoding.
* Fix bug when mode hasn't been set yet.
* Update links.
* Add SSL.

### v1.0.2 - 3/17/2019

* Use database for backend server list persistence.
* Add "online" querystring to toggle a server's visibility.
* Move old servers to the bottom of the list.
* Add Server Setup and Links pages.
* Add links to the map being played.
* Filter out servers that are missing key information.

### v1.0.1 - 3/2/2019

* HTML encode all externally provided data.

### v1.0.0 - 3/2/2019

Initial Version
