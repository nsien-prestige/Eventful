const EVENT_TYPES = [
    "Appearance or Signing",
    "Attraction",
    "Camp, Trip or Retreat",
    "Class, Training or Workshop",
    "Concert or Performance",
    "Conference",
    "Convention",
    "Dinner or Gala",
    "Festival or Fair",
    "Game or Competition",
    "Meetup or Networking",
    "Other",
    "Party or Social Gathering",
    "Race or Endurance Event",
    "Rally",
    "Screening",
    "Seminar or Talk",
    "Tour",
    "Tournament",
    "Tradeshow, Consumer Show or Expo",
];

const EVENT_CATEGORIES = [
    "Auto, Boat & Air",
    "Business & Professional",
    "Charity & Causes",
    "Community & Culture",
    "Family & Education",
    "Fashion & Beauty",
    "Film, Media & Entertainment",
    "Food & Drink",
    "Government & Politics",
    "Health & Wellness",
    "Hobbies & Special Interest",
    "Home & Lifestyle",
    "Music",
    "Other",
    "Performing & Visual Arts",
    "Religion & Spirituality",
    "School Activities",
    "Science & Technology",
    "Seasonal & Holiday",
    "Sports & Fitness",
    "Travel & Outdoor",
];

function buildOptions(items: string[]): string {
    return items.map(item => `<option value="${item}">${item}</option>`).join("\n");
}

export function renderTitleSection(): string {
    return `
        <div class="section-card collapsible" id="titleSection">
            <div class="section-header" id="titleHeader">
                <div class="section-heading-group">
                    <h2 id="titleHeading">Basic Info</h2>
                    <p class="section-subtext" id="titleSubtext">
                        Name your event, describe what it's about, and help people find it with a category.
                    </p>
                </div>

                <div class="section-actions">
                    <div class="section-status" id="titleStatus">
                        <svg viewBox="0 0 24 24" class="check-icon">
                            <path d="M20 6L9 17L4 12" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="section-content hidden" id="titleContent">

                <!-- EVENT TITLE -->
                <div class="field-group">
                    <label for="title">Event Title <span class="field-required">*</span></label>
                    <p class="field-help">
                        Choose a clear, descriptive title — e.g. "Tech Networking Meetup Lagos 2026".
                    </p>
                    <input
                        type="text"
                        id="title"
                        class="field-input"
                        placeholder="e.g. Tech Networking Meetup 2026"
                        maxlength="75"
                    />
                    <span class="field-char-count" id="titleCharCount">0 / 75</span>
                </div>

                <!-- ORGANIZER -->
                <div class="field-group">
                    <label for="organizer">Organizer</label>
                    <p class="field-help">
                        The name of the person or group hosting this event.
                    </p>
                    <input
                        type="text"
                        id="organizer"
                        class="field-input"
                        placeholder="e.g. Lagos Tech Community"
                    />
                </div>

                <!-- TYPE + CATEGORY ROW -->
                <div class="field-row">
                    <div class="field-group">
                        <label for="eventType">Event Type <span class="field-required">*</span></label>
                        <p class="field-help">Select the type that best fits your event.</p>
                        <div class="select-wrapper">
                            <select id="eventType" class="field-select">
                                <option value="" disabled selected>Select a type</option>
                                ${buildOptions(EVENT_TYPES)}
                            </select>
                        </div>
                    </div>

                    <div class="field-group">
                        <label for="category">Category <span class="field-required">*</span></label>
                        <p class="field-help">Help people discover your event.</p>
                        <div class="select-wrapper">
                            <select id="category" class="field-select">
                                <option value="" disabled selected>Select a category</option>
                                ${buildOptions(EVENT_CATEGORIES)}
                            </select>
                        </div>
                    </div>
                </div>

                <!-- SUMMARY -->
                <div class="field-group">
                    <label for="summary">Summary <span class="field-required">*</span></label>
                    <p class="field-help">
                        A short hook that grabs attention — this appears at the top of your event page.
                        Keep it under 140 characters.
                    </p>
                    <textarea
                        id="summary"
                        class="field-input field-summary"
                        rows="2"
                        maxlength="140"
                        placeholder="What's this event about in one sentence?"
                    ></textarea>
                    <span class="field-char-count" id="summaryCharCount">0 / 140</span>
                </div>

                <!-- DESCRIPTION -->
                <div class="field-group">
                    <label for="description">Description</label>
                    <p class="field-help">
                        Give attendees the full picture. Include speakers, sponsors,
                        what to bring, and anything that makes your event unmissable.
                    </p>
                    <textarea
                        id="description"
                        class="field-input field-description"
                        rows="6"
                        placeholder="Describe your event in detail..."
                    ></textarea>
                </div>

            </div>
        </div>
    `;
}

export function setupTitleSection(): void {
    // Live character count — title
    const titleInput = document.getElementById("title") as HTMLInputElement;
    const titleCount = document.getElementById("titleCharCount")!;

    titleInput?.addEventListener("input", () => {
        const len = titleInput.value.length;
        titleCount.textContent = `${len} / 75`;
        titleCount.classList.toggle("field-char-count--near", len >= 60);
        titleCount.classList.toggle("field-char-count--max", len >= 75);
    });

    // Live character count — summary
    const summaryInput = document.getElementById("summary") as HTMLTextAreaElement;
    const summaryCount = document.getElementById("summaryCharCount")!;

    summaryInput?.addEventListener("input", () => {
        const len = summaryInput.value.length;
        summaryCount.textContent = `${len} / 140`;
        summaryCount.classList.toggle("field-char-count--near", len >= 110);
        summaryCount.classList.toggle("field-char-count--max", len >= 140);
    });
}

/**
 * Called after the Basic Info section collapses on completion.
 * Replaces the heading with the event title and the subtext with the summary.
 * Adds a small "Edit" affordance so the user knows the header is clickable.
 */
export function updateTitlePreview(): void {
    const title   = (document.getElementById("title") as HTMLInputElement)?.value.trim();
    const summary = (document.getElementById("summary") as HTMLTextAreaElement)?.value.trim();
    const category = (document.getElementById("category") as HTMLSelectElement)?.value;

    const heading = document.getElementById("titleHeading");
    const subtext = document.getElementById("titleSubtext");

    if (heading && title) {
        heading.textContent = title;
    }

    if (subtext) {
        const parts: string[] = [];
        if (summary)  parts.push(summary);
        if (category) parts.push(category);
        subtext.textContent = parts.join(" · ");
        subtext.style.display = "block";
    }
}

export function getTitleData() {
    return {
        title:       (document.getElementById("title")       as HTMLInputElement)?.value.trim(),
        organizer:   (document.getElementById("organizer")   as HTMLInputElement)?.value.trim(),
        eventType:   (document.getElementById("eventType")   as HTMLSelectElement)?.value,
        category:    (document.getElementById("category")    as HTMLSelectElement)?.value,
        summary:     (document.getElementById("summary")     as HTMLTextAreaElement)?.value.trim(),
        description: (document.getElementById("description") as HTMLTextAreaElement)?.value.trim(),
    };
}