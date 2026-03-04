/// <reference types="google.maps" />
import "./createEventPage.css";
import { initDatePickers } from "../../components/date-picker/DatePicker";

export function renderCreateEventPage() {
    const app = document.getElementById("app")!;

    app.innerHTML = `
        <div class="create-page" id="createPageRoot">

            <!-- IMAGE SECTION -->
            <div class="section-card">
                <h2>Event Image</h2>
                <p class="section-subtext">
                    Upload a high-quality banner to grab attention.
                    Recommended size: 1200 x 600.
                </p>

                <div class="upload-area" id="uploadArea">
                    <input type="file" id="imageInput" accept="image/*" hidden />
                    
                    <div class="upload-content" id="uploadContent">
                        <div class="upload-icon">📷</div>
                        <p><strong>Click to upload</strong> or drag and drop</p>
                        <span>PNG, JPG up to 5MB</span>
                    </div>

                    <img id="imagePreview" class="image-preview hidden" />
                </div>
            </div>

            <!-- TITLE SECTION -->
            ${renderTitleSection()}

            <!-- DATE SECTION -->
            ${renderDateSection()}

            <!-- DYNAMIC SECTIONS WILL BE INSERTED HERE -->
            <div id="dynamicSections"></div>

            <!-- ADD MORE SECTIONS BLOCK -->
            <div class="section-card add-sections-block" id="addSectionsBlock">

                <h2>Add more sections to your event page</h2>
                <p class="section-subtext">
                    Make your event stand out even more. These sections help attendees 
                    find information easily and boost ticket sales.
                </p>

                <div id="addAgendaItem" class="add-section-item">
                    <div class="add-section-left">
                        <div class="add-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3A3247" viewBox="0 0 24 24"><path d="M16 10h2V6h-2V4h-2v2H8V4H6v2H4v13h7.5v-2H6v-7zm4.5 1.5H13v1.667h7.5zM13 14.416h7.5v1.667H13v-1.666Zm7.5 2.918H13V19h7.5z" clip-rule="evenodd"></path></svg></div>
                        <div>
                            <div class="add-title-row">
                                <h3>Agenda</h3>
                            </div>
                        </div>
                    </div>
                    <button class="add-btn" id="addAgendaBtn">Add</button>
                </div>

                <div class="divider" id="addDivider"></div>

                <div id="addPricingItem" class="add-section-item">
                    <div class="add-section-left">
                        <div class="add-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                            </svg></div>
                        <div>
                            <div class="add-title-row">
                                <h3>Pricing</h3>
                            </div>
                        </div>
                    </div>
                    <button class="add-btn" id="addPricingBtn">Add</button>
                </div>

            </div>

        </div>
    `;

    setupImageUpload();
    setupCollapsible();
    setupDateCollapsible();
    initDatePickers();
    loadGoogleMaps();
    initSectionProgress();
    setupAddSectionLogic();   // 🔥 NEW
}

function renderTitleSection() {
    return `
        <div class="section-card collapsible" id="titleSection">
            <div class="section-header" id="titleHeader">
                <div class="section-heading-group">
                    <h2 id="titleHeading">Event Title</h2>
                    <p class="section-subtext" id="titleSubtext">
                        Give your event a clear name and explain what it’s about.
                    </p>
                </div>

                <div class="section-actions">
                    <button class="expand-btn" id="titleToggle">+</button>

                    <div class="section-status" id="titleStatus">
                        <svg viewBox="0 0 24 24" class="check-icon">
                            <path d="M20 6L9 17L4 12" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="section-content hidden" id="titleContent">
                <div class="field-group">
                    <label>Event Title</label>
                    <p class="field-help">
                        Choose a title that clearly describes your event.
                        Keep it concise and engaging.
                    </p>
                    <input type="text" id="title" placeholder="e.g. Tech Networking Meetup 2026" />
                </div>

                <div class="field-group">
                    <label>Description</label>
                    <p class="field-help">
                        Tell attendees what they can expect. Include key details
                        like schedule highlights and special experiences.
                    </p>
                    <textarea id="description" rows="5"
                        placeholder="Describe your event here..."></textarea>
                </div>
            </div>
        </div>
    `;
}

