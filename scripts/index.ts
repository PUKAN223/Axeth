import * as fs from 'fs';
import * as path from 'path';

/**
 * await this.template.generate({
            "project_name": (addonInfo.addonName as string).replace(/\s+/g, "-").toLowerCase(),
            "axethApiVersion": config.axethApiVersion,
            "pack_name": addonInfo.addonName,
            "pack_description": addonInfo.description,
            "author_name": `[${(addonInfo.authors as string).split(",").map((name: string) => `"${name.trim()}"`)}]`,
            "version": `[${addonInfo.version.split(".").map((num: string) => `${parseInt(num, 10)}`)}]`,
            "seed": `${Math.floor(Math.random() * 1000000)}`,
            "axethApiName": this.axethAPI,
            "axethCoreName": this.axethCore,
            "axethCoreVersion": config.axethCoreVersion,
            "minecraftServerUIVersion": minecraftServerUIVersion,
            "minecraftServerVersion": minecraftServerVersion
        }, spinner);
 */
/**
 * {
    "format_version": 2,
    "meta": {
        "name": "test",
        "icon": "./packs/pack_icon.png",
        "version": [1, 0, 0],
        "description": "test",
        "seed": 0,
        "authors": ["sss"]
    },
    "filters": [
        {
            "name": "TSBuilds",
            "config": {}   
        },
        {
            "name": "ManifestBuilds",
            "config": {}
        }
    ],
    "env": {
    }
}
 */

const fileModify = [
    {
        name: "package.json",
        modify: (content: string) => {
            const json = JSON.parse(content);
            json.name = "{{project_name}}";
            json.dependencies["@axeth/api"] = "{{axethApiVersion}}";
            json.dependencies["@axeth/core"] = "{{axethCoreVersion}}";
            return JSON.stringify(json, null, 2);
        }
    },
    {
        name: "config.json",
        modify: (content: string) => {
            const json = JSON.parse(content);
            json.meta.name = "{{pack_name}}";
            json.meta.description = "{{pack_description}}";
            json.meta.authors = "{{author_name}}";
            json.meta.version = "{{version}}";
            json.meta.seed = "{{seed}}";
            return JSON.stringify(json, null, 2);
        }
    }
]

class TemplateDumper {
    private targetDir: string;
    private outputDir: string;

    constructor(targetDir: string = 'templates', outputDir: string = 'output') {
        this.targetDir = path.resolve(__dirname, '..', targetDir);
        this.outputDir = path.resolve(__dirname, '..', outputDir);
    }

    public dumpTemplates(): void {
        // Validate target directory exists
        if (!fs.existsSync(this.targetDir)) {
            console.error(`Target directory does not exist: ${this.targetDir}`);
            return;
        }

        // Read all files recursively in the target directory
        const readFilesRecursive = (dir: string): { [key: string]: string } => {
            const result: { [key: string]: string } = {};
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            entries.forEach(entry => {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && !entry.name.includes('node_modules')) {
                Object.assign(result, readFilesRecursive(fullPath));
            } else if (entry.isFile()) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const fileMod = fileModify.find(fm => fm.name === entry.name);
                if (fileMod) {
                    result[fullPath.replace(this.targetDir, '').replace(/\\/g, '/')] = fileMod.modify(content);
                } else {
                    result[fullPath.replace(this.targetDir, '').replace(/\\/g, '/')] = content;
                }
            }
            });
            return result;
        };
        
        const templates = readFilesRecursive(this.targetDir);

        const outputPath = path.join(this.outputDir, 'templates.json');
        fs.writeFileSync(outputPath, JSON.stringify(templates, null, 2), 'utf-8');
        console.log(`Templates dumped to ${outputPath}`);
    }
}

const dumper = new TemplateDumper(
    "./apps/template",
    "./packages/cli/data"
);
dumper.dumpTemplates();