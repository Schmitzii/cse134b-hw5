let theme = localStorage.getItem('theme');

let baseColor = localStorage.getItem("customBaseColor") || "white";
let baseVariant = "#f4f4f4";
let textColor = localStorage.getItem("customTextColor") || "black";
let primaryColor = "#3A7D44";
let fontFamily = localStorage.getItem("customFontFamily") || "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";

const themePicker = document.getElementById("themePicker");
const bgPicker = document.getElementById("bgColorPicker");
const textPicker = document.getElementById("textColorPicker");
const fontPicker = document.getElementById("fontPicker");

document.addEventListener("DOMContentLoaded", () => {
    if(theme){
        setTheme(theme);
    }
}); 

themePicker.addEventListener("change", (e) => {
    setTheme(e.target.value)
});

bgPicker.addEventListener("input", (e) => {
    baseColor = e.target.value;
    saveCustomValues();
    setTheme("custom");
});

textPicker.addEventListener("input", (e) => {
    textColor = e.target.value;
    saveCustomValues();
    setTheme("custom");
});

fontPicker.addEventListener("change", (e) => {
    fontFamily = e.target.value;
    saveCustomValues();
    setTheme("custom");
});


function setTheme(themeValue){
    if (themeValue === "dark"){
        themePicker.value = "dark";
        localStorage.setItem('theme', 'dark');
        document.documentElement.style.setProperty("--base-color", "black");
        document.documentElement.style.setProperty("--base-variant", "rgb(29, 29, 29)");
        document.documentElement.style.setProperty("--text-color", "white");
        document.documentElement.style.setProperty("--primary-color", "#3A7D44");
    } else if(themeValue === "light"){
        themePicker.value = "light";
        localStorage.setItem('theme', 'light');
        document.documentElement.style.setProperty("--base-color", "white");
        document.documentElement.style.setProperty("--base-variant", "#f4f4f4");
        document.documentElement.style.setProperty("--text-color", "black");
        document.documentElement.style.setProperty("--primary-color", "#3A7D44");
    } else if(themeValue === "halloween"){
        themePicker.value = "halloween";
        localStorage.setItem('theme', 'halloween');
        document.documentElement.style.setProperty("--base-color", "black");
        document.documentElement.style.setProperty("--base-variant", "rgba(57, 40, 0, 1)");
        document.documentElement.style.setProperty("--text-color", "white");
        document.documentElement.style.setProperty("--primary-color", "orange");
    } else if (themeValue === "custom"){
        localStorage.setItem('theme', 'custom');
        document.documentElement.style.setProperty("--base-color", baseColor);
        document.documentElement.style.setProperty("--base-variant", baseVariant);
        document.documentElement.style.setProperty("--text-color", textColor);
        document.documentElement.style.setProperty("--primary-color", primaryColor);
        document.documentElement.style.setProperty("--font-family", fontFamily);
    }
}

function saveCustomValues() {
    localStorage.setItem("customBaseColor", baseColor);
    localStorage.setItem("customTextColor", textColor);
    localStorage.setItem("customFontFamily", fontFamily);
}