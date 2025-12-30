import { system } from "@minecraft/server";
export class EventHandlers {
    autoListeners = new Map();
    customListeners = new Map();
    onSubscribe;
    onUnsubscribe;
    /** Set callbacks for dynamic subscription management */
    setSubscriptionHandlers(onSubscribe, onUnsubscribe) {
        this.onSubscribe = onSubscribe;
        this.onUnsubscribe = onUnsubscribe;
    }
    /** Check if an event has any listeners */
    hasListeners(event) {
        const listeners = this.getListenerMap(event);
        const list = listeners.get(event);
        return list !== undefined && list.length > 0;
    }
    on(...args) {
        if (typeof args[0] === "string") {
            this.addListener(args[0], args[1]);
        }
        else {
            this.addListener(args[1], args[2], args[0]);
        }
    }
    addListener(event, callback, owner) {
        const listeners = this.getListenerMap(event);
        const hadListeners = this.hasListeners(event);
        const list = listeners.get(event) ?? [];
        list.push({ owner, cb: callback });
        listeners.set(event, list);
        // Subscribe to event if this is the first listener
        if (!hadListeners && this.onSubscribe && !event.startsWith("Custom")) {
            this.onSubscribe(event);
        }
    }
    off(...args) {
        if (typeof args[0] === "string") {
            this.removeListener(args[0], undefined, args[1]);
        }
        else {
            this.removeListener(args[1], args[0], args[2]);
        }
    }
    removeListener(event, owner, callback) {
        const listeners = this.getListenerMap(event);
        const list = listeners.get(event);
        if (!list)
            return;
        const keep = [];
        list.forEach((l) => {
            const ownedMatch = owner && l.owner === owner;
            const cbMatch = callback && l.cb === callback;
            if (ownedMatch || cbMatch) {
                return;
            }
            keep.push(l);
        });
        listeners.set(event, keep);
        // Unsubscribe from event if no listeners remain
        if (keep.length === 0 && this.onUnsubscribe && !event.startsWith("Custom")) {
            system.run(() => this.onUnsubscribe(event));
        }
    }
    emit(event, payload) {
        const listeners = this.getListenerMap(event);
        const list = listeners.get(event);
        if (!list)
            return;
        for (const listener of list) {
            this.executeListener(listener, payload);
        }
    }
    executeListener(listener, payload) {
        try {
            listener.cb(payload);
        }
        catch {
            // Swallow listener errors to avoid breaking emit loop
        }
    }
    suspendPlugin(owner) {
        const stored = new Map();
        const collect = (listeners) => {
            for (const [event, list] of listeners.entries()) {
                const owned = list.filter((listener) => listener.owner === owner);
                if (owned.length === 0)
                    continue;
                stored.set(event, owned.map((listener) => listener.cb));
                this.removeListener(event, owner);
            }
        };
        collect(this.autoListeners);
        collect(this.customListeners);
        return stored;
    }
    resumePlugin(owner, listeners) {
        for (const [event, callbacks] of listeners.entries()) {
            for (const cb of callbacks) {
                this.addListener(event, cb, owner);
            }
        }
    }
    getListenerMap(event) {
        return event.startsWith("Custom") ? this.customListeners : this.autoListeners;
    }
}
//# sourceMappingURL=EventHanlders.js.map