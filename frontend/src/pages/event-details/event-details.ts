import { getEvent } from "../../api/events.api";
import { showMessage } from "../../components/notify/notify";
import { navigate } from "../../router";
import {
    clearReminderPreset,
    getAlertPreference,
    getReminderPreset,
    isEventSaved,
    setReminderPreset,
    toggleSavedEvent,
    updateAlertPreference,
} from "../../utils/event-engagement";
import type { ReminderPreset } from "../../utils/event-engagement";
import "./event-details.css";

type TicketTier = {
    name?: string;
    price?: string | number;
    quantity?: string | number;
    isFree?: boolean;
    description?: string;
};

type AgendaItem = {
    title?: string;
    startTime?: string;
    endTime?: string;
    host?: string;
    description?: string;
};

type EventRecord = {
    id?: string;
    publicId?: string;
    title?: string;
    summary?: string;
    description?: string;
    organizer?: string;
    eventType?: string;
    category?: string;
    imageUrl?: string;
    date?: string;
    endDate?: string;
    locationType?: string;
    venueAddress?: string;
    meetingLink?: string;
    latitude?: number;
    longitude?: number;
    agenda?: AgendaItem[];
    tickets?: TicketTier[];
    ticketsSold?: number;
    bookingsCount?: number;
    status?: string;
};

function getEventKey(event: EventRecord) {
    return String(event.publicId || event.id || event.title || "event");
}

function parsePriceValue(value: unknown) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;

    if (typeof value === "string") {
        const cleaned = value.replace(/[^\d.]/g, "");
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
}

function formatPrice(value: unknown) {
    const amount = parsePriceValue(value);
    return amount > 0 ? `NGN ${amount.toLocaleString()}` : "Free";
}

function formatLongDate(dateValue?: string) {
    if (!dateValue) return "Date to be announced";

    return new Intl.DateTimeFormat("en-NG", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(dateValue));
}

