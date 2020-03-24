//   ###           #      #       #                         #   #    #
//  #   #          #      #                                 #   #
//  #       ###   ####   ####    ##    # ##    ## #   ###   #   #   ##     ###   #   #
//   ###   #   #   #      #       #    ##  #  #  #   #       # #     #    #   #  #   #
//      #  #####   #      #       #    #   #   ##     ###    # #     #    #####  # # #
//  #   #  #       #  #   #  #    #    #   #  #          #   # #     #    #      # # #
//   ###    ###     ##     ##    ###   #   #   ###   ####     #     ###    ###    # #
//                                            #   #
//                                             ###
/**
 * A class that represents the settings view.
 */
class SettingsView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered settings template.
     * @param {object} game The game with the settings to display.
     * @returns {string} An HTML string of the rendered settings template.
     */
    static get(game) {
        if (!game.settings) {
            return void 0;
        }

        let bitArray = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        if (game.settings.powerupFilterBitmask) {
            bitArray = [...Array(32)].map((value, index) => game.settings.powerupFilterBitmask >> index & 1);
        }

        /**
         * Returns the weapon if it is disabled.
         * @param {number} enabled Whether the weapon is enabled.
         * @param {number} index The index of the weapon.
         * @returns {string} A string that returns the disabled weapon.
         */
        const getDisabledWeapon = (enabled, index) => {
            if (enabled || index > 16) {
                return "";
            }

            switch (index) {
                case 0:
                    return "IMPULSE<br />";
                case 1:
                    return "CYCLONE<br />";
                case 2:
                    return "REFLEX<br />";
                case 3:
                    return "CRUSHER<br />";
                case 4:
                    return "DRILLER<br />";
                case 5:
                    return "FLAK<br />";
                case 6:
                    return "THUNDERBOLT<br />";
                case 7:
                    return "LANCER<br />";
                case 8:
                    return "FALCON<br />";
                case 9:
                    return "MISSILE POD<br />";
                case 10:
                    return "HUNTER<br />";
                case 11:
                    return "CREEPER<br />";
                case 12:
                    return "NOVA<br />";
                case 13:
                    return "DEVASTATOR<br />";
                case 14:
                    return "TIMEBOMB<br />";
                case 15:
                    return "VORTEX<br />";
                default:
                    return "";
            }
        };

        return /* html */`
            ${game.settings.creator ? /* html */`
                <div class="header">Creator</div>
                <div>${game.settings.creator}</div>
            ` : ""}
            <div class="header">Join in Progress</div>
            <div>${game.settings.joinInProgress ? "YES" : "NO"}</div>
            ${game.settings.forceLoadout === "OFF" ? "" : /* html */`
                <div class="header">Forced Weapon 1</div>
                <div>${game.settings.forceWeapon1}</div>
                ${game.settings.forceWeapon2 === "NONE" ? "" : /* html */`
                    <div class="header">Forced Weapon 2</div>
                    <div>${game.settings.forceWeapon2}</div>
                `}
                <div class="header">Forced Missile 1</div>
                <div>${game.settings.forceMissile1}</div>
                ${game.settings.forceMissile2 === "NONE" ? "" : /* html */`
                    <div class="header">Forced Missile 2</div>
                    <div>${game.settings.forceMissile2}</div>
                `}
            `}
            ${game.settings.forceModifier1 === "OFF" ? "" : /* html */`
                <div class="header">Forced Modifier 1</div>
                <div>${game.settings.forceModifier1}</div>
            `}
            ${game.settings.forceModifier2 === "OFF" ? "" : /* html */`
                <div class="header">Forced Modifier 2</div>
                <div>${game.settings.forceModifier2}</div>
            `}
            ${bitArray.indexOf(0) === -1 || bitArray.indexOf(0) >= 16 ? "" : /* html */`
                <div class="header">Disabled weapons</div>
                <div>${bitArray.map(getDisabledWeapon).join("")}</div>
            `}
            ${game.settings.powerupBigSpawn ? /* html */`
                <div class="header">Powerup Big Spawn</div>
                <div>${game.settings.powerupBigSpawn}</div>
            ` : ""}
            ${game.settings.powerupInitial ? /* html */`
                <div class="header">Powerup Initial</div>
                <div>${game.settings.powerupInitial}</div>
            ` : ""}
            ${game.settings.powerupSpawn ? /* html */`
                <div class="header">Powerup Spawn</div>
                <div>${game.settings.powerupSpawn}</div>
            ` : ""}
            ${game.settings.turnSpeedLimit ? /* html */`
                <div class="header">Turn Speed Limit</div>
                <div>${game.settings.turnSpeedLimit}</div>
            ` : ""}
            <div class="header">Friendly Fire</div>
            <div>${game.settings.friendlyFire ? "ON" : "OFF"}</div>
            ${game.settings.showEnemyNames ? /* html */`
                <div class="header">Show Enemy Names</div>
                <div>${game.settings.showEnemyNames}</div>
            ` : ""}
            ${game.settings.respawnTimeSeconds ? /* html */`
                <div class="header">Respawn Time</div>
                <div>${game.settings.respawnTimeSeconds} SECONDS</div>
            ` : ""}
            ${game.settings.respawnShieldTimeSeconds ? /* html */`
                <div class="header">Respawn Shield Time</div>
                <div>${game.settings.respawnShieldTimeSeconds} SECONDS</div>
            ` : ""}
            <div class="header">Rear View Allowed</div>
            <div>${game.settings.rearViewAllowed || game.settings.rearViewAllowed === void 0 ? "YES" : "NO"}</div>
        `;
    }
}

// @ts-ignore
SettingsView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = SettingsView; // eslint-disable-line no-undef
}
