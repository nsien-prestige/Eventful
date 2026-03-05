export function renderDateSection(): string {
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
