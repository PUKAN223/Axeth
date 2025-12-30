import { MinecraftColors } from "../class/MinecraftColors.js";
String.prototype.mcColors = function () {
    return new MinecraftColors(this.toString());
};
//# sourceMappingURL=String.js.map