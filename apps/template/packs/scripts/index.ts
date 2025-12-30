import { SystemBase } from "@axeth/api";
import { SamplePlugin } from "./plugins/SamplePlugin";

class AxethAPI extends SystemBase {
    public override onLoad(): void {
        this.pluginManagers.registerPlugin(SamplePlugin)
    }
};

new AxethAPI();