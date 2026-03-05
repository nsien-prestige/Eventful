export interface AgendaSlot {
    title: string;
    startTime: string;
    endTime: string;
    host: string;
    description: string;
}

export function renderAgendaSection(): string {
    return `
        <div class="section-card dynamic-section" data-section="agenda">
            <div class="dynamic-layout">

                <div class="dynamic-main">
                    <div class="agenda-header">
                        <h2>Agenda</h2>
                        <button class="delete-section-btn">Delete section</button>
                    </div>

                    <p class="section-subtext">
                        Add an itinerary, schedule, or lineup to your event.
                        Include time, description, and host.
                    </p>

                    <div id="agendaSlotList" class="agenda-slot-list"></div>

                    <button class="agenda-add-slot" id="addAgendaSlotBtn">+ Add slot</button>
                </div>

                <div class="vertical-divider"></div>

                <div class="dynamic-side">
                    <button class="delete-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3A3247" viewBox="0 0 24 24">
                            <path d="M7 19.5h10v-11H7zm11-14h-3l-1-1h-4l-1 1H6v2h12z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>

            </div>
        </div>
    `;
}

export function setupAgendaSection(sectionElement: HTMLElement): void {
    const slotList   = sectionElement.querySelector("#agendaSlotList") as HTMLElement;
    const addSlotBtn = sectionElement.querySelector("#addAgendaSlotBtn") as HTMLButtonElement;

    let slotCount = 0;

    function createSlotCard(): HTMLElement {
        const id = slotCount++;
        const card = document.createElement("div");
        card.className = "agenda-slot-card";
        card.dataset.slotId = String(id);

        card.innerHTML = `
            <div class="agenda-slot-header">
                <span class="agenda-slot-number">Slot ${id + 1}</span>
                <button class="agenda-slot-remove" type="button">Remove</button>
            </div>

            <input class="agenda-slot-title" type="text" placeholder="Title *" />

            <div class="agenda-time-row">
                <input class="agenda-slot-start" type="text" placeholder="Start time" />
                <input class="agenda-slot-end" type="text" placeholder="End time" />
            </div>

            <div class="agenda-actions">
                <button class="agenda-action-btn agenda-toggle-host" type="button">
                    <span class="left-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3A3247" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M11.998 6.002c1.208 0 2.19.982 2.19 2.19s-.982 2.191-2.19 2.191a2.194 2.194 0 0 1-2.191-2.19c0-1.209.982-2.191 2.19-2.191ZM12 12.386A4.193 4.193 0 1 0 12 4a4.193 4.193 0 0 0 0 8.387Zm6.541 2.707a9.5 9.5 0 0 1-1.275 1.131c-.966-1.917-3.004-3.193-5.252-3.193-2.252 0-4.3 1.28-5.263 3.207a9.6 9.6 0 0 1-1.292-1.145L4 16.46C6.135 18.743 8.976 20 12.001 20s5.865-1.257 7.999-3.538zm-10.05 2.166a8.7 8.7 0 0 0 7.044-.01c-.604-1.322-1.983-2.214-3.52-2.214-1.54 0-2.923.897-3.524 2.224" clip-rule="evenodd"></path>
                        </svg>
                    </span>
                    Host or Artist
                </button>

                <button class="agenda-action-btn agenda-toggle-desc" type="button">
                    <span class="left-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3A3247" viewBox="0 0 24 24">
                            <path d="M6 5H4v2h2zm0 6H4v2h2zm-2 6h2v2H4zM20 5H8v2h12zM8 11h12v2H8zm12 6H8v2h12z" clip-rule="evenodd"></path>
                        </svg>
                    </span>
                    Add description
                </button>
            </div>

            <input class="agenda-slot-host agenda-slot-optional" type="text" placeholder="Host or Artist name" />
            <textarea class="agenda-slot-desc agenda-slot-optional" rows="3" placeholder="Describe this slot..."></textarea>
        `;

        card.querySelector(".agenda-slot-remove")!.addEventListener("click", () => {
            card.remove();
            renumberSlots();
        });

        const toggleHost  = card.querySelector(".agenda-toggle-host") as HTMLButtonElement;
        const hostInput   = card.querySelector(".agenda-slot-host") as HTMLInputElement;
        toggleHost.addEventListener("click", () => {
            const isHidden = hostInput.classList.toggle("agenda-slot-optional");
            if (!isHidden) hostInput.focus();
            else hostInput.value = "";
        });

        const toggleDesc = card.querySelector(".agenda-toggle-desc") as HTMLButtonElement;
        const descInput  = card.querySelector(".agenda-slot-desc") as HTMLTextAreaElement;
        toggleDesc.addEventListener("click", () => {
            const isHidden = descInput.classList.toggle("agenda-slot-optional");
            if (!isHidden) descInput.focus();
            else descInput.value = "";
        });

        return card;
    }

    function renumberSlots(): void {
        slotList.querySelectorAll(".agenda-slot-card").forEach((card, index) => {
            const label = card.querySelector(".agenda-slot-number");
            if (label) label.textContent = `Slot ${index + 1}`;
        });
    }

    addSlotBtn.addEventListener("click", () => {
        slotList.appendChild(createSlotCard());
    });

    // Start with one slot by default
    slotList.appendChild(createSlotCard());
}

export function getAgendaData(): AgendaSlot[] {
    const slotList = document.querySelector("#agendaSlotList");
    if (!slotList) return [];

    return Array.from(slotList.querySelectorAll(".agenda-slot-card")).map((card) => ({
        title:       (card.querySelector(".agenda-slot-title") as HTMLInputElement).value.trim(),
        startTime:   (card.querySelector(".agenda-slot-start") as HTMLInputElement).value.trim(),
        endTime:     (card.querySelector(".agenda-slot-end") as HTMLInputElement).value.trim(),
        host:        (card.querySelector(".agenda-slot-host") as HTMLInputElement).value.trim(),
        description: (card.querySelector(".agenda-slot-desc") as HTMLTextAreaElement).value.trim(),
    }));
}
