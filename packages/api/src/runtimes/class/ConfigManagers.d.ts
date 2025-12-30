declare class ConfigManagers {
    constructor();
    getConfig<T = unknown>(name: string): Config<T>;
    clearAll(): void;
}
declare class Config<T = unknown> {
    private name;
    private world;
    private prefix;
    private readonly maxChunkSize;
    constructor(name: string);
    set(value: T): void;
    get(): T;
    delete(): void;
    has(key: keyof T): boolean;
    clear(): void;
}
export { ConfigManagers, Config };
//# sourceMappingURL=ConfigManagers.d.ts.map