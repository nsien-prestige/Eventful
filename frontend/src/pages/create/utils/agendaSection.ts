import "./agendaSection.css";
import "../createEventPage.css"

export interface AgendaSlot {
    title: string;
    startTime: string;
    endTime: string;
    host: string;
    description: string;
}

let slotCounter = 0;

export function renderAgendaSection(): string {
    return `
        <div class="section-card agenda-section" data-section="agenda">

            <div class="agenda-top-bar">
                <h2 class="agenda-title">Agenda</h2>
                <button class="delete-section-btn agenda-delete-btn" type="button">Delete section</button>
            </div>

            <p class="agenda-description">
                Add an itinerary, schedule, or lineup to your event. You can include a time,
                a description of what will happen, and who will host or perform during the event.
                (Ex. Speaker, performer, artist, guide, etc.)
            </p>

            <!-- SLOT LIST -->
            <div class="agenda-slot-list" id="agendaSlotList"></div>

            <!-- ADD SLOT BUTTON -->
            <button class="agenda-add-slot-btn" id="addAgendaSlotBtn" type="button">
                + Add slot
            </button>

        </div>
    `;
}

export function setupAgendaSection(sectionElement: HTMLElement): void {
    const slotListEl = sectionElement.querySelector("#agendaSlotList") as HTMLElement;
    const addSlotBtn = sectionElement.querySelector("#addAgendaSlotBtn") as HTMLButtonElement;

    /* ── Add a slot card ── */
    function addSlot(): void {
        const slotId = slotCounter++;
        const card   = document.createElement("div");
        card.className      = "agenda-slot-card";
        card.dataset.slotId = String(slotId);

        card.innerHTML = `
            <div class="agenda-slot-top">
                <div class="agenda-slot-title-field">
                    <label class="agenda-slot-title-label" for="slotTitle_${slotId}">Title <span class="agenda-required">*</span></label>
                    <input
                        class="agenda-slot-title-input"
                        id="slotTitle_${slotId}"
                        type="text"
                        placeholder=""
                        autocomplete="off"
                    />
                    <span class="agenda-slot-error hidden" id="slotError_${slotId}">Title can't be left blank</span>
                </div>
                <button class="agenda-slot-trash" type="button" title="Remove slot">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </div>

            <div class="agenda-time-row">
                <button class="agenda-time-btn" data-target="slotStart_${slotId}" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span class="agenda-time-label" id="startLabel_${slotId}">Start time</span>
                    <input class="agenda-time-input agenda-slot-start" id="slotStart_${slotId}" type="text" placeholder="Start time" readonly />
                </button>
                <button class="agenda-time-btn" data-target="slotEnd_${slotId}" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span class="agenda-time-label" id="endLabel_${slotId}">End time</span>
                    <input class="agenda-time-input agenda-slot-end" id="slotEnd_${slotId}" type="text" placeholder="End time" readonly />
                </button>
            </div>

            <div class="agenda-inline-actions">
                <button class="agenda-inline-btn agenda-toggle-host" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3A3247" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M11.998 6.002c1.208 0 2.19.982 2.19 2.19s-.982 2.191-2.19 2.191a2.194 2.194 0 0 1-2.191-2.19c0-1.209.982-2.191 2.19-2.191ZM12 12.386A4.193 4.193 0 1 0 12 4a4.193 4.193 0 0 0 0 8.387Zm6.541 2.707a9.5 9.5 0 0 1-1.275 1.131c-.966-1.917-3.004-3.193-5.252-3.193-2.252 0-4.3 1.28-5.263 3.207a9.6 9.6 0 0 1-1.292-1.145L4 16.46C6.135 18.743 8.976 20 12.001 20s5.865-1.257 7.999-3.538zm-10.05 2.166a8.7 8.7 0 0 0 7.044-.01c-.604-1.322-1.983-2.214-3.52-2.214-1.54 0-2.923.897-3.524 2.224" clip-rule="evenodd"></path>
                    </svg>
                    Host or Artist
                </button>
                <button class="agenda-inline-btn agenda-toggle-desc" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3A3247" viewBox="0 0 24 24">
                        <path d="M6 5H4v2h2zm0 6H4v2h2zm-2 6h2v2H4zM20 5H8v2h12zM8 11h12v2H8zm12 6H8v2h12z" clip-rule="evenodd"></path>
                    </svg>
                    Add description
                </button>
            </div>

            <input   class="agenda-slot-host agenda-collapsible-field hidden" type="text" placeholder="Host or Artist name" />
            <textarea class="agenda-slot-desc agenda-collapsible-field hidden" rows="3"   placeholder="Describe this slot..."></textarea>
        `;

        /* Title validation */
        const titleInput = card.querySelector(".agenda-slot-title-input") as HTMLInputElement;
        const errorEl    = card.querySelector(`#slotError_${slotId}`) as HTMLElement;

        titleInput.addEventListener("blur", () => {
            if (!titleInput.value.trim()) {
                titleInput.classList.add("has-error");
                errorEl.classList.remove("hidden");
            }
        });
        titleInput.addEventListener("input", () => {
            if (titleInput.value.trim()) {
                titleInput.classList.remove("has-error");
                errorEl.classList.add("hidden");
            }
        });

        /* Time buttons */
        card.querySelectorAll<HTMLButtonElement>(".agenda-time-btn").forEach(btn => {
            const targetId   = btn.dataset.target!;
            const hiddenInput = card.querySelector(`#${targetId}`) as HTMLInputElement;
            const labelEl    = btn.querySelector(".agenda-time-label") as HTMLElement;

            btn.addEventListener("click", () => {
                hiddenInput.type          = "time";
                hiddenInput.style.display = "block";
                hiddenInput.focus();
            });

            hiddenInput.addEventListener("change", () => {
                const val = hiddenInput.value;
                if (val) {
                    const [h, m] = val.split(":").map(Number);
                    const ampm   = h >= 12 ? "PM" : "AM";
                    labelEl.textContent = `${((h % 12) || 12)}:${String(m).padStart(2, "0")} ${ampm}`;
                    btn.classList.add("has-value");
                }
                hiddenInput.style.display = "none";
                hiddenInput.type          = "text";
            });

            hiddenInput.addEventListener("blur", () => {
                hiddenInput.style.display = "none";
                hiddenInput.type          = "text";
            });
        });

        /* Trash */
        card.querySelector(".agenda-slot-trash")!.addEventListener("click", () => card.remove());

        const hostInput = card.querySelector(".agenda-slot-host") as HTMLInputElement;
        const hostBtn   = card.querySelector(".agenda-toggle-host") as HTMLButtonElement;
        hostBtn.addEventListener("click", () => {
            const isHidden = hostInput.classList.toggle("hidden");
            hostBtn.classList.toggle("active", !isHidden);
            if (!isHidden) hostInput.focus();
            else hostInput.value = "";
        });

        /* Description toggle — button disappears, field appears permanently above host */
        const descInput = card.querySelector(".agenda-slot-desc") as HTMLTextAreaElement;
        const descBtn   = card.querySelector(".agenda-toggle-desc") as HTMLButtonElement;
        descBtn.addEventListener("click", () => {
            descBtn.classList.add("hidden");
            descInput.classList.remove("hidden");
            // Always move descInput before hostInput in the DOM
            hostInput.insertAdjacentElement("beforebegin", descInput);
            descInput.focus();
        });
        
        slotListEl.appendChild(card);
    }

    /* ── Wire up + Add slot button ── */
    addSlotBtn.addEventListener("click", () => addSlot());

    /* ── Init with one slot ── */
    addSlot();
}

export function getAgendaData(): AgendaSlot[] {
    return Array.from(document.querySelectorAll(".agenda-slot-card")).map(card => ({
        title:       (card.querySelector(".agenda-slot-title-input") as HTMLInputElement)?.value.trim()    ?? "",
        startTime:   (card.querySelector(".agenda-slot-start")       as HTMLInputElement)?.value.trim()    ?? "",
        endTime:     (card.querySelector(".agenda-slot-end")         as HTMLInputElement)?.value.trim()    ?? "",
        host:        (card.querySelector(".agenda-slot-host")        as HTMLInputElement)?.value.trim()    ?? "",
        description: (card.querySelector(".agenda-slot-desc")        as HTMLTextAreaElement)?.value.trim() ?? "",
    }));
}