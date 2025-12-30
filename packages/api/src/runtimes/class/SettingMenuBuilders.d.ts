import { Player } from "@minecraft/server";
import { IModalForm } from "./forms/IModalForm.js";
import { PluginBase } from "./PluginBase.js";
import { PluginManagers } from "./PluginManagers.js";
import type { PluginSettingOptions } from "../types/PluginSettingOptions.js";
declare class SettingMenuBuilders {
    private menus;
    registerMenu(menu: SettingMenu, plugin: PluginBase): void;
    settingMenu(pl: Player, pluginManagers: PluginManagers): void;
    private addPluginButton;
    private showPluginSettingsPage;
    private savePluginSettings;
    private convertSettingValue;
}
declare class SettingMenu {
    private plugin;
    private settings;
    constructor(plugin: PluginBase, settings: PluginSettingOptions);
    get buttons(): {
        name: string;
        description: string;
        icon: string;
    };
    getPage(): IModalForm;
    private addSettingFields;
}
export { SettingMenu, SettingMenuBuilders };
//# sourceMappingURL=SettingMenuBuilders.d.ts.map