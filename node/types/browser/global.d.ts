import AboutView from "../../public/views/about"
import ArchiveView from "../../public/views/archive"
import ClipboardHandler from "../../public/js/common/clipboardHandler"
import ClipboardJS from "../../node_modules/clipboard"
import CommonCompletedDetailsView from "../../public/views/common/completedDetails"
import CommonCompletedPlayersView from "../../public/views/common/completedPlayers"
import CommonDetailsView from "../../public/views/common/details"
import CommonEventsView from "../../public/views/common/events"
import CommonPlayerCountView from "../../public/views/common/playerCount"
import CommonPlayersView from "../../public/views/common/players"
import CommonScoreView from "../../public/views/common/score"
import CommonSettingsView from "../../public/views/common/settings"
import Countdown from "../../public/js/common/countdown"
import Elapsed from "../../public/js/common/elapsed"
import Encoding from "../../public/js/common/encoding"
import Game from "../../public/js/common/game"
import GameListGameView from "../../public/views/gamelist/game"
import GameListGamesView from "../../public/views/gamelist/games"
import GameListView from "../../public/views/gamelist"
import GameView from "../../public/views/game"
import GettingStartedView from "../../public/views/gettingStarted"
import HomeCompletedGamesView from "../../public/views/home/completedGames"
import HomeGamesView from "../../public/views/home/games"
import HomeServerView from "../../public/views/home/server"
import HomeServersView from "../../public/views/home/servers"
import HomeView from "../../public/views/home"
import IndexView from "../../public/views/index"
import LinksView from "../../public/views/links"
import MethodNotAllowedView from "../../public/views/405"
import NotFoundView from "../../public/views/404"
import Player from "../../public/js/common/player"
import SearchView from "../../public/views/search"
import ServerErrorView from "../../public/views/500"
import ServerView from "../../public/views/server"
import SummaryCompletedGamesView from "../../public/views/summary/completedGames"
import SummaryGamesView from "../../public/views/summary/games"
import SummaryView from "../../public/views/summary"
import Template from "../../public/js/common/template"
import Time from "../../public/js/common/time"
import WebSocketClient from "../../public/js/common/websocketclient"

export {}

declare global {
    interface Window {
        AboutView: typeof AboutView
        ArchiveView: typeof ArchiveView
        ClipboardHandler: typeof ClipboardHandler
        ClipboardJS: typeof ClipboardJS
        CommonCompletedDetailsView: typeof CommonCompletedDetailsView
        CommonCompletedPlayersView: typeof CommonCompletedPlayersView
        CommonDetailsView: typeof CommonDetailsView
        CommonEventsView: typeof CommonEventsView
        CommonPlayerCountView: typeof CommonPlayerCountView
        CommonPlayersView: typeof CommonPlayersView
        CommonScoreView: typeof CommonScoreView
        CommonSettingsView: typeof CommonSettingsView
        Countdown: typeof Countdown
        Elapsed: typeof Elapsed
        Encoding: typeof Encoding
        Game: typeof Game
        GameListGameView: typeof GameListGameView
        GameListGamesView: typeof GameListGamesView
        GameListView: typeof GameListView
        GameView: typeof GameView
        GettingStartedView: typeof GettingStartedView
        HomeCompletedGamesView: typeof HomeCompletedGamesView
        HomeGamesView: typeof HomeGamesView
        HomeServerView: typeof HomeServerView
        HomeServersView: typeof HomeServersView
        HomeView: typeof HomeView
        IndexView: typeof IndexView
        LinksView: typeof LinksView
        MethodNotAllowedView: typeof MethodNotAllowedView
        NotFoundView: typeof NotFoundView
        Player: typeof Player
        q: string
        SearchView: typeof SearchView
        ServerErrorView: typeof ServerErrorView
        ServerView: typeof ServerView
        SummaryCompletedGamesView: typeof SummaryCompletedGamesView
        SummaryGamesView: typeof SummaryGamesView
        SummaryView: typeof SummaryView
        Template: typeof Template
        Time: typeof Time
        WebSocketClient: typeof WebSocketClient
    }
}
