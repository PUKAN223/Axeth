import * as prompt from "@clack/prompts";
import color from "colors";
import { TemplateGenerators } from "./TemplateGenerators.js";
import fs from "fs-extra";
import path from "path";
import { exec, spawn } from "child_process";

class AxethCLI {
    private promptGroups: Record<string, Record<string, (opts?: any) => any>> = {};
    private promptDefaults: Record<string, Record<string, any>> = {};
    private template: TemplateGenerators;

    private readonly axethAPI = `@axeth/api`;
    private readonly axethCore = `@axeth/core`;

    constructor() {
        console.clear();
        this.template = new TemplateGenerators();
        this.init();
    }

    private async version() {
        const url = new URL("../../package.json", import.meta.url);
        const pkgData = await Bun.file(url).json();
        return pkgData.version;
    }

    private async init() {
        const version = await this.version();
        const addonInfo = await this.addonInfoPrompt(version, () => {
            process.exit(0);
        });
        const config = await this.configPrompt();
        const minecraftServerVersion = await this.getMinecraftServerVersion();
        const minecraftServerUIVersion = await this.getMinecraftServerUIVersion();
        const spinner = prompt.spinner({ indicator: "dots" });

        await this.generateTemplate(addonInfo, config, minecraftServerVersion, minecraftServerUIVersion, spinner);
        
        const projectDir = path.join(process.cwd(), (addonInfo.addonName as string).replace(/\s+/g, "-").toLowerCase());
        
        //cd and bun run lint
        spinner.start("Linting generated add-on...");
        await this.runCommand("bun run lint", projectDir).catch((err) => {
            spinner.stop("Linting failed.");
            console.error(color.red(err));
            process.exit(1);
        });
        spinner.stop("Add-on linted successfully.");
        const openVSCode = await prompt.confirm({
            message: "Open on VSCode?",
            initialValue: false
        });

        if (openVSCode === true) {
            spinner.start("Opening VSCode...");
            await this.runCommand(`code "${projectDir}"`);
            spinner.stop("VSCode opened.");
        }
        prompt.outro(color.green(`\n  Successfully created add-on: ${addonInfo.addonName}\n`));
    }

    private async generateTemplate(addonInfo: { [x: string]: any }, config: { [x: string]: any }, minecraftServerVersion: string, minecraftServerUIVersion: string, spinner: any) {
        await this.template.generate({
            "project_name": (addonInfo.addonName as string).replace(/\s+/g, "-").toLowerCase(),
            "axethApiVersion": config.axethApiVersion,
            "pack_name": addonInfo.addonName,
            "pack_description": addonInfo.description,
            "author_name": (addonInfo.authors as string).split(",").map((name: string) => name.trim()),
            "version": addonInfo.version.split(".").map((num: string) => parseInt(num, 10)),
            "seed": Math.floor(Math.random() * 1000000),
            "axethApiName": this.axethAPI,
            "axethCoreName": this.axethCore,
            "axethCoreVersion": config.axethCoreVersion,
            "minecraftServerUIVersion": minecraftServerUIVersion,
            "minecraftServerVersion": minecraftServerVersion
        }, spinner);
    }

    private async addonInfoPrompt(version: string, onCancel?: () => void) {
        return await new Promise<{ [x: string]: any }>((resolve) => {
            this.registerIntro(
                "\n    _            _   \n   /_\\  __ _____| |_ \n  / _ \\ \\ \\ / -_)  _|\n /_/ \\_\\/\\_\\_\\___|\\__|\n                     ",
                "Axeth CLI",
                version,
            );
            this.registerPrompt("addonInfo", "addonName", "Add-on Name", "text", { placeholder: "My-Addon" });
            this.registerPrompt("addonInfo", "description", "Description", "text", { placeholder: "This addon create for Minecraft Bedrock (Axeth)" });
            this.registerPrompt("addonInfo", "version", "Version", "text", { placeholder: "1.0.0" });
            this.registerPrompt("addonInfo", "authors", "Authors", "text", { placeholder: "YourName,Axeth" });
            this.runPrompts("addonInfo", onCancel).then((responses) => {
                resolve(responses);
            })
        })
    }

