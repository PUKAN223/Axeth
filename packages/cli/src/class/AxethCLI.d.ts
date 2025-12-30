declare class AxethCLI {
    private promptGroups;
    private promptDefaults;
    private template;
    private readonly axethAPI;
    private readonly axethCore;
    constructor();
    private version;
    private init;
    private generateTemplate;
    private addonInfoPrompt;
    private configPrompt;
    private getMinecraftServerVersion;
    private getMinecraftServerUIVersion;
    private registerPrompt;
    private getAxethCoreVersion;
    private getAxethApiVersion;
    runPrompts(groupId: string, onCancel?: () => void): Promise<{
        [x: string]: any;
    }>;
    private registerIntro;
    private runCommand;
}
export { AxethCLI };
//# sourceMappingURL=AxethCLI.d.ts.map