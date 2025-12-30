class Logger {
    prefix;
    constructor(prefix) {
        this.prefix = prefix;
    }
    log(message) {
        this.msg(message, "LOG");
    }
    error(message) {
        this.msg(message, "ERROR");
    }
    warn(message) {
        this.msg(message, "WARN");
    }
    info(message) {
        this.msg(message, "INFO");
    }
    debug(message) {
        this.msg(message, "DEBUG");
    }
    msg(message, type) {
        console.warn(`[${this.prefix}][${type}] ${message}`);
    }
}
export { Logger };
//# sourceMappingURL=Logger.js.map