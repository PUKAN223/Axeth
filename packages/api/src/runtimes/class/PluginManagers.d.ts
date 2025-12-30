import { EventHandlers } from "./EventHanlders.js";
import { PluginBase } from "./PluginBase.js";
import { SystemBase } from "./SystemBase.js";
import type { WorldEvents } from "../types/WorldEvents.js";
declare class PluginManagers {
    private plugins;
    private pausedListeners;
    private eventHandlers;
    private SystemBase;
    constructor(event: EventHandlers<WorldEvents>, system: SystemBase);
    registerPlugin(...plugin: typeof PluginBase[]): void;
    getPlugin(name: string): PluginBase | null;
    getPlugins(): PluginBase[];
    isEnabled(name: string): boolean;
    applyPluginState(plugin: PluginBase): void;
    setPluginEnabled(name: string, enabled: boolean): void;
    private disablePlugin;
    private enablePlugin;
}
export { PluginManagers };
//# sourceMappingURL=PluginManagers.d.ts.map