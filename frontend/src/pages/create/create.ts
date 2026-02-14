import "./create.css";
import { createEvent } from "../../api/createEvent.api";
import { getToken } from "../../utils/auth";
import { showMessage } from "../../components/notify/notify";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export function renderCreate() {
    const app = document.getElementById("app")!;

    app.innerHTML = `
        <div class="create-wrapper">

            <!-- HERO -->
            <section class="create-hero">
                <h1>
                    Turn Ideas Into 
                    <span class="gradient-text">Unforgettable Experiences</span>
                </h1>

                <p>
                    Host concerts, conferences, meetups, or private events.
                    We give you the tools. You create the magic.
                </p>

                <button class="hero-cta" id="scroll-to-form">
                    Start Creating →
                </button>
            </section>

            <!-- WHY HOST WITH US -->
            <section class="why-host">
                <div class="why-card">
                    <h3>⚡ Instant Setup</h3>
                    <p>Create and launch events in minutes, not hours.</p>
                </div>

                <div class="why-card">
                    <h3>📊 Real-Time Insights</h3>
                    <p>Track attendance and engagement effortlessly.</p>
                </div>

                <div class="why-card">
                    <h3>💳 Seamless Payments</h3>
                    <p>Secure and smooth ticket transactions.</p>
                </div>
            </section>

            <!-- STATS SECTION -->
            <section class="stats" id="stats">
                <div class="stat">
                    <h2 data-target="10000">0</h2>
                    <p>Events Hosted</p>
                </div>

                <div class="stat">
                    <h2 data-target="250000">0</h2>
                    <p>Tickets Sold</p>
                </div>

                <div class="stat">
                    <h2 data-target="99">0</h2>
                    <p>Platform Satisfaction (%)</p>
                </div>
            </section>

            <!-- FORM SECTION -->
            <section class="create-form-section" id="create-form-section">
                <div class="create-card">
                    <h2>Create Your Event</h2>

                    <form class="create-form" id="create-form">
                        <input type="text" id="title" placeholder="Event Title" required />

                        <textarea id="description" placeholder="Describe your event..." required></textarea>
                        
                        <input type="number" id="price" placeholder="Ticket Price (₦)" required />
                        <input type="text" id="date" placeholder="Select Event Date" required />
                        
                        <button type="submit" class="create-btn">Create Event</button>
                    </form>
                </div>
            </section>

        </div>
    `;

    flatpickr("#date", {
        minDate: "today",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
    });

    // Smooth scroll
    document.getElementById("scroll-to-form")!
        .addEventListener("click", () => {
            document.getElementById("create-form-section")!
                .scrollIntoView({ behavior: "smooth" });
        });

    // Form submit
    document.getElementById("create-form")!
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                const token = getToken()
                console.log("TOKEN:", token);

                if (!token) {
                    window.location.href = '/login'
                    return
                }

                const data = {
                    title: (document.getElementById("title") as HTMLInputElement).value,
                    description: (document.getElementById("description") as HTMLTextAreaElement).value,
                    price: Number((document.getElementById("price") as HTMLInputElement).value),
                    date: (document.getElementById("date") as HTMLInputElement).value,
                };

                await createEvent(token, data);

                showMessage("Event launched successfully 🚀", "success");

                window.location.href = '/explore'
            } catch {
                showMessage("Failed to create event", "error");
            }
        });

    const statsSection = document.getElementById("stats");

    if (statsSection) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }
}

function animateCounters() {
    const counters = document.querySelectorAll("[data-target]");

    counters.forEach(counter => {
        const el = counter as HTMLElement;
        const target = Number(el.getAttribute("data-target"));

        const duration = 1500; // 1.5 seconds
        const start = performance.now();

       const update = (timestamp: number) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const current = Math.floor(progress * target);

            el.innerText = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    });
}




