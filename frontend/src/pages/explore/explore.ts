import { getAllEvents } from "../../api/events.api";
import { showMessage } from "../../components/notify/notify";
import { navigate } from "../../router";
import "./explore.css";

const BOOKMARKS_KEY = "eventful:saved-events";
const PAGE_SIZE = 6;

type FiltersState = {
    search: string;
    category: string;
    price: "all" | "free" | "paid";
    mode: "all" | "online" | "physical";
    date: "all" | "today" | "week" | "month";
    sort: "soonest" | "latest" | "price-low" | "price-high" | "title";
    savedOnly: boolean;
    page: number;
};

const state: FiltersState = {
    search: "",
    category: "All",
    price: "all",
    mode: "all",
    date: "all",
    sort: "soonest",
    savedOnly: false,
    page: 1,
};

let allEvents: any[] = [];

function parsePriceValue(value: any) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    if (typeof value === "string") {
        const cleaned = value.replace(/[^\d.]/g, "").trim();
        if (!cleaned) return 0;
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
}

function formatDateLabel(dateValue: string) {
    const date = new Date(dateValue);
    return date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function formatTimeLabel(dateValue: string) {
    const date = new Date(dateValue);
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatCompactPrice(value: number) {
    return value > 0 ? value.toLocaleString() : "Free";
}

function getCategoryLabel(event: any) {
    return event.category || event.type || "Event";
}

function getLocationLabel(event: any) {
    return event.venueAddress || event.location || event.locationName || "Location TBD";
}

function getCreatorLabel(event: any) {
    return event.organizer || event.creatorName || event.createdBy || "Eventful Creator";
}

function getInitialLabel(event: any) {
    const source = event.title || event.category || "E";
    return source.charAt(0).toUpperCase();
}

function getFallbackGradient(event: any) {
    const source = (event.title || event.category || "event").toLowerCase();
    let total = 0;

    for (let index = 0; index < source.length; index += 1) {
        total += source.charCodeAt(index);
    }

    const palettes = [
        "linear-gradient(180deg, #74c69d 0%, #2d6a4f 100%)",
        "linear-gradient(180deg, #7b9acc 0%, #355070 100%)",
        "linear-gradient(180deg, #f4a261 0%, #b56576 100%)",
        "linear-gradient(180deg, #43bccd 0%, #386fa4 100%)",
        "linear-gradient(180deg, #95d5b2 0%, #40916c 100%)",
    ];

    return palettes[total % palettes.length];
}

function getTicketProgress(event: any) {
    const sold = Number(event.ticketsSold || event.bookingsCount || 0);
    const capacity = Number(event.capacity || event.totalTickets || 0);

    if (!capacity || capacity < 1) {
        return { sold, capacity: 0, ratio: 0 };
    }

    return {
        sold,
        capacity,
        ratio: Math.min(100, Math.round((sold / capacity) * 100)),
    };
}

function isOnlineEvent(event: any) {
    const locationType = String(event.locationType || "").toLowerCase();
    return Boolean(event.isOnline) || locationType === "online" || Boolean(event.meetingLink);
}

function getSavedIds() {
    try {
        const raw = localStorage.getItem(BOOKMARKS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function isSaved(publicId: string) {
    return getSavedIds().includes(publicId);
}

function toggleSaved(publicId: string) {
    const current = new Set(getSavedIds());

    if (current.has(publicId)) {
        current.delete(publicId);
        showMessage("Removed from saved events", "success");
    } else {
        current.add(publicId);
        showMessage("Saved event", "success");
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...current]));
}

function getEventStatus(event: any) {
    const progress = getTicketProgress(event);
    const now = new Date();
    const eventDate = new Date(event.date);
    const diff = eventDate.getTime() - now.getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    if (progress.capacity > 0 && progress.sold >= progress.capacity) {
        return "Sold out";
    }

    if (progress.capacity > 0 && progress.ratio >= 80) {
        return "Almost full";
    }

    if (diff >= 0 && diff < dayMs) {
        return "Today";
    }

    if (parsePriceValue(event.price) === 0) {
        return "Free";
    }

    if (diff >= 0 && diff < dayMs * 7) {
        return "This week";
    }

    return "";
}

function matchesDateFilter(event: any, dateFilter: FiltersState["date"]) {
    if (dateFilter === "all") return true;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const eventDate = new Date(event.date).getTime();
    const diff = eventDate - todayStart;
    const dayMs = 24 * 60 * 60 * 1000;

    if (dateFilter === "today") {
        return diff >= 0 && diff < dayMs;
    }

    if (dateFilter === "week") {
        return diff >= 0 && diff < dayMs * 7;
    }

    if (dateFilter === "month") {
        return diff >= 0 && diff < dayMs * 31;
    }

    return true;
}

function filterAndSortEvents(events: any[]) {
    const term = state.search.trim().toLowerCase();
    const savedIds = getSavedIds();

    const filtered = events.filter((event) => {
        const matchesSearch = !term || [
            event.title,
            event.description,
            event.category,
            event.organizer,
            event.venueAddress,
            event.location,
            event.locationName,
        ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(term));

        const matchesCategory = state.category === "All" || getCategoryLabel(event) === state.category;
        const numericPrice = parsePriceValue(event.price);
        const matchesPrice = state.price === "all" || (state.price === "free" ? numericPrice === 0 : numericPrice > 0);
        const matchesMode = state.mode === "all" || (state.mode === "online" ? isOnlineEvent(event) : !isOnlineEvent(event));
        const matchesSaved = !state.savedOnly || savedIds.includes(event.publicId);
        const matchesDate = matchesDateFilter(event, state.date);

        return matchesSearch && matchesCategory && matchesPrice && matchesMode && matchesSaved && matchesDate;
    });

    filtered.sort((a, b) => {
        switch (state.sort) {
            case "latest":
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case "price-low":
                return parsePriceValue(a.price) - parsePriceValue(b.price);
            case "price-high":
                return parsePriceValue(b.price) - parsePriceValue(a.price);
            case "title":
                return String(a.title || "").localeCompare(String(b.title || ""));
            case "soonest":
            default:
                return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
    });

    return filtered;
}

function getSuggestions(events: any[]) {
    const term = state.search.trim().toLowerCase();
    if (!term) return [];

    const suggestions = new Set<string>();

    events.forEach((event) => {
        [event.title, event.category, event.organizer, event.location, event.venueAddress]
            .filter(Boolean)
            .forEach((value) => {
                const text = String(value);
                if (text.toLowerCase().includes(term) && suggestions.size < 5) {
                    suggestions.add(text);
                }
            });
    });

    return [...suggestions].slice(0, 5);
}

function renderSearchIcon() {
    return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/>
            <path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
    `;
}

function renderCalendarIcon() {
    return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
        </svg>
    `;
}

function renderLocationIcon() {
    return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
        </svg>
    `;
}

function renderPeopleIcon() {
    return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="9.5" cy="7" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M20 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M14 4.13a4 4 0 0 1 0 5.74" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
}

function renderMoneyIcon() {
    return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
            <path d="M12 7v10M15.5 9.5c-.6-.8-1.8-1.5-3.5-1.5-2.2 0-4 1.2-4 3s1.8 3 4 3 4 1.2 4 3-1.8 3-4 3c-1.7 0-2.9-.7-3.5-1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
}

function renderBookmarkIcon(saved: boolean) {
    return `
        <svg viewBox="0 0 24 24" fill="${saved ? "currentColor" : "none"}" aria-hidden="true">
            <path d="M6 4.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V5.5a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
        </svg>
    `;
}

export async function renderExplore() {
    const app = document.getElementById("app")!;

    app.innerHTML = `
        <div class="explore-page">
            <div class="explore-shell">
                <div class="explore-topbar">
                    <div>
                        <span class="explore-kicker">Discover</span>
                        <h1>Browse events with room to choose well.</h1>
                        <p>Use search, filters, saved events, and cleaner browsing tools to find what actually fits.</p>
                    </div>
                    <span class="explore-results-pill" id="resultsCountPill">0 events</span>
                </div>

                <div class="explore-toolbar">
                    <div class="explore-search-wrap">
                        <label class="explore-search" aria-label="Search events">
                            ${renderSearchIcon()}
                            <input id="searchInput" placeholder="Search events, organizers, or places..." />
                        </label>
                        <div class="explore-suggestions" id="searchSuggestions"></div>
                    </div>

                    <div class="explore-toolbar-actions">
                        <button class="toolbar-chip ${state.savedOnly ? "active" : ""}" type="button" id="savedOnlyBtn">Saved</button>
                        <label class="sort-wrap">
                            <span>Sort</span>
                            <select id="sortSelect">
                                <option value="soonest">Soonest</option>
                                <option value="latest">Latest</option>
                                <option value="price-low">Price: Low to high</option>
                                <option value="price-high">Price: High to low</option>
                                <option value="title">Title</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div class="filter-row">
                    <div class="category-chip-row" id="categoryChips"></div>
                    <div class="filter-select-row">
                        <label class="filter-select-wrap">
                            <span>Price</span>
                            <select id="priceSelect">
                                <option value="all">All prices</option>
                                <option value="free">Free</option>
                                <option value="paid">Paid</option>
                            </select>
                        </label>

                        <label class="filter-select-wrap">
                            <span>Format</span>
                            <select id="modeSelect">
                                <option value="all">All formats</option>
                                <option value="physical">Physical</option>
                                <option value="online">Online</option>
                            </select>
                        </label>

                        <label class="filter-select-wrap">
                            <span>Date</span>
                            <select id="dateSelect">
                                <option value="all">Any time</option>
                                <option value="today">Today</option>
                                <option value="week">This week</option>
                                <option value="month">This month</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div id="eventsContainer" class="events-grid">
                    <div class="explore-loading">Loading events...</div>
                </div>

                <div class="pagination-row" id="paginationRow"></div>
            </div>
        </div>
    `;

    try {
        allEvents = await getAllEvents();
        state.page = 1;
        renderExploreUi();
        setupExploreInteractions();
    } catch {
        showMessage("Failed to load events", "error");
    }
}

function renderExploreUi() {
    syncControlState();
    renderCategoryChips(allEvents);
    renderSuggestions(allEvents);
    renderEvents(allEvents);
}

function syncControlState() {
    const sort = document.getElementById("sortSelect") as HTMLSelectElement | null;
    const price = document.getElementById("priceSelect") as HTMLSelectElement | null;
    const mode = document.getElementById("modeSelect") as HTMLSelectElement | null;
    const date = document.getElementById("dateSelect") as HTMLSelectElement | null;
    const saved = document.getElementById("savedOnlyBtn");

    if (sort) sort.value = state.sort;
    if (price) price.value = state.price;
    if (mode) mode.value = state.mode;
    if (date) date.value = state.date;
    saved?.classList.toggle("active", state.savedOnly);
}

function renderCategoryChips(events: any[]) {
    const root = document.getElementById("categoryChips");
    if (!root) return;

    const categories = Array.from(new Set(events.map(getCategoryLabel))).sort((a, b) => a.localeCompare(b));
    const allCategories = ["All", ...categories];

    root.innerHTML = allCategories.map((category) => `
        <button
            class="category-chip ${state.category === category ? "active" : ""}"
            type="button"
            data-category="${category}"
        >
            ${category}
        </button>
    `).join("");

    root.querySelectorAll<HTMLElement>("[data-category]").forEach((button) => {
        button.addEventListener("click", () => {
            state.category = button.dataset.category || "All";
            state.page = 1;
            renderExploreUi();
        });
    });
}

function renderSuggestions(events: any[]) {
    const root = document.getElementById("searchSuggestions");
    if (!root) return;

    const suggestions = getSuggestions(events);

    if (!suggestions.length) {
        root.innerHTML = "";
        root.classList.remove("show");
        return;
    }

    root.innerHTML = suggestions.map((item) => `
        <button class="suggestion-item" type="button" data-suggestion="${item}">
            ${item}
        </button>
    `).join("");

    root.classList.add("show");

    root.querySelectorAll<HTMLElement>("[data-suggestion]").forEach((button) => {
        button.addEventListener("click", () => {
            state.search = button.dataset.suggestion || "";
            state.page = 1;

            const input = document.getElementById("searchInput") as HTMLInputElement | null;
            if (input) input.value = state.search;

            renderExploreUi();
        });
    });
}

function renderEvents(events: any[]) {
    const container = document.getElementById("eventsContainer")!;
    const countPill = document.getElementById("resultsCountPill");
    const filtered = filterAndSortEvents(events);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    state.page = Math.min(state.page, totalPages);

    const start = (state.page - 1) * PAGE_SIZE;
    const currentPageItems = filtered.slice(start, start + PAGE_SIZE);

    if (countPill) {
        countPill.textContent = `${filtered.length} event${filtered.length === 1 ? "" : "s"}`;
    }

    if (!currentPageItems.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No events match these filters</h3>
                <p>Try broadening your search, switching categories, or clearing saved-only mode.</p>
                <div class="empty-state-actions">
                    <button type="button" class="empty-action-btn" id="clearFiltersBtn">Clear filters</button>
                </div>
            </div>
        `;

        document.getElementById("paginationRow")!.innerHTML = "";
        document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
            state.search = "";
            state.category = "All";
            state.price = "all";
            state.mode = "all";
            state.date = "all";
            state.savedOnly = false;
            state.sort = "soonest";
            state.page = 1;

            const input = document.getElementById("searchInput") as HTMLInputElement | null;
            if (input) input.value = "";

            const sort = document.getElementById("sortSelect") as HTMLSelectElement | null;
            if (sort) sort.value = "soonest";

            renderExploreUi();
        });
        return;
    }

    container.innerHTML = currentPageItems.map((event) => {
        const progress = getTicketProgress(event);
        const creator = getCreatorLabel(event);
        const creatorInitials = creator.split(" ").map((part: string) => part.charAt(0)).join("").slice(0, 2).toUpperCase() || "EV";
        const hasImage = Boolean(event.imageUrl);
        const status = getEventStatus(event);
        const saved = isSaved(event.publicId);
        const numericPrice = parsePriceValue(event.price);

        return `
            <article class="event-card" data-id="${event.publicId}">
                <div class="event-image ${hasImage ? "has-image" : "no-image"}"
                    ${hasImage ? `style="background-image: url('${event.imageUrl}')"` : `style="background: ${getFallbackGradient(event)}"`}
                >
                    <div class="event-image-top">
                        <span class="event-badge">${getCategoryLabel(event)}</span>
                        <button class="bookmark-btn ${saved ? "active" : ""}" type="button" data-save-id="${event.publicId}" aria-label="Save ${event.title}">
                            ${renderBookmarkIcon(saved)}
                        </button>
                    </div>
                    ${hasImage ? "" : `<span class="event-image-initial">${getInitialLabel(event)}</span>`}
                </div>

                <div class="event-content">
                    <div class="event-title-row">
                        <h3>${event.title}</h3>
                        ${status ? `<span class="event-status">${status}</span>` : ""}
                    </div>

                    <p class="event-description">${event.description || "A standout event experience waiting for the right crowd."}</p>

                    <div class="event-detail">
                        ${renderCalendarIcon()}
                        <span>${formatDateLabel(event.date)} at ${formatTimeLabel(event.date)}</span>
                    </div>

                    <div class="event-detail">
                        ${renderLocationIcon()}
                        <span>${getLocationLabel(event)}</span>
                    </div>

                    <div class="event-footer">
                        <div class="event-stat-line">
                            <span class="event-stat">
                                ${renderPeopleIcon()}
                                <span>${progress.capacity ? `${progress.sold}/${progress.capacity}` : `${progress.sold}`}</span>
                            </span>
                            <span class="event-price">
                                ${renderMoneyIcon()}
                                <span>${formatCompactPrice(numericPrice)}</span>
                            </span>
                        </div>
                        <div class="event-progress">
                            <span style="width: ${progress.ratio}%"></span>
                        </div>
                        <div class="event-creator">
                            <span class="event-creator-avatar">${creatorInitials}</span>
                            <span class="event-creator-name">by ${creator}</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    container.querySelectorAll<HTMLElement>(".event-card").forEach((card) => {
        card.addEventListener("click", () => {
            const id = card.dataset.id;
            if (id) navigate(`/event/${id}`);
        });
    });

    container.querySelectorAll<HTMLElement>("[data-save-id]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const id = button.dataset.saveId;
            if (!id) return;
            toggleSaved(id);
            renderExploreUi();
        });
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages: number) {
    const root = document.getElementById("paginationRow");
    if (!root) return;

    if (totalPages <= 1) {
        root.innerHTML = "";
        return;
    }

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    root.innerHTML = `
        <button class="page-btn" type="button" data-page-nav="prev" ${state.page === 1 ? "disabled" : ""}>Previous</button>
        ${pages.map((page) => `
            <button class="page-btn ${state.page === page ? "active" : ""}" type="button" data-page="${page}">
                ${page}
            </button>
        `).join("")}
        <button class="page-btn" type="button" data-page-nav="next" ${state.page === totalPages ? "disabled" : ""}>Next</button>
    `;

    root.querySelectorAll<HTMLElement>("[data-page]").forEach((button) => {
        button.addEventListener("click", () => {
            state.page = Number(button.dataset.page || 1);
            renderExploreUi();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    root.querySelector<HTMLElement>("[data-page-nav='prev']")?.addEventListener("click", () => {
        state.page = Math.max(1, state.page - 1);
        renderExploreUi();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    root.querySelector<HTMLElement>("[data-page-nav='next']")?.addEventListener("click", () => {
        state.page = Math.min(totalPages, state.page + 1);
        renderExploreUi();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function setupExploreInteractions() {
    const input = document.getElementById("searchInput") as HTMLInputElement | null;
    const sort = document.getElementById("sortSelect") as HTMLSelectElement | null;
    const price = document.getElementById("priceSelect") as HTMLSelectElement | null;
    const mode = document.getElementById("modeSelect") as HTMLSelectElement | null;
    const date = document.getElementById("dateSelect") as HTMLSelectElement | null;
    const savedOnlyBtn = document.getElementById("savedOnlyBtn");

    input?.addEventListener("input", () => {
        state.search = input.value;
        state.page = 1;
        renderExploreUi();
    });

    input?.addEventListener("blur", () => {
        window.setTimeout(() => {
            document.getElementById("searchSuggestions")?.classList.remove("show");
        }, 120);
    });

    input?.addEventListener("focus", () => {
        if (getSuggestions(allEvents).length) {
            document.getElementById("searchSuggestions")?.classList.add("show");
        }
    });

    sort?.addEventListener("change", () => {
        state.sort = sort.value as FiltersState["sort"];
        state.page = 1;
        renderExploreUi();
    });

    price?.addEventListener("change", () => {
        state.price = price.value as FiltersState["price"];
        state.page = 1;
        renderExploreUi();
    });

    mode?.addEventListener("change", () => {
        state.mode = mode.value as FiltersState["mode"];
        state.page = 1;
        renderExploreUi();
    });

    date?.addEventListener("change", () => {
        state.date = date.value as FiltersState["date"];
        state.page = 1;
        renderExploreUi();
    });

    savedOnlyBtn?.addEventListener("click", () => {
        state.savedOnly = !state.savedOnly;
        state.page = 1;
        renderExploreUi();
    });
}
