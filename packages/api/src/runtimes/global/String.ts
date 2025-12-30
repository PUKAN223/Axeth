import { MinecraftColors } from "../class/MinecraftColors.js";

declare global {
  interface String {
    mcColors(): MinecraftColors;
  }
}

String.prototype.mcColors = function (): MinecraftColors {
  return new MinecraftColors(this.toString());
};
