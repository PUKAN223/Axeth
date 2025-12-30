import { Entity, ItemStack } from "@minecraft/server";
import { Player } from "@minecraft/server";
import { PluginBase } from "./PluginBase.js";
declare class ItemActionManager {
    private plugin;
    constructor(plugin: PluginBase);
    registerItem(itemId: string): ItemActions;
    getItemActions(itemId: string): ItemActions | undefined;
}
declare class ItemActions {
    private itemId;
    private plugin;
    constructor(itemId: string, plugin: PluginBase);
    onUse(callback: (player: Player, item: ItemStack) => void): void;
    onHitEntity(callback: (player: Player, item: ItemStack, entity: Entity) => void): void;
}
export { ItemActions, ItemActionManager };
//# sourceMappingURL=ItemActionManager.d.ts.map