import { system } from "@minecraft/server";
class PluginManagers {
    plugins = new Map();
    pausedListeners = new Map();
    eventHandlers;
    SystemBase;
    constructor(event, system) {
        this.eventHandlers = event;
        this.SystemBase = system;
    }
    registerPlugin(...plugin) {
        for (const p of plugin) {
            const instance = new p(this.eventHandlers, this.SystemBase);
            this.plugins.set(instance.name, instance);
            system.run(() => this.applyPluginState(instance));
        }
    }
    getPlugin(name) {
        return this.plugins.get(name) || null;
    }
    getPlugins() {
        return Array.from(this.plugins.values());
    }
    isEnabled(name) {
        const plugin = this.plugins.get(name);
        if (!plugin)
            return false;
        return plugin.isEnabled();
    }
    applyPluginState(plugin) {
        if (plugin.isEnabled()) {
            this.enablePlugin(plugin);
            return;
        }
        this.disablePlugin(plugin);
    }
    setPluginEnabled(name, enabled) {
        const plugin = this.plugins.get(name);
        if (!plugin)
            return;
        const config = plugin.config.get() ?? {};
        const settings = plugin.getPluginSettings();
        if (!settings.Enabled)
            return;
        config.Enabled = { ...settings.Enabled, value: enabled };
        plugin.config.set(config);
        this.applyPluginState(plugin);
    }
    disablePlugin(plugin) {
        if (this.pausedListeners.has(plugin.name))
            return;
        const paused = this.eventHandlers.suspendPlugin(plugin);
        this.pausedListeners.set(plugin.name, paused);
    }
    enablePlugin(plugin) {
        const paused = this.pausedListeners.get(plugin.name);
        if (!paused) {
            return;
        }
        console.warn(`Enabling plugin: ${plugin.name}`);
        if (!plugin.isLoaded) {
            console.warn(`Loading plugin fresh: ${plugin.name} (discarding paused listeners to avoid duplicates)`);
            plugin.load();
            this.pausedListeners.delete(plugin.name);
            return;
        }
        this.eventHandlers.resumePlugin(plugin, paused);
        this.pausedListeners.delete(plugin.name);
    }
}
export { PluginManagers };
//# sourceMappingURL=PluginManagers.js.map