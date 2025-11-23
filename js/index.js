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
                        /* constrain card width for larger screens */
                        max-width: 320px;
                        width: 100%;
                        background: var(--base-color, #fff);
                        color: var(--text-color, #222);
                        border-radius: var(--default-border-radius, 16px);
                        box-shadow: var(--card-shadow, 0 2px 10px rgba(0,0,0,0.05));
                        padding: var(--default-padding, 18px);
                        padding-top: calc(var(--default-padding, 18px) + 8px);
                        position: relative;
                        box-sizing: border-box; /* include padding in width calculation */
                        margin: 0 auto;
                    }
                    picture, picture img, img {
                        width: 100%;
                        max-width: 100%;
                        height: auto;
                        display: block;
                        object-fit: cover;
                    }
                    img {
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

                    p{
                    font-size: 0.8rem;
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

        this.shadowRoot.querySelector(".meta").textContent =
            this.getAttribute("updated")
                ? `Last updated: ${this.getAttribute("updated")}`
                : "";

        this.shadowRoot.querySelector(".keywords").textContent =
            this.getAttribute("keywords")
                ? `Keywords: ${this.getAttribute("keywords")}`
                : "";

        this.shadowRoot.querySelector(".readmore").href =
            this.getAttribute("link") || "#";
    }
}

customElements.define('skill-card', SkillCard);
