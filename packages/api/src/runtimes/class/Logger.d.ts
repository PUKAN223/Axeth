declare class Logger {
    private prefix;
    constructor(prefix: string);
    log(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    debug(message: string): void;
    private msg;
}
export { Logger };
//# sourceMappingURL=Logger.d.ts.map