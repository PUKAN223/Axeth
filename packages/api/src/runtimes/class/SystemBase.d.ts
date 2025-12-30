import { StartupEvent, System, World } from "@minecraft/server";
import { ConfigManagers } from "./ConfigManagers.js";
import { EventHandlers } from "./EventHanlders.js";
import { Logger } from "./Logger.js";
import { PluginManagers } from "./PluginManagers.js";
import { SettingMenuBuilders } from "./SettingMenuBuilders.js";
import type { SystemBaseOptions } from "../types/SystemBaseOptions.js";
import type { WorldEvents } from "../types/WorldEvents.js";
import { PlayerManagers } from "./PlayerManagers.js";
declare class SystemBase {
    world: World;
    system: System;
    configManager: ConfigManagers;
    events: EventHandlers<WorldEvents>;
    pluginManagers: PluginManagers;
    logger: Logger;
    settingMenuBuilders: SettingMenuBuilders;
    playerManagers: PlayerManagers;
    private options;
    private eventSubscriptions;
    private startTime;
    constructor(options?: SystemBaseOptions);
    private initializeEvents;
    private setupDynamicEventMapping;
    private subscribeToEvent;
    private unsubscribeFromEvent;
    onLoad(_ev: StartupEvent): void;
    private onStartup;
    private onShutdown;
}
export { SystemBase };
//# sourceMappingURL=SystemBase.d.ts.map