/**
 * CUSTOM AGENDA SECTION COLLAPSIBLE - EVENTBRITE STYLE
 * 
 * Behavior:
 * 1. Auto-expand when "Add" button is clicked
 * 2. Auto-collapse when ALL slots complete + click outside
 * 3. Show preview header with completed slots when collapsed
 * 4. Allow re-expansion by clicking section header
 * 5. Don't collapse if ANY slot is incomplete
 */

import { launchConfetti } from "./sectionProgress";

let isAgendaSectionComplete = false;

/**
 * Check if ALL slots are complete (or at least one is complete for green tick)
 */
export function checkAgendaCompletion(): { allComplete: boolean; hasCompleteSlot: boolean } {
    const slots = document.querySelectorAll(".agenda-slot-card");
    
    if (slots.length === 0) return { allComplete: false, hasCompleteSlot: false };
    
    let completeCount = 0;
    
    slots.forEach(card => {
        const titleInput = card.querySelector(".agenda-slot-title-input") as HTMLInputElement;
        const startInput = card.querySelector(".agenda-slot-start") as HTMLInputElement;
        const endInput = card.querySelector(".agenda-slot-end") as HTMLInputElement;
        
        const isComplete = !!(
            titleInput?.value.trim() &&
            startInput?.value.trim() &&
            endInput?.value.trim()
        );
        
        if (isComplete) completeCount++;
    });
    
    return {
        allComplete: completeCount === slots.length && completeCount > 0,
        hasCompleteSlot: completeCount > 0
    };
}

/**
 * Create collapsed preview header showing all completed slots
 */
function createPreviewHeader(): string {
    const slots = document.querySelectorAll(".agenda-slot-card");
    const completedSlots: string[] = [];
    
    slots.forEach(card => {
        const titleInput = card.querySelector(".agenda-slot-title-input") as HTMLInputElement;
        const startInput = card.querySelector(".agenda-slot-start") as HTMLInputElement;
        const endInput = card.querySelector(".agenda-slot-end") as HTMLInputElement;
        const hostInput = card.querySelector(".agenda-slot-host") as HTMLInputElement;
        const descInput = card.querySelector(".agenda-slot-desc") as HTMLTextAreaElement;
        
        const isComplete = !!(
            titleInput?.value.trim() &&
            startInput?.value.trim() &&
            endInput?.value.trim()
        );
        
        if (!isComplete) return;
        
        const startLabel = card.querySelector(`#startLabel_${card.getAttribute("data-slot-id")}`) as HTMLElement;
        const endLabel = card.querySelector(`#endLabel_${card.getAttribute("data-slot-id")}`) as HTMLElement;
        
        const title = titleInput.value.trim();
        const startTime = startLabel?.textContent || "Start time";
        const endTime = endLabel?.textContent || "End time";
        const host = hostInput?.value.trim() || "";
        const description = descInput?.value.trim() || "";
        
        // Get color based on slot index
        const slotIndex = parseInt(card.getAttribute("data-slot-id") || "0");
        const SLOT_COLORS = [
            { bar: '#FF6B6B', bg: '#FFE5E5' },
            { bar: '#4ECDC4', bg: '#E0F7F5' },
            { bar: '#6C5CE7', bg: '#EEEAFD' },
            { bar: '#FFA502', bg: '#FFF3E0' },
            { bar: '#26DE81', bg: '#E0F9EF' },
            { bar: '#45AAF2', bg: '#E3F2FD' },
            { bar: '#F368E0', bg: '#FCE4EC' },
            { bar: '#A29BFE', bg: '#EDE7F6' },
        ];
        const colorPair = SLOT_COLORS[slotIndex % SLOT_COLORS.length];
        
        completedSlots.push(`
            <div class="agenda-preview-slot" style="background: ${colorPair.bg};">
                <div class="agenda-preview-accent" style="background: ${colorPair.bar};"></div>
                <div class="agenda-preview-slot-content">
                    <p class="agenda-preview-slot-time">${startTime} - ${endTime}</p>
                    <h4 class="agenda-preview-slot-title">${title}</h4>
                    ${host ? `<span class="agenda-preview-slot-host">${host}</span>` : ''}
                    ${description ? `<p class="agenda-preview-slot-desc">${description}</p>` : ''}
                </div>
            </div>
        `);
    });
    
    return completedSlots.join("");
}

