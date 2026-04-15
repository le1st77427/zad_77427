// CHANGE THEME

function toggleTheme() {

    const body = document.body;

    if (body.classList.contains("theme-green")) {
        body.classList.remove("theme-green");
        body.classList.add("theme-red");
    } 
    else {
        body.classList.remove("theme-red");
        body.classList.add("theme-green");
    }

}



// TOGGLE PROJECTS SECTION

function toggleProjects() {

    const section = document.getElementById("projekty");

    if (section.style.display === "none") {
        section.style.display = "block";
    } 
    else {
        section.style.display = "none";
    }

}
