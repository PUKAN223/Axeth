import { ActionFormResponse } from "@minecraft/server-ui";
import type { IActionFormButton } from "../../types/forms/IActionForm/Elements/Button.js";
import type { IActionFormDivider } from "../../types/forms/IActionForm/Elements/Divider.js";
import type { IActionFormHeader } from "../../types/forms/IActionForm/Elements/Header.js";
import type { IActionFormLabel } from "../../types/forms/IActionForm/Elements/Label.js";
import { Player } from "@minecraft/server";
declare class IActionForm {
    private title;
    private body;
    private elements;
    private previousForm?;
    constructor(title?: string, body?: string, previousForm?: (pl: Player) => void);
    back(pl: Player): void;
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
     * Add multiple buttons at once
     */
    addButtons(buttons: IActionFormButton[]): this;
    /**
     * Add a single button
     */
    addButton(label: string, icon?: string, onClick?: () => void): this;
    /**
     * Add a button object
     */
    addButtonObject(button: IActionFormButton): this;
    /**
     * Get all buttons from the form
     */
    getButtons(): IActionFormButton[];
    /**
     * Add a divider to separate elements
     */
    addDivider(): this;
    /**
     * Get all dividers from the form
     */
    getDividers(): IActionFormDivider[];
    /**
     * Add a header text
     */
    addHeader(text: string): this;
    /**
     * Add a header object
     */
    addHeaderObject(header: IActionFormHeader): this;
    /**
     * Get the first header from the form
     */
    getHeader(): IActionFormHeader | undefined;
    /**
     * Get all headers from the form
     */
    getHeaders(): IActionFormHeader[];
    /**
     * Add a label text
     */
    addLabel(text: string): this;
    /**
     * Add a label object
     */
    addLabelObject(label: IActionFormLabel): this;
    /**
     * Get all labels from the form
     */
    getLabels(): IActionFormLabel[];
    /**
     * Clear all elements from the form
     */
    clearElements(): this;
    /**
     * Get the total number of elements
     */
    getElementCount(): number;
    /**
     * Check if the form has any buttons
     */
    hasButtons(): boolean;
    /**
     * Show the form to a player
     */
    show(player: Player): Promise<ActionFormResponse>;
    private isButton;
    private isDivider;
    private isHeader;
    private isLabel;
}
export { IActionForm };
//# sourceMappingURL=IActionForm.d.ts.map