    private async configPrompt() {
        return new Promise<{ [x: string]: any }>(async (resolve) => {
            const spinner = prompt.spinner({ indicator: "dots" });
            spinner.start("Fetching latest Axeth API version...");
            const versions = await this.getAxethApiVersion();
            spinner.stop(`Fetched @axeth/api ${versions.length} versions.`);
            this.registerPrompt("config", "axethApiVersion", "Select Axeth API version", "select", {
                options: versions.slice(0, 10).map((ver) => ({ label: ver, value: ver })),
                initial: versions[0],
            });
            const axethCoreVersion = await this.getAxethCoreVersion();
            await this.runPrompts("config", () => { process.exit(0); }).then((response) => {
                resolve({
                    axethApiVersion: response.axethApiVersion,
                    axethCoreVersion: axethCoreVersion,
                });
            });
        })
    }

    private async getMinecraftServerVersion() {
        const moduleData: any = await fetch(`https://registry.npmjs.org/@minecraft/server`)
            .then(res => res.json());

        const distTag = moduleData["dist-tags"];
        return distTag.latest;
    }

    private async getMinecraftServerUIVersion() {
        const moduleData: any = await fetch(`https://registry.npmjs.org/@minecraft/server-ui`)
            .then(res => res.json());
        const distTag = moduleData["dist-tags"];
        return distTag.latest;
    }

    private registerPrompt(groupId: string, key: string, message: string, type: "text" | "password" | "confirm" | "select" | "multiselect" = "text", options: any = {}) {
        if (!this.promptGroups[groupId]) this.promptGroups[groupId] = {};
        this.promptDefaults[groupId] = this.promptDefaults[groupId] || {};
        switch (type) {
            case "text":
                this.promptGroups[groupId][key] = () => prompt.text({ message, ...options });
                this.promptDefaults[groupId][key] = options.placeholder || undefined;
                break;
            case "password":
                this.promptGroups[groupId][key] = () => prompt.password({ message, ...options });
                this.promptDefaults[groupId][key] = options.placeholder || undefined;
                break;
            case "confirm":
                this.promptGroups[groupId][key] = () => prompt.confirm({ message, ...options });
                this.promptDefaults[groupId][key] = options.initial || undefined;
                break;
            case "select":
                this.promptGroups[groupId][key] = () => prompt.select({ message, ...options });
                this.promptDefaults[groupId][key] = options.initial || undefined;
                break;
            case "multiselect":
                this.promptGroups[groupId][key] = () => prompt.multiselect({ message, ...options });
                this.promptDefaults[groupId][key] = options.initial || undefined;
                break;
            default:
                throw new Error(`Unknown prompt type: ${type}`);
        }
    }

    private async getAxethCoreVersion() {
        const moduleData: any = await fetch(`https://registry.npmjs.org/${this.axethCore}`)
            .then(res => res.json());

        const versions = Object.keys(moduleData.versions);
        return versions.reverse()[0];
    }

    private async getAxethApiVersion() {
        const moduleData: any = await fetch(`https://registry.npmjs.org/${this.axethAPI}`)
            .then(res => res.json());

        const versions = Object.keys(moduleData.versions);
        return versions.reverse();
    }

    async runPrompts(groupId: string, onCancel?: () => void) {
        if (!this.promptGroups[groupId] || Object.keys(this.promptGroups[groupId]).length === 0) {
            throw new Error(`No prompts to run for group: ${groupId}`);
        }

        const responses: { [x: string]: any } = {};
        for (const key of Object.keys(this.promptGroups[groupId])) {
            const response = await this.promptGroups[groupId][key]!();
            if (String(response).includes("clack:cancel")) {
                prompt.cancel("Operation cancelled.");
                if (onCancel) onCancel();
                return {};
            }
            if (response === undefined) {
                if (this.promptDefaults[groupId] && this.promptDefaults[groupId][key] !== undefined) {
                    responses[key] = this.promptDefaults[groupId][key];
                } else {
                    responses[key] = undefined;
                }
            } else {
                responses[key] = response;
            }
        }
        return responses;
    }

    private registerIntro(logo: string, title: string, version: string) {
        prompt.intro(color.cyan(logo) + `\n   ${title} - v${version}\n`);
    }

    private async runCommand(command: string, cwd?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const options: any = {};
            if (cwd) {
                options.cwd = cwd;
            }
            exec(command, options, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
}

export { AxethCLI };