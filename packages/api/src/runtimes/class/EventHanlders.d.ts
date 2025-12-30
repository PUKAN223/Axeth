import { PluginBase } from "./PluginBase.js";
type Callback<T> = (payload: T) => void;
export declare class EventHandlers<AutoEvents extends Record<string, unknown>> {
    private autoListeners;
    private customListeners;
    private onSubscribe?;
    private onUnsubscribe?;
    /** Set callbacks for dynamic subscription management */
    setSubscriptionHandlers(onSubscribe: (event: string) => void, onUnsubscribe: (event: string) => void): void;
    /** Check if an event has any listeners */
    hasListeners(event: string): boolean;
    /** Subscribe to events */
    on<K extends keyof AutoEvents>(event: K, callback: Callback<AutoEvents[K]>): void;
    on<K extends `Custom${string}`, T>(event: K, callback: Callback<T>): void;
    on<K extends keyof AutoEvents>(owner: PluginBase, event: K, callback: Callback<AutoEvents[K]>): void;
    private addListener;
    /** Unsubscribe */
    off<K extends keyof AutoEvents | `Custom${string}`>(event: K, callback: Callback<unknown>): void;
    off(owner: PluginBase, event: string, callback?: Callback<unknown>): void;
    private removeListener;
    /** Emit */
    emit<K extends keyof AutoEvents>(event: K, payload: AutoEvents[K]): void;
    emit<K extends `Custom${string}`, T>(event: K, payload: T): void;
    private executeListener;
    suspendPlugin(owner: PluginBase): Map<string, Callback<unknown>[]>;
    resumePlugin(owner: PluginBase, listeners: Map<string, Callback<unknown>[]>): void;
    private getListenerMap;
}
export {};
//# sourceMappingURL=EventHanlders.d.ts.map