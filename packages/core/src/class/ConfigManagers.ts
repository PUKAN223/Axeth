import { ConfigOptions } from "../types/ConfigOptions.js";
import { FileManagers } from "./FileManagers.js";
import { Logger } from "./Logger.js";

class ConfigManagers {
  private fileManagers: FileManagers;
  private configPath: string = "./packs/config.json";
  private logger: Logger;

  constructor() {
    this.fileManagers = new FileManagers();
    this.logger = new Logger();
  }

  public async getConfig() {
    const config: ConfigOptions = JSON.parse(
      (await this.fileManagers.readFile(this.configPath)).toString(),
    );

    return config;
  }

  public saveConfig(config: ConfigOptions) {
    this.fileManagers.writeFile(
      this.configPath,
      JSON.stringify(config, null, 4),
    );
    this.logger.success("Config saved successfully.");
  }
}

export { ConfigManagers };
