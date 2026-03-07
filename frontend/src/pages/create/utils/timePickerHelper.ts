/**
 * Shared time-picker helper for Agenda Section.
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
    // Permanently set type to time (don't toggle)
    inputEl.type = "time";
    
    // Make input fill the button area for better clickability
    inputEl.style.position = "absolute";
    inputEl.style.top = "0";
    inputEl.style.left = "0";
    inputEl.style.width = "100%";
    inputEl.style.height = "100%";
    inputEl.style.opacity = "0";
    inputEl.style.cursor = "pointer";
    
    // When button is clicked, trigger the input
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        inputEl.focus();
        inputEl.click();
    });

    // When time is selected
    inputEl.addEventListener("change", () => {
        const val = inputEl.value;
        if (val) {
            const [h, m] = val.split(":").map(Number);
            const ampm = h >= 12 ? "PM" : "AM";
            const formatted = `${((h % 12) || 12)}:${String(m).padStart(2, "0")} ${ampm}`;
            labelEl.textContent = formatted;
            btn.classList.add("has-value");
            if (onSelect) {
                onSelect(formatted);
            }
        }
    });
}