import { world } from "@minecraft/server";
class ConfigManagers {
    constructor() {
    }
    getConfig(name) {
        return new Config(name);
    }
    clearAll() {
        const properties = world.getDynamicPropertyIds();
        for (const key of properties) {
            if (key.startsWith("config.")) {
                world.setDynamicProperty(key);
            }
        }
    }
}
class Config {
    name;
    world;
    prefix;
    maxChunkSize = 32767;
    constructor(name) {
        this.name = name;
        this.world = world;
        this.prefix = `config.${this.name}`;
    }
    set(value) {
        const serialized = JSON.stringify(value);
        // Clear existing chunks before writing the new value
        this.clear();
        if (serialized.length <= this.maxChunkSize) {
            this.world.setDynamicProperty(this.prefix, serialized);
            return;
        }
        let partIndex = 0;
        for (let offset = 0; offset < serialized.length; offset += this.maxChunkSize) {
            const chunk = serialized.slice(offset, offset + this.maxChunkSize);
            this.world.setDynamicProperty(`${this.prefix}.part${partIndex}`, chunk);
            partIndex++;
        }
    }
    get() {
        const partPrefix = `${this.prefix}.part`;
        const partKeys = this.world
            .getDynamicPropertyIds()
            .filter((id) => id.startsWith(partPrefix))
            .sort((a, b) => {
            const aIndex = Number(a.slice(partPrefix.length));
            const bIndex = Number(b.slice(partPrefix.length));
            return aIndex - bIndex;
        });
        let raw = this.world.getDynamicProperty(this.prefix);
        if (partKeys.length > 0) {
            const parts = [];
            for (const key of partKeys) {
                const chunk = this.world.getDynamicProperty(key);
                if (chunk)
                    parts.push(chunk);
            }
            raw = parts.join("");
        }
        if (!raw)
            return {};
        return JSON.parse(raw);
    }
    delete() {
        this.clear();
    }
    has(key) {
        const data = this.get();
        return data[key] !== undefined;
    }
    clear() {
        const partPrefix = `${this.prefix}.part`;
        const keys = this.world
            .getDynamicPropertyIds()
            .filter((id) => id === this.prefix || id.startsWith(partPrefix));
        for (const key of keys) {
            this.world.setDynamicProperty(key);
        }
    }
}
export { ConfigManagers, Config };
//# sourceMappingURL=ConfigManagers.js.map