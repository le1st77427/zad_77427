function changeTheme() {
    const themeLink = document.getElementById("themeLink");

    if (themeLink.getAttribute("href") === "green.css") {
        themeLink.setAttribute("href", "red.css");
    } else {
        themeLink.setAttribute("href", "green.css");
    }
}

function toggleSection() {
    const section = document.getElementById("projekty");

    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

// ZADANIE 6: Pobieranie danych z pliku JSON
function loadData() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania pliku JSON');
            }
            return response.json();
        })
        .then(data => {
            // 1. Generowanie listy umiejętności
            const skillsList = document.getElementById('skillsList');
            data.umiejetnosci.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                skillsList.appendChild(li);
            });

            // 2. Generowanie listy projektów
            const projectsList = document.getElementById('projectsList');
            data.projekty.forEach(project => {
                const li = document.createElement('li');
                li.textContent = project;
                projectsList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Wystąpił problem z pobieraniem danych (Fetch):', error);
        });
}

// Uruchomienie kodu po załadowaniu całej strony
document.addEventListener('DOMContentLoaded', function() {
    
    // Uruchom pobieranie danych JSON
    loadData();

    // Logika formularza (Zadanie 5)
    const contactForm = document.getElementById('contactForm');
    
    if(contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const fields = {
                name: document.getElementById('firstName'),
                surname: document.getElementById('lastName'),
                email: document.getElementById('email'),
                message: document.getElementById('message')
            };

            let isFormValid = true;

            const noDigitsRegex = /^[^0-9]+$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            function validateField(field, errorId, condition, errorMsg) {
                const errorSpan = document.getElementById(errorId);
                field.classList.remove('field-error', 'field-success');

                if (!condition) {
                    field.classList.add('field-error');
                    errorSpan.textContent = errorMsg;
                    isFormValid = false;
                } else {
                    field.classList.add('field-success');
                    errorSpan.textContent = '';
                }
            }

            validateField(fields.name, 'firstNameError', 
                fields.name.value.trim() !== "" && noDigitsRegex.test(fields.name.value), 
                "Imię jest wymagane i nie może zawierać cyfr.");

            validateField(fields.surname, 'lastNameError', 
                fields.surname.value.trim() !== "" && noDigitsRegex.test(fields.surname.value), 
                "Nazwisko jest wymagane i nie może zawierać cyfr.");

            validateField(fields.email, 'emailError', 
                emailRegex.test(fields.email.value.trim()), 
                "Wprowadź poprawny adres e-mail.");

            validateField(fields.message, 'messageError', 
                fields.message.value.trim() !== "", 
                "Wiadomość nie może być pusta.");

            const statusDisplay = document.getElementById('formStatus');
            if (isFormValid) {
                statusDisplay.textContent = "✅ Formularz wysłany pomyślnie!";
                statusDisplay.style.color = "#66ff66"; // або інший колір з вашої теми
            } else {
                statusDisplay.textContent = "❌ Popraw błędy w formularzu.";
                statusDisplay.style.color = "#ff6666";
            }
        });
    }
});