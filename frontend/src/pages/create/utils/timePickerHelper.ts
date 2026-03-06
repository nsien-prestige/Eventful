/**
 * Shared time-picker helper.
 * Wires up a button that reveals a native <input type="time">,
 * formats the selected value as "h:mm AM/PM", and updates a visible label.
 *
 * @param btn        - The clickable button element
 * @param inputEl    - The hidden <input type="time"> inside the button
 * @param labelEl    - The <span> that displays the formatted time
 * @param onSelect   - Optional callback fired with the formatted string on selection
 */
export function setupTimePicker(
    btn: HTMLButtonElement,
    inputEl: HTMLInputElement,
    labelEl: HTMLElement,
    onSelect?: (formatted: string) => void
): void {
    btn.addEventListener("click", () => {
        inputEl.type          = "time";
        inputEl.style.display = "block";
        inputEl.focus();
    });

    inputEl.addEventListener("change", () => {
        const val = inputEl.value;
        if (val) {
            const [h, m]   = val.split(":").map(Number);
            const ampm     = h >= 12 ? "PM" : "AM";
            const formatted = `${((h % 12) || 12)}:${String(m).padStart(2, "0")} ${ampm}`;
            labelEl.textContent = formatted;
            btn.classList.add("has-value");
            onSelect?.(formatted);
        }
        inputEl.style.display = "none";
        inputEl.type          = "text";
    });

    inputEl.addEventListener("blur", () => {
        inputEl.style.display = "none";
        inputEl.type          = "text";
    });
}