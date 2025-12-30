import { GameMode } from "@minecraft/server";
import { Player } from "@minecraft/server";
declare class PlayerManagers {
    constructor();
    eachPlayer(callback: (player: Player) => void): void;
    findPlayerByName(name: string): Player | null;
    countPlayers(): number;
    getAllPlayers(): Player[];
    isPlayerGameMode(player: Player, gameMode: GameMode): boolean;
}
export { PlayerManagers };
//# sourceMappingURL=PlayerManagers.d.ts.map