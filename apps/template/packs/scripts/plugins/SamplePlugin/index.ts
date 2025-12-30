import { PluginBase } from "@axeth/api/runtimes";

class SamplePlugin extends PluginBase {
    public override onLoad(): void {
      this.logger.info("SamplePlugin has been loaded!");
    }
}

export { SamplePlugin };