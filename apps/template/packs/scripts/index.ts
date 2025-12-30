import { SystemBase } from "@axeth/api/runtimes";
import { SamplePlugin } from "./plugins/SamplePlugin/index.ts";

class AxethAPI extends SystemBase {
    public override onLoad(): void {
        this.pluginManagers.registerPlugin(SamplePlugin)
    }
};

new AxethAPI();