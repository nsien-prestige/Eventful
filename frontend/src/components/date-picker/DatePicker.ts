import flatpickr from "flatpickr";
import type { Instance } from "flatpickr/dist/types/instance";
import "flatpickr/dist/flatpickr.css";
import "./DatePicker.css";

let startPicker: Instance;
let endPicker: Instance;
let datePicker: Instance;

export function initDatePickers() {

  const dateInput = document.getElementById("eventDate") as HTMLInputElement;
  const startInput = document.getElementById("startTime") as HTMLInputElement;
  const endInput = document.getElementById("endTime") as HTMLInputElement;

  if (!dateInput || !startInput || !endInput) return;

  /* ---------------- DATE PICKER ---------------- */

  datePicker = flatpickr(dateInput, {
    altInput: true,
    altFormat: "D, M j, Y", // Wed, Mar 5, 2026
    dateFormat: "Y-m-d",
    disableMobile: true,
    animate: true,
    minDate: "today",
    monthSelectorType: "static",
    onChange: () => applyFloatingState(dateInput)
  });

  /* ---------------- START TIME ---------------- */

  startPicker = flatpickr(startInput, {
    enableTime: true,
    noCalendar: true,
    altInput: true,
    altFormat: "h:i K", // 5:30 PM
    dateFormat: "H:i",
    time_24hr: false,
    onChange: () => applyFloatingState(startInput)                  
  });

  /* ---------------- END TIME ---------------- */

  endPicker = flatpickr(endInput, {
    enableTime: true,
    noCalendar: true,
    altInput: true,
    altFormat: "h:i K",
    dateFormat: "H:i",
    time_24hr: false,
    onChange: () => applyFloatingState(endInput)
  });
}


/* ---------------- CLEAN VALUE RETURN ---------------- */

export function getEventDateTimeValues() {

  if (
    !datePicker?.selectedDates.length ||
    !startPicker?.selectedDates.length ||
    !endPicker?.selectedDates.length
  ) {
    alert("Please select date and time.");
    return null;
  }

  const date = datePicker.selectedDates[0];
  const startTime = startPicker.selectedDates[0];
  const endTime = endPicker.selectedDates[0];

  const start = new Date(date);
  start.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

  const end = new Date(date);
  end.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

  return {
    dateISO: start.toISOString(),
    endISO: end.toISOString()
  };
}

function applyFloatingState(input: HTMLInputElement) {
  const wrapper = input.closest(".floating-field");
  if (!wrapper) return;

  if (input.value) {
    wrapper.classList.add("has-value");
  } else {
    wrapper.classList.remove("has-value");
  }
}