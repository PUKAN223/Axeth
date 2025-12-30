import { system, world } from "@minecraft/server";
import { Logger, PluginEventHandlers, SettingMenu, } from "@axeth/api/runtimes";
import { PlayerManagers } from "./PlayerManagers.js";
import { ItemActionManager } from "./ItemActionManager.js";
class PluginBase {
    isLoaded = false;
    events;
    name = "PluginBase";
    version = "1.0.0";
    icon = "";
    world;
    system;
    systemBase;
    settingMenu;
    playerManagers;
    itemActionManager;
    isRuntime = false;
    constructor(events, systemBase) {
        this.events = new PluginEventHandlers(this, events);
        this.world = world;
        this.system = system;
        this.systemBase = systemBase;
        this.settingMenu = new SettingMenu(this, this.getPluginSettings());
        this.playerManagers = new PlayerManagers();
        this.itemActionManager = new ItemActionManager(this);
        this.system.run(() => {
            if (!this.isEnabled())
                return;
            this.systemBase.pluginManagers.applyPluginState(this);
            this.load();
        });
    }
    get config() {
        return this.systemBase.configManager.getConfig(this.name);
    }
    get logger() {
        return new Logger(this.name.toUpperCase());
    }
    load() {
        this.initializeConfig();
        this.onLoad();
        this.isLoaded = true;
    }
    getName() {
        return this.name;
    }
    onEnable(_ev) {
    }
    onLoad() {
    }
    onDisable(_ev) {
    }
    isEnabled() {
        const config = this.config.get();
        const enabledSetting = config?.["Enabled"];
        if (enabledSetting && "value" in enabledSetting) {
            return Boolean(enabledSetting.value);
        }
        if (enabledSetting && "default" in enabledSetting) {
            return Boolean(enabledSetting.default);
        }
        return true;
    }
    registerSettings(menu) {
        this.settingMenu = new menu(this, this.getPluginSettings());
    }
    getPluginSettings() {
        return {
            ["Enabled"]: {
                description: "Toggle this plugin on or off.",
                type: "boolean",
                default: true,
            },
            ...this.getSettings(),
        };
    }
    getSettings() {
        return {};
    }
    getAdvancedSettings(_pl, _plugin) {
        return null;
    }
    initializeConfig() {
        let config = this.config.get();
        if (!config) {
            this.config.set({});
            config = this.config.get();
        }
        const pluginSettings = this.getPluginSettings();
        const configUnUsedKeys = Object.keys(config).filter((key) => !(key in pluginSettings));
        for (const key of configUnUsedKeys) {
            delete config[key];
        }
        for (const [key, setting] of Object.entries(pluginSettings)) {
            if (!(key in config) || config[key]?.type !== setting.type || config[key]?.description !== setting.description || config[key]?.default !== setting.default) {
                config[key] = { ...setting, value: config[key]?.value ?? setting.default };
            }
        }
        this.config.set(config);
    }
}
export { PluginBase };
//# sourceMappingURL=PluginBase.js.map