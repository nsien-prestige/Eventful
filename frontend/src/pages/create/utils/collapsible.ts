interface CollapsibleSection {
    headerId:  string;
    contentId: string;
    toggleId:  string;
    subtextId: string;
}

// All registered sections — used to close others when one opens
const registry: CollapsibleSection[] = [];

export function collapseSection(contentId: string, toggleId?: string): void {
    const content = document.getElementById(contentId);
    if (!content || content.classList.contains("hidden")) return;

    content.style.height = content.scrollHeight + "px";

    requestAnimationFrame(() => {
        content.style.transition = "height 0.35s ease, opacity 0.25s ease";
        content.style.height     = "0px";
        content.style.opacity    = "0";
    });

    setTimeout(() => {
        content.classList.add("hidden");
        content.style.height     = "";
        content.style.opacity    = "";
        content.style.transition = "";
    }, 350);

    if (toggleId) {
        const toggle = document.getElementById(toggleId);
        if (toggle) toggle.textContent = "+";
    }
}

function expandSection(section: CollapsibleSection): void {
    const content = document.getElementById(section.contentId);
    const toggle  = document.getElementById(section.toggleId);
    const subtext = document.getElementById(section.subtextId);

    if (!content) return;

    content.classList.remove("hidden");
    if (toggle)  toggle.textContent = "−";
    if (subtext) subtext.style.display = "none";
}

function collapseOthers(exceptContentId: string): void {
    registry.forEach(sec => {
        if (sec.contentId === exceptContentId) return;

        const content = document.getElementById(sec.contentId);
        if (!content || content.classList.contains("hidden")) return;

        collapseSection(sec.contentId, sec.toggleId);

        // Restore subtext visibility for the collapsed section
        const subtext = document.getElementById(sec.subtextId);
        if (subtext) subtext.style.display = "block";
    });
}

export function setupCollapsible(
    headerId:  string,
    contentId: string,
    toggleId:  string,
    subtextId: string
): void {
    const section: CollapsibleSection = { headerId, contentId, toggleId, subtextId };
    registry.push(section);

    const header = document.getElementById(headerId);
    if (!header) return;

    header.addEventListener("click", (e) => {
        if (!(e.target as HTMLElement).closest(".section-header")) return;

        const content = document.getElementById(contentId);
        if (!content) return;

        const isHidden = content.classList.contains("hidden");

        // Only allow opening — sections close via completion, not manual toggle
        if (isHidden) {
            collapseOthers(contentId);
            expandSection(section);
        }
    });
}