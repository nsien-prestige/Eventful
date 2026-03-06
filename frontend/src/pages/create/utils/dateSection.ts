import "./dateSection.css";
export type LocationMode = "in-person" | "online" | "tbd";

export function renderDateSection(): string {
    return `
        <div class="section-card collapsible" id="dateSection">
            <div class="section-header" id="dateHeader">

                <!-- DEFAULT STATE: shown when incomplete or open for editing -->
                <div class="section-heading-group" id="dateDefaultHeader">
                    <h2 id="dateHeading">Date &amp; Location</h2>
                    <p class="section-subtext" id="dateSubtext">
                        When is your event and where will it take place?
                    </p>
                </div>

                <!-- PREVIEW STATE: only revealed by updateDatePreview() after completion -->
                <div class="date-preview-header hidden" id="datePreviewHeader">
                    <div class="date-preview-col">
                        <p class="date-preview-col-title">Date and time</p>
                        <p class="date-preview-value">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                            <span id="datePreviewDatetimeText">—</span>
                        </p>
                    </div>

                    <div class="date-preview-divider"></div>

                    <div class="date-preview-col">
                        <p class="date-preview-col-title">Location</p>
                        <p class="date-preview-value">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <span id="datePreviewLocationText">—</span>
                        </p>
                    </div>
                </div>

                <div class="section-actions">
                    <div class="section-status" id="dateStatus">
                        <svg viewBox="0 0 24 24" class="check-icon">
                            <path d="M20 6L9 17L4 12" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="section-content hidden" id="dateContent">

                <!-- LOCATION TYPE TOGGLE -->
                <div class="field-group">
                    <label>Location type</label>
                    <div class="location-type-toggle">
                        <button class="loc-pill active" data-mode="in-person" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            In-person
                        </button>
                        <button class="loc-pill" data-mode="online" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253" />
                            </svg>
                            Online
                        </button>
                        <button class="loc-pill" data-mode="tbd" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                            </svg>
                            TBD
                        </button>
                    </div>
                </div>

                <!-- DATE & TIME -->
                <div class="field-group">
                    <label>Date and time <span class="field-required">*</span></label>
                    <div class="date-time-grid">
                        <div class="floating-field">
                            <input type="text" id="eventDate" placeholder=" " />
                            <label for="eventDate">Event Date</label>
                        </div>
                        <div class="floating-field">
                            <input type="text" id="startTime" placeholder=" " />
                            <label for="startTime">Start Time</label>
                        </div>
                        <div class="floating-field">
                            <input type="text" id="endTime" placeholder=" " />
                            <label for="endTime">End Time</label>
                        </div>
                    </div>
                </div>

                <!-- IN-PERSON: VENUE -->
                <div id="venueBlock" class="field-group">
                    <label for="locationSearch">Venue <span class="field-required">*</span></label>
                    <p class="field-help">Search for an address or venue name.</p>
                    <div class="floating-field" style="margin-bottom: 0">
                        <input type="text" id="locationSearch" placeholder=" " />
                        <label for="locationSearch">Search address or venue</label>
                    </div>
                    <div id="map" class="hidden"></div>
                </div>

                <!-- ONLINE: MEETING LINK -->
                <div id="onlineBlock" class="field-group hidden">
                    <label for="meetingLink">Meeting link <span class="field-required">*</span></label>
                    <p class="field-help">Add a Zoom, Google Meet, or other video link.</p>
                    <input
                        type="url"
                        id="meetingLink"
                        class="field-input"
                        placeholder="https://zoom.us/j/..."
                    />
                </div>

                <!-- TBD NOTE -->
                <div id="tbdBlock" class="tbd-note hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <p>Location is to be determined. Attendees will be notified once confirmed.</p>
                </div>

            </div>
        </div>
    `;
}

export function setupDateSection(): void {
    // Guarantee preview is hidden on init — never shows until updateDatePreview() is called
    document.getElementById("datePreviewHeader")?.classList.add("hidden");
    document.getElementById("dateDefaultHeader")?.classList.remove("hidden");

    const pills       = document.querySelectorAll<HTMLButtonElement>(".loc-pill");
    const venueBlock  = document.getElementById("venueBlock")!;
    const onlineBlock = document.getElementById("onlineBlock")!;
    const tbdBlock    = document.getElementById("tbdBlock")!;

    let currentMode: LocationMode = "in-person";

    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            const mode = pill.dataset.mode as LocationMode;
            if (mode === currentMode) return;
            currentMode = mode;
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            venueBlock.classList.toggle("hidden",  mode !== "in-person");
            onlineBlock.classList.toggle("hidden", mode !== "online");
            tbdBlock.classList.toggle("hidden",    mode !== "tbd");
        });
    });
}

export function getDateLocationMode(): LocationMode {
    const active = document.querySelector<HTMLButtonElement>(".loc-pill.active");
    return (active?.dataset.mode as LocationMode) ?? "in-person";
}

/** Reads flatpickr's altInput (the human-readable sibling) rather than the hidden raw input */
function getFlatpickrDisplayValue(inputId: string): string {
    const original = document.getElementById(inputId) as HTMLInputElement | null;
    if (!original) return "";

    // flatpickr inserts altInput as immediate next sibling of the original input
    const sibling = original.nextElementSibling as HTMLInputElement | null;
    if (sibling && sibling.tagName === "INPUT" && sibling.value) {
        return sibling.value;
    }

    // Fallback: scan the floating-field wrapper
    const wrapper = original.closest(".floating-field");
    if (wrapper) {
        for (const input of wrapper.querySelectorAll<HTMLInputElement>("input")) {
            if (input !== original && input.value) return input.value;
        }
    }

    return original.value;
}

/** Called just before collapse on completion — swaps header to two-column preview */
export function updateDatePreview(): void {
    const defaultHeader = document.getElementById("dateDefaultHeader")!;
    const previewHeader = document.getElementById("datePreviewHeader")!;

    const dateStr  = getFlatpickrDisplayValue("eventDate");
    const startStr = getFlatpickrDisplayValue("startTime");
    const endStr   = getFlatpickrDisplayValue("endTime");

    const timeRange   = [startStr, endStr].filter(Boolean).join(" - ");
    const datetimeStr = [dateStr, timeRange].filter(Boolean).join(" · ");

    document.getElementById("datePreviewDatetimeText")!.textContent = datetimeStr || "—";

    const mode = getDateLocationMode();
    const locationStr =
        mode === "online" ? "Online event" :
        mode === "tbd"    ? "Location TBD" :
        (document.getElementById("locationSearch") as HTMLInputElement)?.value.trim() || "In-person";

    document.getElementById("datePreviewLocationText")!.textContent = locationStr;

    defaultHeader.classList.add("hidden");
    previewHeader.classList.remove("hidden");
}

/** Called when the section is re-opened — restores the default "Date & Location" header */
export function restoreDateHeader(): void {
    document.getElementById("dateDefaultHeader")?.classList.remove("hidden");
    document.getElementById("datePreviewHeader")?.classList.add("hidden");
}