/**
 * Auto-expand agenda section (called when Add button is clicked)
 */
export function expandAgendaSection(): void {
    const header = document.getElementById("agendaHeader");
    const content = document.getElementById("agendaContent");
    const subtext = document.getElementById("agendaSubtext");
    
    if (!content || !header) return;
    
    // Remove preview if it exists
    const existingPreview = header.querySelector(".agenda-preview-header");
    if (existingPreview) existingPreview.remove();
    
    // Show original subtext
    if (subtext) subtext.style.display = "block";
    
    // Expand the section
    content.classList.remove("hidden");
}

/**
 * Collapse agenda section with preview header
 */
export function collapseAgendaSection(): void {
    const header = document.getElementById("agendaHeader");
    const content = document.getElementById("agendaContent");
    const subtext = document.getElementById("agendaSubtext");
    
    if (!content || !header || content.classList.contains("hidden")) return;
    
    // Hide original subtext
    if (subtext) subtext.style.display = "none";
    
    // Create and insert preview header
    const previewHTML = createPreviewHeader();
    const previewContainer = document.createElement("div");
    previewContainer.className = "agenda-preview-header";
    previewContainer.innerHTML = previewHTML;
    
    const headingGroup = header.querySelector(".section-heading-group");
    if (headingGroup) {
        // Remove existing preview if any
        const existing = header.querySelector(".agenda-preview-header");
        if (existing) existing.remove();
        
        // Insert preview after heading group
        headingGroup.insertAdjacentElement("afterend", previewContainer);
    }
    
    // Animate collapse
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
}

/**
 * Update completion status and handle auto-collapse
 */
export function updateAgendaStatus(): void {
    const statusEl = document.getElementById("agendaStatus");
    
    if (!statusEl) return;
    
    const { hasCompleteSlot } = checkAgendaCompletion();
    
    // Show/hide green tick (shows when at least one slot is complete)
    if (hasCompleteSlot && !isAgendaSectionComplete) {
        statusEl.classList.add("completed");
        launchConfetti(statusEl);
        isAgendaSectionComplete = true;
    } else if (!hasCompleteSlot) {
        statusEl.classList.remove("completed");
        isAgendaSectionComplete = false;
    }
}

/**
 * Check if user clicked outside the agenda section
 */
function isClickOutsideAgenda(target: HTMLElement): boolean {
    const agendaSection = document.querySelector(".agenda-section");
    if (!agendaSection) return false;
    
    return !agendaSection.contains(target);
}

/**
 * Setup header click to re-expand collapsed section
 */
export function setupAgendaHeaderClick(): void {
    const header = document.getElementById("agendaHeader");
    if (!header) return;
    
    header.addEventListener("click", (e) => {
        const content = document.getElementById("agendaContent");
        if (!content) return;
        
        // If collapsed, expand it
        if (content.classList.contains("hidden")) {
            e.stopPropagation();
            expandAgendaSection();
        }
    });
}

/**
 * Setup click-outside detection for auto-collapse
 */
export function setupAgendaClickOutside(): void {
    document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        
        // Don't do anything if agenda section doesn't exist
        const content = document.getElementById("agendaContent");
        if (!content || content.classList.contains("hidden")) return;
        
        // Check if ALL slots are complete
        const { allComplete } = checkAgendaCompletion();
        
        // ONLY collapse if ALL slots complete AND clicked outside
        if (allComplete && isClickOutsideAgenda(target)) {
            collapseAgendaSection();
        }
    });
}

/**
 * Monitor agenda inputs for completion changes
 */
export function monitorAgendaInputs(): void {
    const observer = new MutationObserver(() => {
        updateAgendaStatus();
    });
    
    const slotList = document.getElementById("agendaSlotList");
    if (slotList) {
        observer.observe(slotList, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });
    }
    
    // Also listen to input events
    document.addEventListener("input", (e) => {
        const target = e.target as HTMLElement;
        if (target.closest(".agenda-section")) {
            updateAgendaStatus();
        }
    });
    
    // Listen to time picker changes
    document.addEventListener("change", (e) => {
        const target = e.target as HTMLElement;
        if (target.closest(".agenda-section")) {
            updateAgendaStatus();
        }
    });
}