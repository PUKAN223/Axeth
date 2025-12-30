import { StartupEvent } from "@minecraft/server";
import { PluginBase } from "../../class/PluginBase.js";
declare class SystemPlugin extends PluginBase {
    isRuntime: boolean;
    onEnable(ev: StartupEvent): void;
    onLoad(): void;
}
export { SystemPlugin };
//# sourceMappingURL=index.d.ts.map