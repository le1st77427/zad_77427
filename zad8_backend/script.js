
function changeTheme() {
    const themeLink = document.getElementById("themeLink");
    if (!themeLink) return;
    
    let currentTheme = themeLink.getAttribute("href");
    let newTheme = currentTheme === "green.css" ? "red.css" : "green.css";
    
    themeLink.setAttribute("href", newTheme);
    localStorage.setItem("savedTheme", newTheme);
}

function toggleSection() {
    const section = document.getElementById("projekty");
    if (!section) return;
    section.style.display = (section.style.display === "none") ? "block" : "none";
}


function loadData() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Błąd ładowania pliku JSON');
            return response.json();
        })
        .then(data => {
            const skillsList = document.getElementById('skillsList');
            const projectsList = document.getElementById('projectsList');
            
            if (skillsList) {
                skillsList.innerHTML = '';
                data.umiejetnosci.forEach(skill => {
                    let li = document.createElement('li');
                    li.textContent = skill;
                    skillsList.appendChild(li);
                });
            }
            
            if (projectsList) {
                projectsList.innerHTML = '';
                data.projekty.forEach(project => {
                    let li = document.createElement('li');
                    li.textContent = project;
                    projectsList.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Błąd JSON:', error));
}


function loadNotes() {
    const list = document.getElementById('notesList');
    if (!list) return;
    
    const notes = JSON.parse(localStorage.getItem('userNotes')) || [];
    list.innerHTML = '';
    
    notes.forEach((text, index) => {
        let li = document.createElement('li');
        li.className = 'note-item';
        li.innerHTML = `<span>${text}</span> <button class="delete-btn" onclick="deleteNote(${index})">Usuń</button>`;
        list.appendChild(li);
    });
}

function addNote() {
    const input = document.getElementById('noteInput');
    if (!input) return;
    
    const text = input.value.trim();
    if (text !== "") {
        const notes = JSON.parse(localStorage.getItem('userNotes')) || [];
        notes.push(text);
        localStorage.setItem('userNotes', JSON.stringify(notes));
        input.value = '';
        loadNotes();
    }
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('userNotes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('userNotes', JSON.stringify(notes));
    loadNotes();
}


document.addEventListener('DOMContentLoaded', () => {
    // 1. Ładowanie motywu
    const savedTheme = localStorage.getItem("savedTheme");
    const themeLink = document.getElementById("themeLink");
    if (savedTheme && themeLink) {
        themeLink.setAttribute("href", savedTheme);
    }

    // 2. Ładowanie danych i notatek
    loadData();
    loadNotes();

    // 3. Obsługa formularza
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nameField = document.getElementById('firstName');
            const surnameField = document.getElementById('lastName');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            const statusDisplay = document.getElementById('formStatus');

            if (!nameField || !surnameField || !emailField || !messageField || !statusDisplay) {
                console.error("Błąd: Nie znaleziono pól formularza w HTML.");
                return;
            }

            let isFormValid = true;
            const noDigitsRegex = /^[^0-9]+$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            function validate(field, errorId, condition, errorMsg) {
                const errorSpan = document.getElementById(errorId);
                if (!errorSpan) return;
                
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

            // Walidacja
            validate(nameField, 'firstNameError', nameField.value.trim() !== "" && noDigitsRegex.test(nameField.value), "Wymagane, bez cyfr.");
            validate(surnameField, 'lastNameError', surnameField.value.trim() !== "" && noDigitsRegex.test(surnameField.value), "Wymagane, bez cyfr.");
            validate(emailField, 'emailError', emailRegex.test(emailField.value.trim()), "Błędny adres e-mail.");
            validate(messageField, 'messageError', messageField.value.trim() !== "", "Wiadomość nie może być pusta.");

            // Wysyłanie
            if (isFormValid) {
                statusDisplay.textContent = "Wysyłanie danych na serwer...";
                statusDisplay.style.color = "yellow";

                const currentData = {
                    firstName: nameField.value.trim(),
                    lastName: surnameField.value.trim(),
                    email: emailField.value.trim(),
                    message: messageField.value.trim()
                };

                console.log("Dane do wysłania:", currentData);

                const backendURL = 'https://67cd270fdd7651e464ed4f4c.mockapi.io/messages';

                fetch(backendURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentData)
                })
                .then(response => {
                    if (response.ok) {
                        statusDisplay.textContent = "✅ Sukces! Wiadomość zapisana w MockAPI.";
                        statusDisplay.style.color = "#66ff66";
                        contactForm.reset();
                        [nameField, surnameField, emailField, messageField].forEach(f => f.classList.remove('field-success'));
                        console.log("Wysłano pomyślnie.");
                    } else {
                        throw new Error("Błąd serwera. Status: " + response.status);
                    }
                })
                .catch(error => {
                    statusDisplay.textContent = "❌ Wystąpił błąd podczas wysyłania (Fetch).";
                    statusDisplay.style.color = "#ff6666";
                    console.error('Błąd Fetch POST:', error);
                });
            } else {
                statusDisplay.textContent = "❌ Popraw błędy w polach formularza.";
                statusDisplay.style.color = "#ff6666";
            }
        });
    } else {
        console.error("Błąd: Nie znaleziono formularza o ID 'contactForm'.");
    }
});
