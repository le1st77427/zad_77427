// ================= THEME SWITCH =================

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


// ================= TOGGLE PROJECTS =================

function toggleProjects() {

    const projects = document.getElementById("projekty");

    if (projects.style.display === "none") {
        projects.style.display = "block";
    } 
    else {
        projects.style.display = "none";
    }

}
