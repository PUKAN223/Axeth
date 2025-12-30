import chalk from "chalk";
import * as fs from "fs";
import { ConfigManagers } from "./ConfigManagers.js";
import { Logger } from "./Logger.js";
import { PackBuilder } from "./PackBuilders.js";

class AxethCore {
    private args: string[];
    private logger: Logger = new Logger();
    private debounceTimer: Timer | null = null;

    constructor(args: string[] = Bun.argv.slice(2)) {
        this.args = args;

        if (this.isDevWatchCommand()) {
            this.devWatch();
        } else {
            this.run();
        }
    }

    private async run() {
        console.clear();

        const config = await (new ConfigManagers().getConfig());
        this.logger.info(
            `Loaded config pack: ${config.meta.name}@${config.meta.version.join(".")}`,
        );

        const pb = new PackBuilder({
            name: config.meta.name,
            config,
        });

        if (this.isHelpCommand()) {
            this.logger.msg(
                "bun run index.js [--build] [--packs] [--clean] [--dev:watch]",
                "Usage",
                chalk.bgHex("#808080"),
            );
            process.exit(0);
        }

        if (this.isCleanCommand()) pb.clean();
        if (this.isBuildCommand()) await pb.build();
        if (this.isPacksCommand()) pb.pack();

        if (
            !(
                this.isBuildCommand() ||
                this.isPacksCommand() ||
                this.isCleanCommand()
            )
        ) {
            await pb.build();
            pb.copyTo();
        }
    }

    private async devWatch() {
        const watchPaths = [
            "./index.ts",
            "./packs"
        ];

        const exec = async () => {
            if (this.debounceTimer) clearTimeout(this.debounceTimer);

            this.debounceTimer = setTimeout(async () => {
                await this.run();
                this.logger.info("Rebuilt due to file change");
            }, 200);
        };

        // first run
        await this.run();
        this.logger.info("Dev watch started");

        for (const path of watchPaths) {
            fs.watch(path, { recursive: true }, exec);
        }
    }

    private isHelpCommand(): boolean {
        return this.args.includes("--help") || this.args.includes("-h");
    }

    private isBuildCommand(): boolean {
        return this.args.includes("--build");
    }

    private isPacksCommand(): boolean {
        return this.args.includes("--packs");
    }

    private isCleanCommand(): boolean {
        return this.args.includes("--clean");
    }

    private isDevWatchCommand(): boolean {
        return this.args.includes("--dev");
    }
}

export { AxethCore };
