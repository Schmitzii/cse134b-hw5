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
    darkmode !== "active" ? enableDarkmode() : disableDarkmode();
});


const bgPicker = document.getElementById("bgColorPicker");
const textPicker = document.getElementById("textColorPicker");
const fontPicker = document.getElementById("fontPicker");

bgPicker.addEventListener("input", (e) => {
    document.documentElement.style.setProperty("--background-color", e.target.value);
});

textPicker.addEventListener("input", (e) => {
    document.documentElement.style.setProperty("--text-color", e.target.value);
});

fontPicker.addEventListener("change", (e) => {
    document.documentElement.style.setProperty("--font-family", e.target.value);
});