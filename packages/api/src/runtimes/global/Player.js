import { Player } from "@minecraft/server";
function adjustTextLength(text = "", totalLength = 100) {
    return (text.slice(0, totalLength)).padEnd(totalLength, "\t");
}
Player.prototype.sendToast = function (title = "", message = "", icon = "", background = "textures/ui/greyBorder") {
    const text = "§N§O§T§I§F§I§C§A§T§I§O§N" + adjustTextLength(title, 100) + adjustTextLength('§7' + message, 600) + adjustTextLength(icon, 200) + adjustTextLength(background, 200);
    this.sendMessage(text);
    this.playSound("note.harp", { volume: 0.6, pitch: 1.5 });
    return;
};
Player.prototype.sendTopbar = function (message) {
    this.onScreenDisplay.setTitle("§m§c" + message);
    return;
};
Player.prototype.stopTopbar = function () {
    this.onScreenDisplay.setTitle("§m§c");
    return;
};
Player.prototype.sendBottomBar = function (message) {
    this.onScreenDisplay.setTitle("§m§e" + message);
    return;
};
Player.prototype.stopBottomBar = function () {
    this.onScreenDisplay.setTitle("§m§e");
    return;
};
//# sourceMappingURL=Player.js.map