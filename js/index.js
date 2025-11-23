let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');
const rootStyles = getComputedStyle(document.documentElement);

function enableDarkmode() {
    document.documentElement.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
}

function disableDarkmode() {
    document.documentElement.classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
}

if (darkmode === "active") enableDarkmode()

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkmode() : disableDarkmode();
});

class SkillCard extends HTMLElement {
    static get observedAttributes() {
        return ["title", "img", "alt", "link", "description"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        box-sizing: border-box;
                        width: 100%;
                        max-width: 100%;
                        font-family: var(--default-font-family, sans-serif);
                    }
                    .container {
                        display: flex;
                        flex-direction: column;
                        gap: 0.6em;
                        width: 100%;
                        background: var(--base-color, #fff);
                        color: var(--text-color, #222);
                        border-radius: var(--default-border-radius, 16px);
                        box-shadow: var(--card-shadow, 0 2px 10px rgba(0,0,0,0.05));
                        padding: var(--default-padding, 18px);
                        padding-top: calc(var(--default-padding, 18px) + 8px);
                        /* fixed card height so all cards are the same size by default */
                        height: var(--skill-card-height, 260px);
                        min-height: var(--skill-card-height, 260px);
                        position: relative;
                        box-sizing: border-box;
                        margin: 0 auto;
                        /* prevent children from escaping the card */
                        overflow: hidden;
                    }
                    /* image area: configurable max height so it doesn't push card beyond its box */
                    picture {
                        display: block;
                        width: 100%;
                        max-height: var(--skill-image-height, 160px);
                        overflow: hidden;
                        flex: 0 0 auto;
                    }
                    picture img, img {
                        width: 100%;
                        height: 100%;
                        display: block;
                        object-fit: cover;
                        border-radius: 8px;
                    }
                    .readmore {
                        color: var(--primary-color, #1a6bff);
                        font-weight: 600;
                        text-decoration: none;
                    }

                    h2{
                    text-align: center;
                    }

                    .description{
                        font-size: 0.9rem;
                        line-height: 1.2;
                        /* allow the description to shrink and scroll inside the card */
                        flex: 1 1 auto;
                        min-height: 0;
                        overflow: auto;
                        margin: 0;
                    }

                    .readmore{
                        align-self: flex-end;
                    }

                    a{
                    color: var(--primary-color, #1a6bff);
                    }
                </style>
                
                <div class="container">
                    <h2></h2>

                    <picture>
                        <img />
                    </picture>

                    <p class="description"></p>

                    <a class="readmore" target="_blank">Learn more →</a>
                </div>
        `;

    }

    connectedCallback() {
        this.update();
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        this.shadowRoot.querySelector("h2").textContent =
            this.getAttribute("title") || "";

        const img = this.shadowRoot.querySelector("img");
        img.src = this.getAttribute("img") || "";
        img.alt = this.getAttribute("alt") || "";

        const icon = this.shadowRoot.querySelector('.icon');
        if (icon) {
            const title = (this.getAttribute('title') || '').toLowerCase();
            // show the Python icon only for Python cards by default
            icon.style.display = title === 'python' ? 'inline-flex' : 'none';
        }

        this.shadowRoot.querySelector(".description").textContent =
            this.getAttribute("description") || "";

        this.shadowRoot.querySelector(".readmore").href =
            this.getAttribute("link") || "#";
    }
}

customElements.define('skill-card', SkillCard);

// Sample local dataset (will be seeded if localStorage is empty)
const SAMPLE_LOCAL = [
    {
        title: "Python",
        img: "/assets/images/tum.webp",
        alt: "Python logo",
        description: "Python for scripting, data processing and building small tools.",
        link: "https://www.python.org/",
    },
    {
        title: "HTML",
        img: "/assets/images/html.jpg",
        alt: "HTML markup",
        description: "Semantic, accessible HTML for robust document structure.",
        link: "https://html.spec.whatwg.org/",
    }
];

function seedLocalIfEmpty() {
    try {
        if (!localStorage.getItem('skills-local-data')) {
            localStorage.setItem('skills-local-data', JSON.stringify(SAMPLE_LOCAL));
        }
    } catch (e) {
        console.warn('Could not access localStorage to seed sample data', e);
    }
}

function renderSkills(items) {
    const section = document.getElementById('skills-section');
    if (!section) return;
    // clear existing cards
    section.innerHTML = '';
    for (const it of items) {
        const card = document.createElement('skill-card');
        if (it.title) card.setAttribute('title', it.title);
        if (it.img) card.setAttribute('img', it.img);
        if (it.alt) card.setAttribute('alt', it.alt);
        if (it.description) card.setAttribute('description', it.description);
        if (it.link) card.setAttribute('link', it.link);
        section.appendChild(card);
    }
}

async function loadLocal() {
    try {
        const raw = localStorage.getItem('skills-local-data');
        if (!raw) {
            console.warn('No local skills data found');
            return;
        }
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) throw new Error('Local data is not an array');
        renderSkills(data);
    } catch (e) {
        console.error('Failed to load local skills', e);
    }
}

async function loadRemote() {
    try {
        const resp = await fetch('/assets/data/skills-remote.json');
        if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
        const data = await resp.json();
        if (!Array.isArray(data)) throw new Error('Remote data is not an array');
        renderSkills(data);
    } catch (e) {
        console.error('Failed to load remote skills', e);
    }
}

// Wire buttons after DOM is ready (script is deferred, elements exist)
document.addEventListener('DOMContentLoaded', () => {
    seedLocalIfEmpty();
    const localBtn = document.getElementById('load-local-button');
    const remoteBtn = document.getElementById('load-remote-button');
    if (localBtn) localBtn.addEventListener('click', loadLocal);
    if (remoteBtn) remoteBtn.addEventListener('click', loadRemote);
});