function renderDateSection() {
    return `
        <div class="section-card collapsible" id="dateSection">
            <div class="section-header" id="dateHeader">
                <div class="section-heading-group">
                    <h2 id="dateHeading">Date & Location</h2>
                    <p class="section-subtext" id="dateSubtext">
                        Set the event date, time, and choose the location.
                    </p>
                </div>

                <div class="section-actions">
                    <button class="expand-btn" id="dateToggle">+</button>

                    <div class="section-status" id="dateStatus">
                        <svg viewBox="0 0 24 24" class="check-icon">
                            <path d="M20 6L9 17L4 12" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="section-content hidden" id="dateContent">
                <div class="group-label">Date and Time</div>

                <div class="event-time-grid">
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

                <div class="group-label">Location</div>

                <div class="floating-field">
                    <input type="text" id="locationSearch" placeholder=" " />
                    <label for="locationSearch">Location</label>
                </div>

                <div id="map" class="hidden"></div>
            </div>
        </div>
    `;
}

/* ---------------- IMAGE UPLOAD ---------------- */

function setupImageUpload() {
    const uploadArea = document.getElementById("uploadArea")!;
    const imageInput = document.getElementById("imageInput") as HTMLInputElement;
    const imagePreview = document.getElementById("imagePreview") as HTMLImageElement;
    const uploadContent = document.getElementById("uploadContent")!;

    uploadArea.addEventListener("click", () => {
        imageInput.click();
    });

    imageInput.addEventListener("change", () => {
        if (imageInput.files && imageInput.files[0]) {
            const file = imageInput.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                imagePreview.src = e.target?.result as string;
                imagePreview.classList.remove("hidden");
                uploadContent.classList.add("hidden");
            };

            reader.readAsDataURL(file);
        }
    });

    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("dragging");
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("dragging");
    });

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.classList.remove("dragging");

        const files = e.dataTransfer?.files;
        if (files && files[0]) {
            imageInput.files = files;

            const reader = new FileReader();
            reader.onload = (ev) => {
                imagePreview.src = ev.target?.result as string;
                imagePreview.classList.remove("hidden");
                uploadContent.classList.add("hidden");
            };

            reader.readAsDataURL(files[0]);
        }
    });
}

/* ---------------- COLLAPSIBLE SECTION ---------------- */

function setupCollapsible() {
    const header = document.getElementById("titleHeader")!;
    const content = document.getElementById("titleContent")!;
    const toggle = document.getElementById("titleToggle")!;
    const subtext = document.getElementById("titleSubtext")!;

    header.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest(".expand-btn") === null &&
            !(e.target as HTMLElement).closest(".section-header")) return;

        const isHidden = content.classList.contains("hidden");

        content.classList.toggle("hidden");
        toggle.textContent = isHidden ? "−" : "+";

        subtext.style.display = isHidden ? "none" : "block";
    });
}

/* ---------------- DATE COLLAPSIBLE ---------------- */

function setupDateCollapsible() {
    const header = document.getElementById("dateHeader")!;
    const content = document.getElementById("dateContent")!;
    const toggle = document.getElementById("dateToggle")!;
    const subtext = document.getElementById("dateSubtext")!;

    header.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest(".expand-btn") === null &&
            !(e.target as HTMLElement).closest(".section-header")) return;

        const isHidden = content.classList.contains("hidden");

        content.classList.toggle("hidden");
        toggle.textContent = isHidden ? "−" : "+";

        subtext.style.display = isHidden ? "none" : "block";
    });
}

/* ---------------- GOOGLE MAPS ---------------- */

