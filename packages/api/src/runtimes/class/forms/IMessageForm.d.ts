import { MessageFormResponse } from "@minecraft/server-ui";
import { Player } from "@minecraft/server";
import type { IMessageFormButton } from "../../types/forms/IMessageForm/Elements/Button.js";
declare class IMessageForm {
    private title;
    private body;
    private button1;
    private button2;
    constructor(title?: string, body?: string);
    /**
     * Set the form title
     */
    setTitle(title: string): this;
    /**
     * Set the form body text
     */
    setBody(body: string): this;
    /**
     * Get the current title
     */
    getTitle(): string;
    /**
     * Get the current body text
     */
    getBody(): string;
    /**
     * Set button 1 (left button)
     */
    setButton1(text: string, onClick?: () => void): this;
    /**
     * Set button 1 object
     */
    setButton1Object(button: IMessageFormButton): this;
    /**
     * Set button 2 (right button)
     */
    setButton2(text: string, onClick?: () => void): this;
    /**
     * Set button 2 object
     */
    setButton2Object(button: IMessageFormButton): this;
    /**
     * Get button 1
     */
    getButton1(): IMessageFormButton | null;
    /**
     * Get button 2
     */
    getButton2(): IMessageFormButton | null;
    /**
     * Check if button 1 is set
     */
    hasButton1(): boolean;
    /**
     * Check if button 2 is set
     */
    hasButton2(): boolean;
    /**
     * Check if any buttons are set
     */
    hasButtons(): boolean;
    /**
     * Clear all buttons
     */
    clearButtons(): this;
    /**
     * Clear button 1
     */
    clearButton1(): this;
    /**
     * Clear button 2
     */
    clearButton2(): this;
    /**
     * Show the form to a player and return the response
     */
    show(player: Player): Promise<MessageFormResponse>;
    /**
     * Show the form and process the results with a callback
     */
    showWithCallback(player: Player, callback: (selection: number | undefined, canceled: boolean) => void): Promise<void>;
    /**
     * Create a simple confirmation dialog
     */
    static createConfirmation(title: string, body: string, onConfirm?: () => void, onCancel?: () => void): IMessageForm;
    /**
     * Create a simple yes/no dialog
     */
    static createYesNo(title: string, body: string, onYes?: () => void, onNo?: () => void): IMessageForm;
    /**
     * Create a simple OK dialog
     */
    static createOK(title: string, body: string, onOK?: () => void): IMessageForm;
    /**
     * Create a simple alert dialog
     */
    static createAlert(title: string, body: string, onClose?: () => void): IMessageForm;
}
export { IMessageForm };
//# sourceMappingURL=IMessageForm.d.ts.map