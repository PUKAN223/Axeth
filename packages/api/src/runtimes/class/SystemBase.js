import { system, world, } from "@minecraft/server";
import { ConfigManagers, EventHandlers, Logger, PluginManagers, SettingMenuBuilders, } from "@axeth/api/runtimes";
import { PlayerManagers } from "./PlayerManagers.js";
import { SystemPlugin } from "../plugins/SystemPlugin/index.js";
// import { SystemPlugin } from "../plugins/SystemPlugin/index.js";
class SystemBase {
    world;
    system;
    configManager;
    events;
    pluginManagers;
    logger;
    settingMenuBuilders;
    playerManagers;
    options = {
        settingItemType: "minecraft:clock",
    };
    // Track subscribed handlers alongside their owning signal so we can unsubscribe with the same callback
    eventSubscriptions = new Map();
    startTime = Date.now();
    constructor(options) {
        this.world = world;
        this.system = system;
        this.events = new EventHandlers();
        this.logger = new Logger("SYSTEM");
        this.configManager = new ConfigManagers();
        this.pluginManagers = new PluginManagers(this.events, this);
        this.settingMenuBuilders = new SettingMenuBuilders();
        this.playerManagers = new PlayerManagers();
        if (options) {
            this.options = { ...this.options, ...options };
        }
        this.setupDynamicEventMapping();
        this.initializeEvents();
    }
    initializeEvents() {
        this.events.on("AfterItemUse", (ev) => {
            if (ev.itemStack.typeId !== this.options.settingItemType)
                return;
            this.settingMenuBuilders.settingMenu(ev.source, this.pluginManagers);
        });
        this.events.on("BeforeStartup", (ev) => this.onStartup(ev));
        this.events.on("BeforeShutdown", (ev) => this.onShutdown(ev));
        system.runInterval(() => {
            this.events.emit("AfterTick", { currentTick: system.currentTick });
        });
    }
    setupDynamicEventMapping() {
        this.events.setSubscriptionHandlers((event) => this.subscribeToEvent(event), (event) => {
            this.unsubscribeFromEvent(event);
        });
    }
    subscribeToEvent(eventName) {
        if (this.eventSubscriptions.has(eventName))
            return;
        const isAfter = eventName.startsWith("After");
        const baseEventName = eventName.replace(/^(After|Before)/, "");
        const lowerEventName = baseEventName.charAt(0).toLowerCase() +
            baseEventName.slice(1);
        // Try world events first
        if (isAfter && lowerEventName in world.afterEvents) {
            const typedKey = lowerEventName;
            const handler = (arg) => {
                this.events.emit(eventName, arg);
            };
            world.afterEvents[typedKey].subscribe(handler);
            this.eventSubscriptions.set(eventName, { signal: world.afterEvents[typedKey], handler });
        }
        else if (!isAfter && lowerEventName in world.beforeEvents) {
            const typedKey = lowerEventName;
            const handler = (arg) => {
                this.events.emit(eventName, arg);
            };
            world.beforeEvents[typedKey].subscribe(handler);
            this.eventSubscriptions.set(eventName, { signal: world.beforeEvents[typedKey], handler });
        } // Try system events
        else if (isAfter && lowerEventName in system.afterEvents) {
            const typedKey = lowerEventName;
            const handler = (arg) => {
                this.events.emit(eventName, arg);
            };
            system.afterEvents[typedKey].subscribe(handler);
            this.eventSubscriptions.set(eventName, { signal: system.afterEvents[typedKey], handler });
        }
        else if (!isAfter && lowerEventName in system.beforeEvents) {
            const typedKey = lowerEventName;
            const handler = (arg) => {
                this.events.emit(eventName, arg);
            };
            system.beforeEvents[typedKey].subscribe(handler);
            this.eventSubscriptions.set(eventName, { signal: system.beforeEvents[typedKey], handler });
        }
    }
    unsubscribeFromEvent(eventName) {
        const subscription = this.eventSubscriptions.get(eventName);
        if (!subscription)
            return;
        system.run(() => subscription.signal.unsubscribe(subscription.handler));
        this.eventSubscriptions.delete(eventName);
    }
    onLoad(_ev) { }
    onStartup(ev) {
        try {
            this.onLoad(ev);
        }
        catch (error) {
            this.logger.error(`Error during onLoad: ${error}`);
        }
        this.pluginManagers.registerPlugin(SystemPlugin);
        const plugins = this.pluginManagers.getPlugins();
        let pluginLoadCount = 0;
        for (const plugin of plugins) {
            try {
                plugin.onEnable(ev);
            }
            catch (error) {
                this.logger.error(`Error during onEnable of plugin ${plugin.name}: ${error}`);
            }
            pluginLoadCount++;
        }
        system.run(() => {
            const endTime = Date.now();
            const loadDuration = endTime - this.startTime;
            this.playerManagers.eachPlayer((pl) => {
                pl.sendToast("", `${"Plugin Loaded".mcColors().grey} (${pluginLoadCount.toString().mcColors().green}/${plugins.length.toString().mcColors().red}) ${`in ${loadDuration}ms`.mcColors().grey}`, "textures/items/compass_item", "textures/ui/greyBorder");
            });
        });
    }
    onShutdown(ev) {
        const plugins = this.pluginManagers.getPlugins();
        for (const plugin of plugins) {
            plugin.onDisable(ev);
        }
    }
}
export { SystemBase };
//# sourceMappingURL=SystemBase.js.map