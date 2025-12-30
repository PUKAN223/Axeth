class PluginEventHandlers {
    plugin;
    eventHandlers;
    constructor(plugin, eventHandlers) {
        this.plugin = plugin;
        this.eventHandlers = eventHandlers;
    }
    on(event, listener) {
        this.eventHandlers.on(this.plugin, event, listener);
    }
    emit(event, payload) {
        if (typeof event === 'string' && event.startsWith('Custom')) {
            this.eventHandlers.emit(event, payload);
        }
        else {
            this.eventHandlers.emit(event, payload);
        }
    }
}
export { PluginEventHandlers };
//# sourceMappingURL=PluginEventHanlders.js.map