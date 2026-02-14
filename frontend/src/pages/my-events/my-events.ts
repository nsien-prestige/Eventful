import { getMyEvents } from "../../api/my-events.api";
import { getToken } from "../../utils/auth";
import { navigate } from "../../router";

export async function renderMyEvents() {
    const app = document.getElementById("app")!;
    const token = getToken();

    if (!token) {
        navigate("/login");
        return;
    }

    app.innerHTML = `
        <div class="my-events-wrapper">
            <h1>My Events</h1>
            <div id="my-events-list">
                <p>Loading your events...</p>
            </div>
        </div>
    `;

    try {
        const events = await getMyEvents(token);
        const list = document.getElementById("my-events-list")!;

        if (events.length === 0) {
            list.innerHTML = "<p>You haven't created any events yet.</p>";
            return;
        }

        list.innerHTML = events.map((event: any) => `
            <div class="event-card">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
                <p><strong>Price:</strong> ₦${event.price}</p>
            </div>
        `).join("");
    } catch {
        document.getElementById("my-events-list")!.innerHTML =
            "<p>Failed to load events.</p>";
    }
}
