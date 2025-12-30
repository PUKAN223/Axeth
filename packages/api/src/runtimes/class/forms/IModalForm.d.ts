import { ModalFormResponse } from "@minecraft/server-ui";
import { Player } from "@minecraft/server";
import type { IModalFormTextField } from "../../types/forms/IModalForm/Elements/TextField.js";
import type { IModalFormToggle } from "../../types/forms/IModalForm/Elements/Toggle.js";
import type { IModalFormSlider } from "../../types/forms/IModalForm/Elements/Slider.js";
import type { IModalFormDropdown } from "../../types/forms/IModalForm/Elements/Dropdown.js";
import type { IModalFormHeader } from "../../types/forms/IModalForm/Elements/Header.js";
import type { IModalFormLabel } from "../../types/forms/IModalForm/Elements/Label.js";
import type { IModalFormDivider } from "../../types/forms/IModalForm/Elements/Divider.js";
type FormElement = IModalFormTextField | IModalFormToggle | IModalFormSlider | IModalFormDropdown | IModalFormDivider | IModalFormHeader | IModalFormLabel;
declare class IModalForm {
    private title;
    private elements;
    private submitButtonText;
    private callback?;
    constructor(title?: string, submitButtonText?: string);
    /**
     * Set the form title
     */
    setTitle(title: string): this;
    /**
     * Get the current title
     */
    getTitle(): string;
    /**
     * Set the submit button text
     */
    setSubmitButton(text: string): this;
    /**
     * Get the submit button text
     */
    getSubmitButtonText(): string;
    /**
     * Add a text field
     */
    addTextField(label: string, placeholderText?: string, defaultValue?: string, tooltip?: string): this;
    /**
     * Add a text field object
     */
    addTextFieldObject(textField: IModalFormTextField): this;
    /**
     * Get all text fields from the form
     */
    getTextFields(): IModalFormTextField[];
    /**
     * Add a toggle switch
     */
    addToggle(label: string, defaultValue?: boolean, tooltip?: string): this;
    /**
     * Add a toggle object
     */
    addToggleObject(toggle: IModalFormToggle): this;
    /**
     * Get all toggles from the form
     */
    getToggles(): IModalFormToggle[];
    /**
     * Add a slider
     */
    addSlider(label: string, minimumValue: number, maximumValue: number, valueStep: number, defaultValue?: number, tooltip?: string): this;
    /**
     * Add a slider object
     */
    addSliderObject(slider: IModalFormSlider): this;
    /**
     * Get all sliders from the form
     */
    getSliders(): IModalFormSlider[];
    /**
     * Add a dropdown
     */
    addDropdown(label: string, options: string[], defaultValueIndex?: number, tooltip?: string): this;
    /**
     * Add a dropdown object
     */
    addDropdownObject(dropdown: IModalFormDropdown): this;
    /**
     * Get all dropdowns from the form
     */
    getDropdowns(): IModalFormDropdown[];
    /**
     * Add a divider to separate elements
     */
    addDivider(): this;
    /**
     * Get all dividers from the form
     */
    getDividers(): IModalFormDivider[];
    /**
     * Add a header text
     */
    addHeader(text: string): this;
    /**
     * Add a header object
     */
    addHeaderObject(header: IModalFormHeader): this;
    /**
     * Get the first header from the form
     */
    getHeader(): IModalFormHeader | undefined;
    /**
     * Get all headers from the form
     */
    getHeaders(): IModalFormHeader[];
    /**
     * Add a label text
     */
    addLabel(text: string): this;
    /**
     * Add a label object
     */
    addLabelObject(label: IModalFormLabel): this;
    /**
     * Get all labels from the form
     */
    getLabels(): IModalFormLabel[];
    /**
     * Clear all elements from the form
     */
    clearElements(): this;
    /**
     * Get the total number of elements
     */
    getElementCount(): number;
    /**
     * Check if the form has any input elements (textField, toggle, slider, dropdown)
     */
    hasInputElements(): boolean;
    /**
     * Get all elements
     */
    getElements(): FormElement[];
    addCallback(callback: (formValues: (string | number | boolean | undefined)[], canceled: boolean) => void): this;
    /**
   * Show the form to a player and return the response
   */
    show(player: Player): Promise<ModalFormResponse>;
    /**
     * Show the form and process the results with a callback
     */
    showWithCallback(player: Player): Promise<void>;
    private isTextField;
    private isToggle;
    private isSlider;
    private isDropdown;
    private isDivider;
    private isHeader;
    private isLabel;
}
export { IModalForm };
//# sourceMappingURL=IModalForm.d.ts.map