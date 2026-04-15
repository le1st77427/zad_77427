
function ozChangeTheme() {
    const ozLink = document.getElementById("ozThemeLink");

    if (ozLink.getAttribute("href") === "green.css") {
        ozLink.setAttribute("href", "red.css");
    } else {
        ozLink.setAttribute("href", "green.css");
    }
}

function ozToggleSection() {
    const ozSection = document.getElementById("projekty");

    if (ozSection.style.display === "none") {
        ozSection.style.display = "block";
    } else {
        ozSection.style.display = "none";
    }
}
