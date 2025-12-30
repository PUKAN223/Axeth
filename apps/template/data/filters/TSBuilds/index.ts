import { Filters } from "@axeth/core";
import type { Manifest } from "./types/Manifest";
import * as esbuild from "esbuild";
import { parseArgs } from "./utils/parseArgs";
import chalk from "chalk";
import { spawn } from "bun";
import * as fs from "fs";

const [settings] = parseArgs(Bun.argv.slice(2));


class TSBuilds extends Filters {
  private typescript = "ts";
  private bpPath = `${this.basePath}/BP`;

  override async apply(): Promise<void> {
    const manifest = this.readManifest(this.bpPath);
    if (!manifest) return;
    const entryPath = manifest.modules.find((x) => x.entry)?.entry;
    if (!entryPath) return;

    const scriptPath = "./packs" + "/" + entryPath.replace(".js", `.${this.typescript}`);

    // Run linter before building (surface output to console)
    this.msg(`Running linter: ${chalk.yellow("bunx eslint ./packs")}`);
    const lintProcess = spawn(["bunx", "eslint", "./packs"], {
      stdout: "inherit",
      stderr: "inherit",
    });

    const exitCode = await lintProcess.exited;

    if (exitCode !== 0) {
      this.msg(`${chalk.red("✗")} Linting failed. Fix errors before building.`);
      return;
    }

    this.msg(`${chalk.green("✓")} Linting passed`);
    await esbuild.build({
      bundle: true,
      entryPoints: ["@axeth/api"],
      external: [
        "@minecraft/server",
        "@minecraft/server-ui",
      ],
      format: "esm",
      outfile: this.bpPath + "/scripts/AxethLib.js",
      minify: true,
      keepNames: false,
      sourcemap: true,
      ...settings,
    }).then(() => {
      this.msg(`Successfully built library: ${chalk.green("BP/scripts/AxethLib.js")}`);
    });

    await esbuild.build({
      plugins: [
        {
          name: "alias-axeth-api",
          setup(build) {
            build.onResolve({ filter: /^@axeth\/api$/ }, () => {
              return { path: "./AxethLib.js", external: true };
            });
          },
        },
      ],
      bundle: true,
      entryPoints: [
        scriptPath,
      ],
      external: [
        "@minecraft/server",
        "@minecraft/server-ui",
      ],
      format: "esm",
      outfile: this.bpPath + "/" + entryPath,
      sourcemap: true,
      ...settings,
    }).then(() => {
      this.msg(`Successfully built script: ${chalk.green("BP/" + entryPath)}`);
    });

    // this.fileManagers.removeDirectory(this.basePath + "/" + "scripts");
  }

  public readManifest(bpPath: string): Manifest | null {
    try {
      return JSON.parse(
        fs.readFileSync(`${bpPath}/manifest.json`, "utf-8"),
      ) as Manifest;
    } catch {
      return null;
    }
  }
}

export { TSBuilds };
