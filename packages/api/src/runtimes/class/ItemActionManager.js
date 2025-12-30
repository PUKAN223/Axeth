const ItemActionRegistry = new Map();
class ItemActionManager {
    plugin;
    constructor(plugin) {
        this.plugin = plugin;
    }
    registerItem(itemId) {
        const itemActions = new ItemActions(itemId, this.plugin);
        ItemActionRegistry.set(itemId, itemActions);
        return itemActions;
    }
    getItemActions(itemId) {
        return ItemActionRegistry.get(itemId);
    }
}
class ItemActions {
    itemId;
    plugin;
    constructor(itemId, plugin) {
        this.itemId = itemId;
        this.plugin = plugin;
    }
    onUse(callback) {
        this.plugin.events.on("AfterItemUse", (ev) => {
            if (ev.itemStack.typeId !== this.itemId)
                return;
            callback(ev.source, ev.itemStack);
        });
    }
    //WIP
    onHitEntity(callback) {
        this.plugin.events.on("AfterEntityHurt", (ev) => {
            const player = ev.damageSource.damagingEntity;
            const items = player?.getComponent("inventory")?.container.getItem(player.selectedSlotIndex);
            if (!items)
                return;
            callback(player, items, ev.hurtEntity);
        });
    }
}
export { ItemActions, ItemActionManager };
//# sourceMappingURL=ItemActionManager.js.map