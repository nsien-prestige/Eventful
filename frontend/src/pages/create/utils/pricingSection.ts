export function renderPricingSection(): string {
    return `
        <div class="section-card dynamic-section" data-section="pricing">
            <div class="dynamic-layout">

                <div class="dynamic-main">
                    <div class="agenda-header">
                        <h2>Pricing</h2>
                        <button class="delete-section-btn">Delete section</button>
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

                        <button class="agenda-add-slot">+ Add ticket</button>
                    </div>
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
