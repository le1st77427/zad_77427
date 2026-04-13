// Zmiana motywu

function changeTheme() {

    const body = document.body;

    if (body.classList.contains("green-theme")) {

        body.classList.remove("green-theme");
        body.classList.add("red-theme");

    }

    else {

        body.classList.remove("red-theme");
        body.classList.add("green-theme");

    }

}



// Ukrywanie sekcji Projekty

function toggleSection() {

    const section = document.getElementById("projekty");

    if (section.style.display === "none") {

        section.style.display = "block";

    }

    else {

        section.style.display = "none";

    }

}