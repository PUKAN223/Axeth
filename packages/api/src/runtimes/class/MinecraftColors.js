class MinecraftColors {
    str;
    constructor(str) {
        this.str = str;
    }
    get grey() {
        return `§7${this.str}§r`;
    }
    get pink() {
        return `§d${this.str}§r`;
    }
    get blackGray() {
        return `§8${this.str}§r`;
    }
    get darkRed() {
        return `§4${this.str}§r`;
    }
    get darkGreen() {
        return `§2${this.str}§r`;
    }
    get darkBlue() {
        return `§1${this.str}§r`;
    }
    get darkYellow() {
        return `§6${this.str}§r`;
    }
    get red() {
        return `§c${this.str}§r`;
    }
    get green() {
        return `§a${this.str}§r`;
    }
    get blue() {
        return `§b${this.str}§r`;
    }
    get yellow() {
        return `§e${this.str}§r`;
    }
    get white() {
        return `§f${this.str}§r`;
    }
    get black() {
        return `§0${this.str}§r`;
    }
    get bold() {
        return `§l${this.str}§r`;
    }
    get italic() {
        return `§o${this.str}§r`;
    }
    get underline() {
        return `§n${this.str}§r`;
    }
    get strikethrough() {
        return `§m${this.str}§r`;
    }
    get obfuscated() {
        return `§k${this.str}§r`;
    }
    get reset() {
        return `§r${this.str}`;
    }
}
export { MinecraftColors };
//# sourceMappingURL=MinecraftColors.js.map