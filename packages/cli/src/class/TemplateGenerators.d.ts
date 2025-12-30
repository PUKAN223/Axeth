declare class TemplateGenerators {
    private fileList;
    private dependencies;
    constructor();
    registerFile(path: string, content: string): void;
    getFiles(): Map<string, string>;
    generate(config: {
        [key: string]: any;
    }, spinner: any): Promise<void>;
    private runCommand;
    private installDependencies;
}
export { TemplateGenerators };
//# sourceMappingURL=TemplateGenerators.d.ts.map