import "./home.css";
import { navigate } from "../../router";

export function renderHomePage() {
    const app = document.getElementById("app")!;

    app.innerHTML = `
        <div class="home-page">
            <div class="page-orb orb-one"></div>
            <div class="page-orb orb-two"></div>
            <div class="page-grid"></div>

            <section class="hero-section">
                <div class="hero-layout">
                    <div class="hero-copy">
                        <div class="hero-kicker">
                            <span class="kicker-dot"></span>
                            <span>For event lovers and creators</span>
                        </div>

                        <h1>
                            The modern home for
                            <span>discovering unforgettable events.</span>
                        </h1>

                        <p>
                            Browse standout experiences, book faster, and manage premium events
                            with a platform that feels cleaner, smarter, and far more intentional.
                        </p>

                        <div class="hero-actions">
                            <button class="btn-primary" id="getStartedBtn">
                                <span>Get started</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button class="btn-secondary" id="exploreBtn">
                                <span>Explore events</span>
                            </button>
                        </div>

                        <div class="hero-trust">
                            <span>Live ticketing</span>
                            <span>Fast checkout</span>
                            <span>Verified entry</span>
                        </div>
                    </div>

                    <div class="hero-showcase">
                        <div class="showcase-shell">
                            <div class="showcase-featured">
                                <div class="featured-image"></div>
                                <div class="featured-content">
                                    <span class="featured-badge">Editor's pick</span>
                                    <h2>Twilight Roofhouse</h2>
                                    <p>An intimate music night with a smooth booking flow, curated crowd, and effortless entry.</p>
                                    <div class="featured-meta">
                                        <span>Friday, 8:00 PM</span>
                                        <span>Victoria Island</span>
                                    </div>
                                </div>
                            </div>

                            <div class="showcase-side">
                                <div class="mini-card attendance-card">
                                    <span class="mini-label">Attendance</span>
                                    <strong>92%</strong>
                                    <p>Capacity already claimed for tonight's featured experience.</p>
                                </div>

                                <div class="mini-card tickets-card">
                                    <span class="mini-label">Tickets sold</span>
                                    <strong>340,000+</strong>
                                    <p>People are already using Eventful to find and attend what matters.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="features-section">
                <div class="section-heading">
                    <span class="section-tag">Features</span>
                    <h2>Everything that makes events feel seamless, before and after the ticket is sold.</h2>
                    <p>From browsing to entry, every touchpoint is designed to feel faster, clearer, and more premium for everyone involved.</p>
                </div>

                <div class="features-grid">
                    <article class="feature-card wide">
                        <div class="feature-icon aqua">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="7" height="7" rx="1"/>
                                <rect x="3" y="14" width="7" height="7" rx="1"/>
                                <rect x="14" y="3" width="7" height="7" rx="1"/>
                                <rect x="14" y="14" width="7" height="7" rx="1"/>
                            </svg>
                        </div>
                        <h3>QR ticketing built for real event flow</h3>
                        <p>Issue clean ticket passes, verify them instantly, and keep entry lines moving without stress.</p>
                    </article>

                    <article class="feature-card">
                        <div class="feature-icon blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 6v6l4 2"/>
                            </svg>
                        </div>
                        <h3>Secure payments</h3>
                        <p>Give buyers a checkout experience that feels safe, quick, and friction-free.</p>
                    </article>

                    <article class="feature-card">
                        <div class="feature-icon violet">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                                <line x1="12" y1="22.08" x2="12" y2="12"/>
                            </svg>
                        </div>
                        <h3>Analytics</h3>
                        <p>Understand turnout, revenue, and buying patterns in real time without clutter.</p>
                    </article>

                    <article class="feature-card">
                        <div class="feature-icon coral">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                        </div>
                        <h3>Verification</h3>
                        <p>Keep tickets authentic and event-day access smooth from first scan to final check-in.</p>
                    </article>

                    <article class="feature-card wide">
                        <div class="feature-icon gold">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.35-4.35"/>
                            </svg>
                        </div>
                        <h3>Discovery that actually helps people find what fits their mood</h3>
                        <p>Use smart filters, categories, and saved events to help attendees come back to what they care about.</p>
                    </article>

                    <article class="feature-card">
                        <div class="feature-icon mint">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>
                        <h3>Bookmarks and reminders</h3>
                        <p>Let people save experiences early and come back when they’re ready to commit.</p>
                    </article>
                </div>
            </section>

            <section class="events-section">
                <div class="events-header">
                    <div class="section-heading compact">
                        <span class="section-tag">Upcoming events</span>
                        <h2>What’s drawing people out right now.</h2>
                        <p>Fresh cultural moments, curated gatherings, and standout events that are already building momentum.</p>
                    </div>
                    <button class="view-all-btn" id="viewAllBtn">View all events</button>
                </div>

                <div class="events-grid">
                    <article class="event-card">
                        <div class="event-image">
                            <img src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=900&h=700&fit=crop" alt="Music event" />
                            <div class="event-image-overlay"></div>
                            <div class="event-image-actions">
                                <button class="share-event-btn" type="button" aria-label="Share Lagos Jazz Festival 2026" data-share-url="/events/lagos-jazz-festival-2026">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/>
                                        <path d="M12 3v12"/>
                                        <path d="M7 8l5-5 5 5"/>
                                    </svg>
                                </button>
                            </div>
                            <span class="event-category">Music</span>
                        </div>
                        <div class="event-content">
                            <h3>Lagos Jazz Festival 2026</h3>
                            <div class="event-detail">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                <span>March 22, 2026</span>
                            </div>
                            <div class="event-detail">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                <span>Terra Kulture, Victoria Island</span>
                            </div>
                            <div class="event-footer">
                                <span class="event-price">NGN 5,000</span>
                                <span class="event-spots">234 of 500 spots</span>
                            </div>
                        </div>
                    </article>

                    <article class="event-card">
                        <div class="event-image">
                            <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&h=700&fit=crop" alt="Tech event" />
                            <div class="event-image-overlay"></div>
                            <div class="event-image-actions">
                                <button class="share-event-btn" type="button" aria-label="Share Tech Founders Meetup" data-share-url="/events/tech-founders-meetup">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/>
                                        <path d="M12 3v12"/>
                                        <path d="M7 8l5-5 5 5"/>
                                    </svg>
                                </button>
                            </div>
                            <span class="event-category">Technology</span>
                        </div>
                        <div class="event-content">
                            <h3>Tech Founders Meetup</h3>
                            <div class="event-detail">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                <span>March 18, 2026</span>
                            </div>
                            <div class="event-detail">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                <span>CcHub, Yaba, Lagos</span>
                            </div>
                            <div class="event-footer">
                                <span class="event-price">Free</span>
                                <span class="event-spots">89 of 150 spots</span>
                            </div>
                        </div>
                    </article>

                    <article class="event-card">
                        <div class="event-image">
                            <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=700&fit=crop" alt="Food event" />
                            <div class="event-image-overlay"></div>
                            <div class="event-image-actions">
                                <button class="share-event-btn" type="button" aria-label="Share Nigerian Food Festival" data-share-url="/events/nigerian-food-festival">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/>
                                        <path d="M12 3v12"/>
                                        <path d="M7 8l5-5 5 5"/>
                                    </svg>
                                </button>
                            </div>
                            <span class="event-category">Food and Drink</span>
                        </div>
                        <div class="event-content">
                            <h3>Nigerian Food Festival</h3>
                            <div class="event-detail">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                <span>March 25, 2026</span>
                            </div>
                            <div class="event-detail">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                <span>Eko Convention Centre</span>
                            </div>
                            <div class="event-footer">
                                <span class="event-price">NGN 3,500</span>
                                <span class="event-spots">412 of 600 spots</span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <section class="how-section">
                <div class="how-layout">
                    <div class="how-intro">
                        <span class="section-tag alt">How it works</span>
                        <h2>A smooth flow for hosting and attending better events.</h2>
                        <p>Whether you're putting together your first gathering or planning your next standout experience, the flow stays clear from setup to event day.</p>
                    </div>

                    <div class="how-grid">
                        <article class="how-card">
                            <div class="how-number">01</div>
                            <h3>Create the event</h3>
                            <p>Shape the page, upload visuals, set pricing, and structure the experience in one place.</p>
                        </article>

                        <article class="how-card">
                            <div class="how-number">02</div>
                            <h3>Open ticket sales</h3>
                            <p>Launch publicly, collect payments, and monitor demand without relying on scattered tools.</p>
                        </article>

                        <article class="how-card">
                            <div class="how-number">03</div>
                            <h3>Run it beautifully</h3>
                            <p>Verify guests quickly, manage turnout confidently, and deliver a smoother event-day experience.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section class="cta-section">
                <div class="cta-panel">
                    <span class="cta-tag">Get started</span>
                    <h2>Bring your next event online with a page that already feels world-class.</h2>
                    <p>Eventful gives creators and attendees a cleaner, sharper way to connect around the moments that matter.</p>
                    <div class="cta-actions">
                        <button class="btn-primary light" id="ctaBtn">
                            <span>Create an event</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="btn-secondary light-outline" id="ctaExploreBtn">
                            <span>View events</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    `;

    document.getElementById("getStartedBtn")?.addEventListener("click", () => navigate("/create"));
    document.getElementById("exploreBtn")?.addEventListener("click", () => navigate("/explore"));
    document.getElementById("ctaBtn")?.addEventListener("click", () => navigate("/create"));
    document.getElementById("ctaExploreBtn")?.addEventListener("click", () => navigate("/explore"));
    document.getElementById("viewAllBtn")?.addEventListener("click", () => navigate("/explore"));

    document.querySelectorAll<HTMLButtonElement>(".share-event-btn").forEach((button) => {
        button.addEventListener("click", async () => {
            const sharePath = button.dataset.shareUrl;
            if (!sharePath) return;

            const shareUrl = new URL(sharePath, window.location.origin).toString();

            try {
                if (navigator.share) {
                    await navigator.share({
                        title: "Eventful event",
                        url: shareUrl,
                    });
                } else {
                    await navigator.clipboard.writeText(shareUrl);
                    const originalLabel = button.innerHTML;
                    button.textContent = "Copied";
                    window.setTimeout(() => {
                        button.innerHTML = originalLabel;
                    }, 1400);
                }
            } catch {
                // Ignore cancelled shares and clipboard failures silently.
            }
        });
    });
}
