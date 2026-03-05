import { collapseSection } from "./collapsible";
import { updateTitlePreview } from "./titleSection";

export function launchConfetti(target: HTMLElement): void {
    const rect = target.getBoundingClientRect();

    for (let i = 0; i < 14; i++) {
        const particle = document.createElement("span");
        particle.className = "confetti";

        particle.style.left = rect.left + rect.width / 2 + "px";
        particle.style.top  = rect.top  + rect.height / 2 + "px";
        particle.style.setProperty("--x", (Math.random() * 160 - 80) + "px");
        particle.style.setProperty("--y", (Math.random() * -140 - 40) + "px");

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 900);
    }
}

function isSectionFocused(sectionContentId: string): boolean {
    const section = document.getElementById(sectionContentId);
    if (!section) return false;

    const inputs = section.querySelectorAll("input, textarea, select");
    return Array.from(inputs).some(input => input === document.activeElement);
}

function handleCompletion(
    isComplete:  boolean,
    wasComplete: { value: boolean },
    statusEl:    HTMLElement,
    contentId:   string,
    toggleId:    string,
    onCollapse?: () => void
): void {
    statusEl.classList.toggle("completed", isComplete);

    if (isComplete && !wasComplete.value) {
        wasComplete.value = true;

        if (!isSectionFocused(contentId)) {
            setTimeout(() => {
                onCollapse?.();
                collapseSection(contentId, toggleId);
            }, 500);

            launchConfetti(statusEl);
        }
    }

    if (!isComplete) {
        wasComplete.value = false;
    }
}

export function initSectionProgress(): void {

    /* ── BASIC INFO (TITLE) SECTION ─────────────────────────────── */

    const titleInput    = document.getElementById("title")     as HTMLInputElement;
    const summaryInput  = document.getElementById("summary")   as HTMLTextAreaElement;
    const categoryInput = document.getElementById("category")  as HTMLSelectElement;
    const titleStatus   = document.getElementById("titleStatus")!;
    const titleState    = { value: false };

    function validateTitleSection(): void {
        const isComplete =
            titleInput?.value.trim().length > 0   &&
            summaryInput?.value.trim().length > 0  &&
            categoryInput?.value !== "" && categoryInput?.value !== undefined;

        handleCompletion(
            isComplete,
            titleState,
            titleStatus,
            "titleContent",
            "titleToggle",
            () => updateTitlePreview()   // swap heading + subtext before collapsing
        );
    }

    titleInput?.addEventListener("input",    validateTitleSection);
    summaryInput?.addEventListener("input",  validateTitleSection);
    categoryInput?.addEventListener("change", validateTitleSection);

    document.getElementById("titleContent")?.addEventListener("focusout", () => {
        if (titleState.value && !isSectionFocused("titleContent")) {
            updateTitlePreview();
            collapseSection("titleContent", "titleToggle");
        }
    });

    /* ── DATE & LOCATION SECTION ────────────────────────────────── */

    const dateInput     = document.getElementById("eventDate")      as HTMLInputElement;
    const startInput    = document.getElementById("startTime")      as HTMLInputElement;
    const endInput      = document.getElementById("endTime")        as HTMLInputElement;
    const locationInput = document.getElementById("locationSearch") as HTMLInputElement;
    const meetingInput  = document.getElementById("meetingLink")    as HTMLInputElement;
    const dateStatus    = document.getElementById("dateStatus")!;
    const dateState     = { value: false };

    function validateDateSection(): void {
        const isOnline = (document.getElementById("onlineToggle") as HTMLInputElement)?.checked;

        const locationFilled = isOnline
            ? meetingInput?.value.trim().length > 0
            : locationInput?.value.trim().length > 0;

        const isComplete =
            !!dateInput?.value   &&
            !!startInput?.value  &&
            !!endInput?.value    &&
            locationFilled;

        handleCompletion(isComplete, dateState, dateStatus, "dateContent", "dateToggle");
    }

    dateInput?.addEventListener("change",  validateDateSection);
    startInput?.addEventListener("change", validateDateSection);
    endInput?.addEventListener("change",   validateDateSection);
    locationInput?.addEventListener("input", validateDateSection);
    meetingInput?.addEventListener("input",  validateDateSection);

    document.getElementById("dateContent")?.addEventListener("focusout", () => {
        if (dateState.value && !isSectionFocused("dateContent")) {
            collapseSection("dateContent", "dateToggle");
        }
    });
}