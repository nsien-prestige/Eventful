import "./event-details.css";
import { getEvent } from "../../api/events.api";
import { showMessage } from "../../components/notify/notify";

export async function renderEventDetails(publicId: string) {
    const app = document.getElementById("app")!;

    app.innerHTML = `
        <div class="event-details-loading">
            Loading event...
        </div>
    `;

    try {
        const event = await getEvent(publicId);

        app.innerHTML = `
            <div class="event-details-wrapper">

                <!-- HERO -->
                <section class="event-hero" 
                    style="background-image: url('${event.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}')">
                    
                    <div class="event-hero-overlay">
                        <span class="event-category">${event.category || "Event"}</span>
                        <h1>${event.title}</h1>
                        <p class="event-meta">
                            ${new Date(event.date).toLocaleDateString()} • ${event.location || "Online"}
                        </p>
                    </div>
                </section>

                <!-- CONTENT -->
                <section class="event-content">

                    <div class="event-main">
                        <h2>About This Event</h2>
                        <p>${event.description}</p>
                    </div>

                    <div class="event-sidebar">

                        <div class="ticket-card">
                            <div class="ticket-price">
                                ${event.price > 0 ? `₦${event.price}` : "Free"}
                            </div>

                            <div class="ticket-date">
                                ${new Date(event.date).toLocaleString()}
                            </div>

                            <button class="buy-btn">
                                ${event.price > 0 ? "Buy Ticket" : "Register Free"}
                            </button>
                        </div>

                        <div class="share-card">
                            <button id="share-btn">Share Event</button>
                        </div>

                    </div>

                </section>

            </div>
        `;

        document.getElementById("share-btn")!
            .addEventListener("click", () => {
                navigator.clipboard.writeText(window.location.href);
                showMessage("Link copied to clipboard 🔗", "success");
            });

    } catch {
        showMessage("Failed to load event", "error");
    }
}
