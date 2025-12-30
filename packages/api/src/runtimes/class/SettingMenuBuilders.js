import { IActionForm, IModalForm, } from "@axeth/api/runtimes";
class SettingMenuBuilders {
    menus = new Map();
    registerMenu(menu, plugin) {
        this.menus.set(plugin.name, menu);
    }
    settingMenu(pl, pluginManagers) {
        const plugins = pluginManagers.getPlugins();
        const settingMain = new IActionForm(`Settings Menu`, `§fHello, §e${pl.name}§r\n\nThis is the configuration menu.\nYou can manage settings here.`);
        settingMain.addDivider();
        settingMain.addLabel(`§7Plugins (§c${plugins.length}§7)§r`);
        for (const plugin of plugins) {
            if (plugin.isRuntime)
                continue;
            this.addPluginButton(settingMain, plugin, pl, pluginManagers);
        }
        settingMain.show(pl);
    }
    addPluginButton(form, plugin, player, pluginManagers) {
        const settings = new SettingMenu(plugin, plugin.getPluginSettings());
        const statusText = plugin.isEnabled() ? "§2Enabled" : "§cDisabled";
        form.addButton(`${settings.buttons.name}\n§8[${statusText}§8]`, settings.buttons.icon, () => {
            this.showPluginSettingsPage(plugin, player, pluginManagers);
        });
    }
    showPluginSettingsPage(plugin, player, pluginManagers) {
        const settings = new SettingMenu(plugin, plugin.getPluginSettings());
        const advancedSettings = plugin.getAdvancedSettings(player, plugin);
        const showDefaultSettings = () => {
            const page = settings.getPage();
            page.show(player).then((res) => {
                if (res.canceled)
                    return;
                this.savePluginSettings(plugin, res.formValues, pluginManagers);
                this.settingMenu(player, pluginManagers);
            });
        };
        const showAdvancedSettings = () => {
            advancedSettings();
        };
        if (advancedSettings) {
            const settingSelectionMenu = new IActionForm("Settings Menu", "Choose an option:");
            settingSelectionMenu.addButton("Advanced Settings", "textures/ui/settings_glyph_color_2x", () => {
                showAdvancedSettings();
            });
            settingSelectionMenu.addButton("Default Settings", "textures/ui/icon_setting", () => {
                showDefaultSettings();
            });
            settingSelectionMenu.show(player);
        }
        else {
            showDefaultSettings();
        }
    }
    savePluginSettings(plugin, formValues, pluginManagers) {
        const startIndex = 2; // Skip label and divider
        const config = plugin.config.get() ?? {};
        const settingsKeysNone = Object.keys(plugin.getPluginSettings());
        const settingsKeys = settingsKeysNone.filter((key) => plugin.getPluginSettings()[key]?.canUserModify !== false);
        for (let i = startIndex; i < formValues.length - 1; i++) {
            const value = formValues[i];
            if (value === undefined)
                continue;
            const key = settingsKeys[i - startIndex];
            if (!key)
                continue;
            const setting = plugin.getPluginSettings()[key];
            if (!setting)
                continue;
            config[key] = {
                ...setting,
                value: this.convertSettingValue(setting.type, value),
            };
        }
        plugin.config.set(config);
        pluginManagers.applyPluginState(plugin);
    }
    convertSettingValue(type, value) {
        switch (type) {
            case "number":
            case "array":
                return Number(value);
            case "boolean":
                return Boolean(value);
            default:
                return String(value);
        }
    }
}
class SettingMenu {
    plugin;
    settings;
    constructor(plugin, settings) {
        this.plugin = plugin;
        this.settings = settings;
    }
    get buttons() {
        return {
            name: this.plugin.name,
            description: `Settings for ${this.plugin.name.mcColors().blue} plugin`,
            icon: this.plugin.icon || "textures/items/compass_item",
        };
    }
    getPage() {
        const config = this.plugin.config.get() ?? {};
        const forms = new IModalForm(`${this.plugin.name} Settings`, `Save changes.`);
        forms.addLabel(this.buttons.description.mcColors().grey);
        forms.addDivider();
        if (Object.keys(this.settings).length === 0) {
            forms.addLabel("§cNo settings available for this plugin.§r");
            forms.addDivider();
            return forms;
        }
        this.addSettingFields(forms, config);
        forms.addDivider();
        return forms;
    }
    addSettingFields(forms, config) {
        for (const [key, setting] of Object.entries(this.settings)) {
            if (setting.canUserModify === false)
                continue;
            const savedValue = config[key]?.value;
            const defaultValue = setting.default;
            switch (setting.type) {
                case "boolean":
                    forms.addToggle(key, (savedValue ?? defaultValue), setting.description);
                    break;
                case "string":
                    forms.addTextField(key, setting.description, (savedValue ?? defaultValue), setting.description);
                    break;
                case "number":
                    forms.addSlider(key, 1, setting.maxValue ?? 100, 1, (savedValue ?? defaultValue), setting.description);
                    break;
                case "array":
                    forms.addDropdown(key, defaultValue.map(String), typeof savedValue === "number" ? savedValue : 0, setting.description);
                    break;
            }
        }
    }
}
export { SettingMenu, SettingMenuBuilders };
//# sourceMappingURL=SettingMenuBuilders.js.map