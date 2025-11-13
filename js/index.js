let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

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
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            darkmode !== "active" ? enableDarkmode() : disableDarkmode();
        });
    }
});

document.querySelectorAll("a[href]").forEach(link => {
    const url = link.href;

    if(!url.includes("projects/")) return;

    link.addEventListener("click", e => {
        e.preventDefault();
        document.startViewTransition(() => {
            window.location.href = url;
        });
    });
});