function loadGoogleMaps() {
    if ((window as any).google) {
        initMap();
        return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAYB4cCId58nh_j4sC3LJvEAL_xj8mO4tU&libraries=places&callback=initMap`;
    script.async = true;

    document.head.appendChild(script);

    (window as any).initMap = initMap;
}

let map: google.maps.Map;
let marker: google.maps.marker.AdvancedMarkerElement | null = null;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    const mapElement = document.getElementById("map") as HTMLElement;
    const input = document.getElementById("locationSearch") as HTMLInputElement;

    map = new Map(mapElement, {
        center: { lat: -25.2744, lng: 133.7751 },
        zoom: 5,
    });

    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        mapElement.classList.remove("hidden");

        if (!place.geometry || !place.geometry.location) return;

        map.setCenter(place.geometry.location as google.maps.LatLng);
        map.setZoom(15);

        if (marker) {
            marker.map = null
        };

        marker = new AdvancedMarkerElement({
            map,
            position: place.geometry.location,
        });
    });
}

function initSectionProgress() {

    /* ============================================================
       GENERIC HELPERS
    ============================================================ */

    function isSectionFocused(sectionContentId: string): boolean {
        const section = document.getElementById(sectionContentId);
        if (!section) return false;

        const inputs = section.querySelectorAll("input, textarea");
        return Array.from(inputs).some(
            (input) => input === document.activeElement
        );
    }

    function handleCompletion(
        isComplete: boolean,
        wasComplete: { value: boolean },
        statusEl: HTMLElement,
        contentId: string,
        toggleId: string
    ) {
        statusEl.classList.toggle("completed", isComplete);

        if (isComplete && !wasComplete.value) {
            wasComplete.value = true;

            // Only collapse if user is NOT actively typing
            if (!isSectionFocused(contentId)) {
                setTimeout(() => {
                    collapseSection(contentId, toggleId);
                }, 500);

                launchConfetti(statusEl);
            }
        }

        if (!isComplete) {
            wasComplete.value = false;
        }
    }

    /* ============================================================
       TITLE SECTION
    ============================================================ */

    const titleInput = document.getElementById("title") as HTMLInputElement;
    const descriptionInput = document.getElementById("description") as HTMLTextAreaElement;
    const titleStatus = document.getElementById("titleStatus")!;
    const titleState = { value: false };

    function validateTitleSection() {
        const isComplete =
            titleInput.value.trim().length > 0 &&
            descriptionInput.value.trim().length > 0;

        handleCompletion(
            isComplete,
            titleState,
            titleStatus,
            "titleContent",
            "titleToggle"
        );
    }

    titleInput.addEventListener("input", validateTitleSection);
    descriptionInput.addEventListener("input", validateTitleSection);

    // Extra safety: collapse when leaving section after completion
    document.getElementById("titleContent")?.addEventListener("focusout", () => {
        if (titleState.value && !isSectionFocused("titleContent")) {
            collapseSection("titleContent", "titleToggle");
        }
    });

    /* ============================================================
       DATE & LOCATION SECTION
    ============================================================ */

    const dateInput = document.getElementById("eventDate") as HTMLInputElement;
    const startInput = document.getElementById("startTime") as HTMLInputElement;
    const endInput = document.getElementById("endTime") as HTMLInputElement;
    const locationInput = document.getElementById("locationSearch") as HTMLInputElement;
    const dateStatus = document.getElementById("dateStatus")!;
    const dateState = { value: false };

    function validateDateSection() {
        const isComplete =
            !!dateInput.value &&
            !!startInput.value &&
            !!endInput.value &&
            locationInput.value.trim().length > 0;

        handleCompletion(
            isComplete,
            dateState,
            dateStatus,
            "dateContent",
            "dateToggle"
        );
    }

    dateInput.addEventListener("change", validateDateSection);
    startInput.addEventListener("change", validateDateSection);
    endInput.addEventListener("change", validateDateSection);
    locationInput.addEventListener("input", validateDateSection);

    // Collapse when user leaves section after it's complete
    document.getElementById("dateContent")?.addEventListener("focusout", () => {
        if (dateState.value && !isSectionFocused("dateContent")) {
            collapseSection("dateContent", "dateToggle");
        }
    });
}

function collapseSection(contentId: string, toggleId: string) {

    const content = document.getElementById(contentId)!;
    const toggle = document.getElementById(toggleId)!;

    content.style.height = content.scrollHeight + "px";

    requestAnimationFrame(() => {
        content.style.transition = "height 0.35s ease, opacity 0.25s ease";
        content.style.height = "0px";
        content.style.opacity = "0";
    });

    setTimeout(() => {
        content.classList.add("hidden");
        content.style.height = "";
        content.style.opacity = "";
        content.style.transition = "";
    }, 350);

    toggle.textContent = "+";
}

function launchConfetti(target: HTMLElement) {

    const rect = target.getBoundingClientRect();

    for (let i = 0; i < 14; i++) {

        const particle = document.createElement("span");
        particle.className = "confetti";

        particle.style.left = rect.left + rect.width / 2 + "px";
        particle.style.top = rect.top + rect.height / 2 + "px";

        particle.style.setProperty("--x", (Math.random() * 160 - 80) + "px");
        particle.style.setProperty("--y", (Math.random() * -140 - 40) + "px");

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 900);
    }
}

function setupAddSectionLogic() {

    const sectionState = {
        agenda: false,
        pricing: false
    }

    const addAgendaBtn = document.getElementById("addAgendaBtn");
    const addPricingBtn = document.getElementById("addPricingBtn");

    const dynamicContainer = document.getElementById("dynamicSections")!;
    const addBlock = document.getElementById("addSectionsBlock")!;

    addAgendaBtn?.addEventListener("click", () => {

        const agendaCard = document.createElement("div");
        agendaCard.innerHTML = renderAgendaSection();

        const sectionElement = agendaCard.firstElementChild as HTMLElement;
        dynamicContainer.appendChild(sectionElement);

        sectionState.agenda = true;
        setupDeleteSection(sectionElement);

        document.getElementById("addAgendaItem")?.remove();
        cleanupDivider();
    });

    addPricingBtn?.addEventListener("click", () => {

        const pricingCard = document.createElement("div");
        pricingCard.innerHTML = renderPricingSection();

        const sectionElement = pricingCard.firstElementChild as HTMLElement;
        dynamicContainer.appendChild(sectionElement);

        sectionState.pricing = true;
        setupDeleteSection(sectionElement);

        document.getElementById("addPricingItem")?.remove();
        cleanupDivider();
    });

    function cleanupDivider() {
        const agendaExists = document.getElementById("addAgendaItem");
        const pricingExists = document.getElementById("addPricingItem");
        const divider = document.getElementById("addDivider");

        if (!agendaExists || !pricingExists) {
            divider?.remove();
        }

        if (!agendaExists && !pricingExists) {
            addBlock.remove();
        }
    }

    function setupDeleteSection(sectionElement: HTMLElement) {

        const deleteBtn = sectionElement.querySelector(".delete-section-btn");

        deleteBtn?.addEventListener("click", () => {

            const heading = sectionElement.querySelector("h2")?.textContent;

            sectionElement.remove();

            if (heading === "Agenda") {
                sectionState.agenda = false;
                restoreAddItem("Agenda");
            }

            if (heading === "Pricing") {
                sectionState.pricing = false;
                restoreAddItem("Pricing");
            }
        });
    }

    function restoreAddItem(type: "Agenda" | "Pricing") {

        const addBlock = document.getElementById("addSectionsBlock");
        if (!addBlock) return;

        if (type === "Agenda" && !document.getElementById("addAgendaItem")) {

            addBlock.insertAdjacentHTML("beforeend", `
                <div id="addAgendaItem" class="add-section-item">
                    <div class="add-section-left">
                        <div class="add-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3A3247" viewBox="0 0 24 24">
                                <path d="M16 10h2V6h-2V4h-2v2H8V4H6v2H4v13h7.5v-2H6v-7zm4.5 1.5H13v1.667h7.5zM13 14.416h7.5v1.667H13v-1.666Zm7.5 2.918H13V19h7.5z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div>
                            <div class="add-title-row">
                                <h3>Agenda</h3>
                            </div>
                        </div>
                    </div>
                    <button class="add-btn" data-type="agenda">Add</button>
                </div>
            `);
        }

        if (type === "Pricing" && !document.getElementById("addPricingItem")) {

            addBlock.insertAdjacentHTML("beforeend", `
                <div id="addPricingItem" class="add-section-item">
                    <div class="add-section-left">
                        <div class="add-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                            </svg>
                        </div>
                        <div>
                            <div class="add-title-row">
                                <h3>Pricing</h3>
                            </div>
                        </div>
                    </div>
                    <button class="add-btn" data-type="pricing">Add</button>
                </div>
            `);
        }
    }

    addBlock.addEventListener("click", (e) => {

        const target = e.target as HTMLElement;
        const addBtn = target.closest(".add-btn") as HTMLElement;

        if (!addBtn) return;

        const type = addBtn.dataset.type;

        const dynamicContainer = document.getElementById("dynamicSections")!;

        if (type === "agenda" && !sectionState.agenda) {

            const agendaCard = document.createElement("div");
            agendaCard.innerHTML = renderAgendaSection();

            const sectionElement = agendaCard.firstElementChild as HTMLElement;
            dynamicContainer.appendChild(sectionElement);

            setupDeleteSection(sectionElement);

            document.getElementById("addAgendaItem")?.remove();

            sectionState.agenda = true;
        }

        if (type === "pricing" && !sectionState.pricing) {

            const pricingCard = document.createElement("div");
            pricingCard.innerHTML = renderPricingSection();

            const sectionElement = pricingCard.firstElementChild as HTMLElement;
            dynamicContainer.appendChild(sectionElement);

            setupDeleteSection(sectionElement);

            document.getElementById("addPricingItem")?.remove();

            sectionState.pricing = true;
        }
    });
}

function renderAgendaSection() {
    return `
        <div class="section-card dynamic-section">

            <div class="dynamic-layout">

                <!-- LEFT CONTENT -->
                <div class="dynamic-main">

                    <div class="agenda-header">
                        <h2>Agenda</h2>
                        <button class="delete-section-btn" id="deleteAgenda">
                            Delete section
                        </button>
                    </div>

                    <p class="section-subtext">
                        Add an itinerary, schedule, or lineup to your event.
                        Include time, description, and host.
                    </p>

                    <div class="agenda-form">

                        <!-- FULL WIDTH TITLE -->
                        <input type="text" placeholder="Title *" />

                        <!-- TIME ROW (NOT FULL WIDTH) -->
                        <div class="agenda-time-row">
                            <input type="text" placeholder="Start time" />
                            <input type="text" placeholder="End time" />
                        </div>

                        <!-- ACTION BUTTONS -->
                        <div class="agenda-actions">

                            <button class="agenda-action-btn">
                                <span class="left-icon">
                                    <!-- HOST SVG PLACEHOLDER -->
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3A3247" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M11.998 6.002c1.208 0 2.19.982 2.19 2.19s-.982 2.191-2.19 2.191a2.194 2.194 0 0 1-2.191-2.19c0-1.209.982-2.191 2.19-2.191ZM12 12.386A4.193 4.193 0 1 0 12 4a4.193 4.193 0 0 0 0 8.387Zm6.541 2.707a9.5 9.5 0 0 1-1.275 1.131c-.966-1.917-3.004-3.193-5.252-3.193-2.252 0-4.3 1.28-5.263 3.207a9.6 9.6 0 0 1-1.292-1.145L4 16.46C6.135 18.743 8.976 20 12.001 20s5.865-1.257 7.999-3.538zm-10.05 2.166a8.7 8.7 0 0 0 7.044-.01c-.604-1.322-1.983-2.214-3.52-2.214-1.54 0-2.923.897-3.524 2.224" clip-rule="evenodd"></path></svg>
                                </span>
                                Host or Artist
                            </button>

                            <button class="agenda-action-btn">
                                <span class="left-icon">
                                    <!-- DESCRIPTION SVG PLACEHOLDER -->
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3A3247" viewBox="0 0 24 24"><path d="M6 5H4v2h2zm0 6H4v2h2zm-2 6h2v2H4zM20 5H8v2h12zM8 11h12v2H8zm12 6H8v2h12z" clip-rule="evenodd"></path></svg>
                                </span>
                                Add description
                            </button>

                        </div>

                        <button class="agenda-add-slot">
                            + Add slot
                        </button>

                    </div>
                </div>

                <!-- VERTICAL DIVIDER -->
                <div class="vertical-divider"></div>

                <!-- DELETE BUTTON -->
                <div class="dynamic-side">
                    <button class="delete-btn" id="deleteAgenda">
                        <!-- DELETE SVG PLACEHOLDER -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3A3247" viewBox="0 0 24 24"><path d="M7 19.5h10v-11H7zm11-14h-3l-1-1h-4l-1 1H6v2h12z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>

            </div>
        </div>
    `;
}

function renderPricingSection() {
    return `
        <div class="section-card dynamic-section">

            <div class="dynamic-layout">

                <div class="dynamic-main">

                    <div class="agenda-header">
                        <h2>Pricing</h2>
                        <button class="delete-section-btn" id="deletePricing">
                            Delete section
                        </button>
                    </div>

                    <p class="section-subtext">
                        Add ticket types and prices for your event.
                    </p>

                    <div class="pricing-form">

                        <input type="text" placeholder="Ticket name (e.g. Early Bird)" />

                        <div class="agenda-time-row">
                            <input type="number" placeholder="Price" />
                            <input type="number" placeholder="Quantity" />
                        </div>

                        <button class="agenda-add-slot">
                            + Add ticket
                        </button>

                    </div>
                </div>

                <div class="vertical-divider"></div>

                <div class="dynamic-side">
                    <button class="delete-btn" id="deletePricing">
                        <!-- DELETE SVG PLACEHOLDER -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3A3247" viewBox="0 0 24 24"><path d="M7 19.5h10v-11H7zm11-14h-3l-1-1h-4l-1 1H6v2h12z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>

            </div>
        </div>
    `;
}

