import { world } from "@minecraft/server";
class PlayerManagers {
    constructor() { }
    eachPlayer(callback) {
        const players = this.getAllPlayers();
        for (const player of players) {
            callback(player);
        }
    }
    findPlayerByName(name) {
        const players = this.getAllPlayers();
        for (const player of players) {
            if (player.name === name) {
                return player;
            }
        }
        return null;
    }
    countPlayers() {
        const players = this.getAllPlayers();
        return players.length;
    }
    getAllPlayers() {
        return world.getPlayers();
    }
    isPlayerGameMode(player, gameMode) {
        return player.getGameMode() === gameMode;
    }
}
export { PlayerManagers };
//# sourceMappingURL=PlayerManagers.js.map