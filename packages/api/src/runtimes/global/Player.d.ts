declare global {
    interface Player {
        sendToast(title?: string, message?: string, icon?: string, background?: string): void;
        sendTopbar(message: string): void;
        stopTopbar(): void;
    }
}
export {};
//# sourceMappingURL=Player.d.ts.map