function formatTime(dateValue?: string) {
    if (!dateValue) return "Time to be announced";

    return new Intl.DateTimeFormat("en-NG", {
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(dateValue));
}

function formatTimeRange(start?: string, end?: string) {
    if (!start && !end) return "Time to be announced";
    if (!end) return formatTime(start);

    return `${formatTime(start)} - ${formatTime(end)}`;
}

function isOnlineEvent(event: EventRecord) {
    const locationType = String(event.locationType || "").toLowerCase();
    return Boolean(event.meetingLink) || locationType === "online";
}

function getLocationLabel(event: EventRecord) {
    return event.venueAddress || (isOnlineEvent(event) ? "Online access" : "Venue to be announced");
}

function getPrimaryTicket(event: EventRecord) {
    if (Array.isArray(event.tickets) && event.tickets.length > 0) {
        return event.tickets.find((ticket) => !ticket.isFree && parsePriceValue(ticket.price) > 0) || event.tickets[0];
    }

    return null;
}

function getPrimaryPriceLabel(event: EventRecord) {
    const primaryTicket = getPrimaryTicket(event);
    if (!primaryTicket) return "Pricing unavailable";

    return primaryTicket.isFree || parsePriceValue(primaryTicket.price) === 0
        ? "Free"
        : formatPrice(primaryTicket.price);
}

function getPrimaryTicketNote(event: EventRecord) {
    const primaryTicket = getPrimaryTicket(event);
    const quantity = Number(primaryTicket?.quantity || 0);

    if (primaryTicket?.name && quantity > 0) {
        return `${primaryTicket.name} · ${quantity.toLocaleString()} spots`;
    }

    if (primaryTicket?.name) {
        return primaryTicket.name;
    }

    const ticketCount = getTicketTiers(event).length;
    return ticketCount
        ? `${ticketCount} ticket option${ticketCount === 1 ? "" : "s"} available`
        : "Ticket details will appear when pricing is added";
}

function getPrimaryActionLabel(event: EventRecord) {
    const primaryTicket = getPrimaryTicket(event);

    if (!primaryTicket) return "Save for later";
    if (primaryTicket.isFree || parsePriceValue(primaryTicket.price) === 0) return "Reserve free spot";

    return "Get ticket";
}

function getTicketTiers(event: EventRecord) {
    if (Array.isArray(event.tickets) && event.tickets.length > 0) {
        return event.tickets;
    }

    return [];
}

function getTotalTicketQuantity(event: EventRecord) {
    return getTicketTiers(event).reduce((total, ticket) => {
        const quantity = Number(ticket.quantity || 0);
        return total + (Number.isFinite(quantity) ? quantity : 0);
    }, 0);
}

function getAvailability(event: EventRecord) {
    const total = getTotalTicketQuantity(event);
    const sold = Number(event.ticketsSold || event.bookingsCount || 0);

    if (!total) {
        return {
            label: getTicketTiers(event).length ? `${getTicketTiers(event).length} ticket option${getTicketTiers(event).length === 1 ? "" : "s"}` : "Tickets available",
            progressLabel: "",
            ratio: 0,
        };
    }

    const remaining = Math.max(total - sold, 0);
    const ratio = Math.min(100, Math.round((sold / total) * 100));

    return {
        label: `${remaining} ticket${remaining === 1 ? "" : "s"} left`,
        progressLabel: `${sold} of ${total} claimed`,
        ratio,
    };
}

function getEventStatus(event: EventRecord) {
    const total = getTotalTicketQuantity(event);
    const sold = Number(event.ticketsSold || event.bookingsCount || 0);
    const tiers = getTicketTiers(event);

    if (String(event.status || "").toUpperCase() === "CANCELLED") return "Cancelled";
    if (total > 0 && sold >= total) return "Sold out";
    if (total > 0 && sold / total >= 0.8) return "Selling fast";
    if (getPrimaryTicket(event)?.isFree || (tiers.length > 0 && tiers.every((ticket) => ticket.isFree || parsePriceValue(ticket.price) === 0))) return "Free entry";

    return "Open now";
}

function getMapUrl(event: EventRecord) {
    if (typeof event.latitude === "number" && typeof event.longitude === "number") {
        return `https://www.google.com/maps?q=${event.latitude},${event.longitude}`;
    }

    const location = encodeURIComponent(getLocationLabel(event));
    return `https://www.google.com/maps/search/?api=1&query=${location}`;
}

function createCalendarFile(event: EventRecord) {
    const startDate = event.date ? new Date(event.date) : new Date();
    const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const formatIcsDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Eventful//Event Details//EN",
        "BEGIN:VEVENT",
        `UID:${getEventKey(event)}@eventful`,
        `DTSTAMP:${formatIcsDate(new Date())}`,
        `DTSTART:${formatIcsDate(startDate)}`,
        `DTEND:${formatIcsDate(endDate)}`,
        `SUMMARY:${String(event.title || "Eventful event").replace(/\n/g, " ")}`,
        `DESCRIPTION:${String(event.summary || event.description || "").replace(/\n/g, " ")}`,
        `LOCATION:${getLocationLabel(event).replace(/\n/g, " ")}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ];

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${String(event.title || "event").replace(/[^\w-]+/g, "-").toLowerCase() || "eventful-event"}.ics`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function renderIcon(kind: string) {
    const icons: Record<string, string> = {
        calendar: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="16" rx="3" stroke="currentColor" stroke-width="1.7"/><path d="M8 2.8v3.8M16 2.8v3.8M3.5 9.5h17" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
        clock: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.8v4.7l3.2 1.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        location: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s6.5-5.8 6.5-11.1a6.5 6.5 0 1 0-13 0C5.5 15.2 12 21 12 21Z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.7"/></svg>`,
        ticket: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5V10a2 2 0 0 0 0 4v1.5A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5V14a2 2 0 1 0 0-4V8.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.2 8v8M14.8 8v8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
        share: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 14.5v4a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        bookmark: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 4.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V5.5a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
        bell: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 16.5h11l-1.2-1.7a5.4 5.4 0 0 1-.9-3V10a3.4 3.4 0 1 0-6.8 0v1.8a5.4 5.4 0 0 1-.9 3l-1.2 1.7Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M10.2 18.6a2.1 2.1 0 0 0 3.6 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
        link: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 14 14 10M8.5 16a3.5 3.5 0 0 1 0-5l2-2a3.5 3.5 0 1 1 5 5l-1 1M15.5 8a3.5 3.5 0 0 1 0 5l-2 2a3.5 3.5 0 0 1-5-5l1-1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    };

    return icons[kind] || "";
}

export async function renderEventDetails(publicId: string) {
    const app = document.getElementById("app")!;
    app.innerHTML = `<div class="event-details-loading">Loading event details...</div>`;

    try {
        const event = await getEvent(publicId);
        const eventKey = getEventKey(event);
        const reminderPreset = getReminderPreset(eventKey);
        const alertPreference = getAlertPreference(eventKey);
        const ticketTiers = getTicketTiers(event);
        const availability = getAvailability(event);
        const primaryTicket = getPrimaryTicket(event);
        const agenda = Array.isArray(event.agenda) ? event.agenda : [];

        app.innerHTML = `
            <div class="event-details-page">
                <div class="event-aura aura-one"></div>
                <div class="event-aura aura-two"></div>

                <div class="event-details-shell">
                    <a class="event-back-link" href="/explore" id="eventBackLink">Back to explore</a>

                    <section class="event-top-grid">
                        <div class="event-media-column">
                            <article class="event-poster-card">
                                <div class="event-poster ${event.imageUrl ? "has-image" : "no-image"}" ${event.imageUrl ? `style="background-image:url('${event.imageUrl}')"` : ""}>
                                    ${event.imageUrl ? "" : `<span>${String(event.title || "E").charAt(0).toUpperCase()}</span>`}
                                </div>
                                <div class="event-poster-tag">${event.category || "Event"}</div>
                            </article>

                            <article class="event-facts-card">
                                <div class="fact-row">
                                    ${renderIcon("calendar")}
                                    <div>
                                        <span>Date & time</span>
                                        <strong>${formatLongDate(event.date)}</strong>
                                        <p>${formatTimeRange(event.date, event.endDate)}</p>
                                    </div>
                                </div>

                                <div class="fact-row">
                                    ${isOnlineEvent(event) ? renderIcon("link") : renderIcon("location")}
                                    <div>
                                        <span>${isOnlineEvent(event) ? "Access" : "Location"}</span>
                                        <strong>${getLocationLabel(event)}</strong>
                                    </div>
                                </div>

                                <div class="fact-row">
                                    ${renderIcon("ticket")}
                                    <div>
                                        <span>Availability</span>
                                        <strong>${availability.label}</strong>
                                        ${availability.progressLabel ? `<p>${availability.progressLabel}</p>` : ""}
                                        ${availability.progressLabel ? `
                                            <div class="availability-bar">
                                                <span style="width:${availability.ratio}%"></span>
                                            </div>
                                        ` : ""}
                                    </div>
                                </div>
                            </article>
                        </div>

                        <div class="event-content-column">
                            <article class="event-title-card">
                                <div class="title-badges">
                                    <span class="event-badge">${getEventStatus(event)}</span>
                                    ${event.eventType ? `<span class="event-badge muted">${event.eventType}</span>` : ""}
                                </div>

                                <h1>${event.title || "Untitled event"}</h1>

                                <div class="organizer-row">
                                    <div class="organizer-avatar">${String(event.organizer || "EV").split(" ").map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase()}</div>
                                    <div class="organizer-copy">
                                        <span>Organized by</span>
                                        <strong>${event.organizer || "Eventful Creator"}</strong>
                                    </div>
                                </div>

                                <p class="event-summary">${event.summary || event.description || "Event details will appear here once the organizer adds more information."}</p>
                            </article>

                            <article class="event-panel">
                                <span class="panel-label">About this event</span>
                                <p class="panel-copy">${event.description || event.summary || "More information about the event will appear here once it is available."}</p>
                            </article>

                            <article class="booking-card">
                                <div class="booking-top">
                                    <div>
                                        <span class="panel-label">Ticket price</span>
                                        <strong>${getPrimaryPriceLabel(event)}</strong>
                                    </div>
                                    <span class="booking-status">${getEventStatus(event)}</span>
                                </div>

                                <p class="booking-note">${getPrimaryTicketNote(event)}</p>

                                <div class="booking-insights">
                                    <div class="booking-insight">
                                        <span>Availability</span>
                                        <strong>${availability.label}</strong>
                                    </div>
                                    ${availability.progressLabel ? `
                                        <div class="booking-insight">
                                            <span>Progress</span>
                                            <strong>${availability.progressLabel}</strong>
                                        </div>
                                    ` : ""}
                                </div>

                                ${availability.progressLabel ? `
                                    <div class="availability-bar booking-availability-bar">
                                        <span style="width:${availability.ratio}%"></span>
                                    </div>
                                ` : ""}

                                <button class="primary-action" type="button" id="reserveTicketBtn">
                                    ${renderIcon("ticket")}
                                    <span>${getPrimaryActionLabel(event)}</span>
                                </button>

                                <div class="utility-actions">
                                    <button class="utility-btn" type="button" id="saveEventBtn">${renderIcon("bookmark")}<span>Save</span></button>
                                    <button class="utility-btn" type="button" id="shareEventBtn">${renderIcon("share")}<span>Share</span></button>
                                    <button class="utility-btn" type="button" id="calendarEventBtn">${renderIcon("calendar")}<span>Add to calendar</span></button>
                                    <button class="utility-btn" type="button" id="openVenueBtn">${isOnlineEvent(event) ? `${renderIcon("link")}<span>Open access link</span>` : `${renderIcon("location")}<span>Get directions</span>`}</button>
                                </div>

                                <div class="booking-subgrid">
                                    <section class="mini-panel">
                                        <div class="mini-panel-head">
                                            <span class="panel-label">Reminder</span>
                                            <span class="mini-status" id="reminderStatusLabel">${reminderPreset ? `Set: ${reminderPreset}` : "Not set"}</span>
                                        </div>
                                        <h3>Notify me before it starts</h3>
                                        <div class="chip-row">
                                            ${(["24h", "3h", "30m"] as ReminderPreset[]).map((preset) => `
                                                <button class="chip-btn ${reminderPreset === preset ? "active" : ""}" type="button" data-reminder-preset="${preset}">${preset}</button>
                                            `).join("")}
                                        </div>
                                        <button class="subtle-action" type="button" id="clearReminderBtn">Clear reminder</button>
                                    </section>

                                    <section class="mini-panel">
                                        <div class="mini-panel-head">
                                            <span class="panel-label">Notifications</span>
                                            <button class="toggle-btn ${alertPreference.enabled ? "active" : ""}" type="button" id="alertToggleBtn">${alertPreference.enabled ? "On" : "Off"}</button>
                                        </div>
                                        <h3>Alert preferences</h3>
                                        <div class="chip-row chip-row-stack">
                                            <button class="chip-btn ${alertPreference.productUpdates ? "active" : ""}" type="button" data-alert-key="productUpdates">${renderIcon("bell")}<span>Event updates</span></button>
                                            <button class="chip-btn ${alertPreference.ticketDrops ? "active" : ""}" type="button" data-alert-key="ticketDrops">${renderIcon("ticket")}<span>Ticket alerts</span></button>
                                        </div>
                                        <p class="mini-note">Stored locally for now until your backend notification flow is connected.</p>
                                    </section>
                                </div>
                            </article>
                        </div>
                    </section>

                    ${ticketTiers.length ? `
                        <section class="event-section">
                            <span class="section-kicker">Tickets</span>
                            <h2>Available ticket options</h2>
                            <div class="ticket-list">
                                ${ticketTiers.map((ticket) => `
                                    <article class="ticket-row">
                                        <div>
                                            <strong>${ticket.name || "Ticket option"}</strong>
                                            ${ticket.description ? `<p>${ticket.description}</p>` : ""}
                                        </div>
                                        <div class="ticket-side">
                                            <span class="ticket-price">${ticket.isFree ? "Free" : formatPrice(ticket.price)}</span>
                                            ${Number(ticket.quantity || 0) > 0 ? `<span class="ticket-qty">${Number(ticket.quantity).toLocaleString()} spots</span>` : ""}
                                        </div>
                                    </article>
                                `).join("")}
                            </div>
                        </section>
                    ` : ""}

                    ${agenda.length ? `
                        <section class="event-section">
                            <span class="section-kicker">Schedule</span>
                            <h2>Event timeline</h2>
                            <div class="timeline-list">
                                ${agenda.map((item, index) => `
                                    <article class="timeline-item">
                                        <div class="timeline-index">${String(index + 1).padStart(2, "0")}</div>
                                        <div class="timeline-copy">
                                            <span class="timeline-time">${item.startTime || "Scheduled"}${item.endTime ? ` - ${item.endTime}` : ""}</span>
                                            <strong>${item.title || "Event segment"}</strong>
                                            ${item.description ? `<p>${item.description}</p>` : ""}
                                            ${item.host ? `<span class="timeline-host">Hosted by ${item.host}</span>` : ""}
                                        </div>
                                    </article>
                                `).join("")}
                            </div>
                        </section>
                    ` : ""}
                </div>
            </div>
        `;

        setupActions(event, eventKey, getMapUrl(event));
    } catch {
        showMessage("Failed to load event", "error");
        navigate("/explore");
    }
}

function setupActions(event: EventRecord, eventKey: string, mapUrl: string) {
    const saveButton = document.getElementById("saveEventBtn");
    const shareButton = document.getElementById("shareEventBtn");
    const calendarButton = document.getElementById("calendarEventBtn");
    const venueButton = document.getElementById("openVenueBtn");
    const reserveButton = document.getElementById("reserveTicketBtn");
    const reminderStatus = document.getElementById("reminderStatusLabel");
    const alertToggle = document.getElementById("alertToggleBtn");
    const backLink = document.getElementById("eventBackLink");

    const syncSavedState = () => {
        const saved = isEventSaved(eventKey);
        if (saveButton) {
            saveButton.classList.toggle("active", saved);
            saveButton.querySelector("span")!.textContent = saved ? "Saved" : "Save";
        }
    };

    const syncReminderState = () => {
        const reminder = getReminderPreset(eventKey);
        if (reminderStatus) {
            reminderStatus.textContent = reminder ? `Set: ${reminder}` : "Not set";
        }

        document.querySelectorAll<HTMLElement>("[data-reminder-preset]").forEach((button) => {
            button.classList.toggle("active", button.dataset.reminderPreset === reminder);
        });
    };

    const syncAlertState = () => {
        const preference = getAlertPreference(eventKey);

        if (alertToggle) {
            alertToggle.classList.toggle("active", preference.enabled);
            alertToggle.textContent = preference.enabled ? "On" : "Off";
        }

        document.querySelectorAll<HTMLElement>("[data-alert-key]").forEach((button) => {
            const key = button.dataset.alertKey as "productUpdates" | "ticketDrops" | undefined;
            button.classList.toggle("active", Boolean(key && preference[key]));
        });
    };

    backLink?.addEventListener("click", (eventObject) => {
        eventObject.preventDefault();
        navigate("/explore");
    });

    saveButton?.addEventListener("click", () => {
        const saved = toggleSavedEvent(eventKey);
        syncSavedState();
        showMessage(saved ? "Event saved for later" : "Removed from saved events", "success");
    });

    shareButton?.addEventListener("click", async () => {
        const shareUrl = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: event.title || "Eventful event",
                    text: event.summary || event.description || "Check out this event on Eventful.",
                    url: shareUrl,
                });
                return;
            }

            await navigator.clipboard.writeText(shareUrl);
            showMessage("Event link copied", "success");
        } catch {
            showMessage("Sharing did not complete", "error");
        }
    });

    calendarButton?.addEventListener("click", () => {
        createCalendarFile(event);
        showMessage("Calendar file downloaded", "success");
    });

    venueButton?.addEventListener("click", () => {
        const targetUrl = isOnlineEvent(event) && event.meetingLink ? event.meetingLink : mapUrl;
        window.open(targetUrl, "_blank", "noopener,noreferrer");
    });

    reserveButton?.addEventListener("click", () => {
        showMessage("Ticket checkout can be connected next", "success");
    });

    document.querySelectorAll<HTMLElement>("[data-reminder-preset]").forEach((button) => {
        button.addEventListener("click", () => {
            const preset = button.dataset.reminderPreset as ReminderPreset | undefined;
            if (!preset) return;

            setReminderPreset(eventKey, preset);
            syncReminderState();
            showMessage(`Reminder set for ${preset} before the event`, "success");
        });
    });

    document.getElementById("clearReminderBtn")?.addEventListener("click", () => {
        clearReminderPreset(eventKey);
        syncReminderState();
        showMessage("Reminder cleared", "success");
    });

    alertToggle?.addEventListener("click", async () => {
        const current = getAlertPreference(eventKey);
        const next = updateAlertPreference(eventKey, { enabled: !current.enabled });

        if (next.enabled && "Notification" in window && Notification.permission === "default") {
            try {
                await Notification.requestPermission();
            } catch {
                showMessage("Browser notification permission was not granted", "error");
            }
        }

        syncAlertState();
        showMessage(next.enabled ? "Notifications enabled" : "Notifications paused", "success");
    });

    document.querySelectorAll<HTMLElement>("[data-alert-key]").forEach((button) => {
        button.addEventListener("click", () => {
            const key = button.dataset.alertKey as "productUpdates" | "ticketDrops" | undefined;
            if (!key) return;

            const current = getAlertPreference(eventKey);
            updateAlertPreference(eventKey, { [key]: !current[key] });
            syncAlertState();
            showMessage("Alert preference updated", "success");
        });
    });

    syncSavedState();
    syncReminderState();
    syncAlertState();
}
