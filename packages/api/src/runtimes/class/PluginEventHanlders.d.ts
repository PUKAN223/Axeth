import { EventHandlers } from "./EventHanlders.js";
import { PluginBase } from "./PluginBase.js";
import type { WorldEvents } from "../types/WorldEvents.js";
declare class PluginEventHandlers {
    private plugin;
    private eventHandlers;
    constructor(plugin: PluginBase, eventHandlers: EventHandlers<WorldEvents>);
    on<K extends `Custom${string}`, T>(event: K, listener: (payload: T) => void): void;
    on<T extends keyof WorldEvents>(event: T, listener: (payload: WorldEvents[T]) => void): void;
    emit<K extends `Custom${string}`, T>(event: K, payload: T): void;
    emit<T extends keyof WorldEvents>(event: T, payload: WorldEvents[T]): void;
}
export { PluginEventHandlers };
//# sourceMappingURL=PluginEventHanlders.d.ts.map