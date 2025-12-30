import path from "path"
import fs from 'fs-extra';
import { exec } from "child_process";

class TemplateGenerators {
    private fileList = new Map<string, string>();
    private dependencies: string[] = [
        "@axeth/api",
        "@axeth/core",
        "@minecraft/server",
        "@minecraft/server-ui"
    ];

    constructor() {
    }

    public registerFile(path: string, content: string) {
        this.fileList.set(path, content);
    }

    public getFiles() {
        return this.fileList;
    }

    public async generate(config: { [key: string]: any }, spinner: any): Promise<void> {
        spinner.start("Preparing template pack files...");
        const templateData: { [key: string]: string } = await fs.readJson(path.join(__dirname, '../data/templates.json'));
        for (const [filePath, fileContent] of Object.entries(templateData)) {
            let populatedContent = fileContent;
            for (const [key, value] of Object.entries(config)) {
                const placeholder = `{{${key}}}`;
                let replacementValue: string;
                let isNonStringValue = false;
                
                // Determine the proper string representation based on type
                if (Array.isArray(value)) {
                    replacementValue = JSON.stringify(value);
                    isNonStringValue = true;
                } else if (typeof value === "object" && value !== null) {
                    replacementValue = JSON.stringify(value);
                    isNonStringValue = true;
                } else if (typeof value === "number") {
                    replacementValue = value.toString();
                    isNonStringValue = true;
                } else {
                    replacementValue = String(value);
                }
                
                // Remove quotes around non-string values: "{{key}}" -> {{key}}
                if (isNonStringValue) {
                    populatedContent = populatedContent.split(`"${placeholder}"`).join(replacementValue);
                } else {
                    populatedContent = populatedContent.split(placeholder).join(replacementValue);
                }
                
                await new Promise((resolve) => setTimeout(resolve, 10)); // Slight delay to ensure responsiveness
            }
            this.registerFile(filePath, populatedContent);
        }
        spinner.stop("Prepared template pack files.");
        spinner.start("Creating template pack files...");

        for (const filePath of this.fileList.keys()) {
            const fullPath = path.join(process.cwd(), config['project_name'], filePath);
            const shortPath = filePath
                .split('/')
                .slice(-5)
                .join('/');
            spinner.message(`Creating file: ${shortPath}`);
            await Bun.file(fullPath).write(this.fileList.get(filePath) || '');
            await new Promise((resolve) => setTimeout(resolve, 50)); // Slight delay to ensure file system stability
        }
        spinner.stop("Template pack files generated.");
        spinner.start("Installing dependencies...");
        await this.installDependencies(config['project_name'], this.dependencies);
        spinner.stop("Dependencies installed.");
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

    private async installDependencies(projectName: string, dependencies?: string[]): Promise<void> {
        const projectPath = path.join(process.cwd(), projectName || '');
        const installCommand = `bun add ${dependencies ? dependencies.join(' ') : this.dependencies.join(' ')}`;
        return await this.runCommand(installCommand, projectPath);
    }
}

export { TemplateGenerators };