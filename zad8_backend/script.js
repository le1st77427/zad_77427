
function changeTheme() {
    const themeLink = document.getElementById("themeLink");
    let currentTheme = themeLink.getAttribute("href");
    let newTheme = currentTheme === "green.css" ? "red.css" : "green.css";
    
    themeLink.setAttribute("href", newTheme);
    localStorage.setItem("savedTheme", newTheme);
}

function toggleSection() {
    const section = document.getElementById("projekty");
    section.style.display = (section.style.display === "none") ? "block" : "none";
}


function loadData() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Błąd JSON');
            return response.json();
        })
        .then(data => {
            const skillsList = document.getElementById('skillsList');
            const projectsList = document.getElementById('projectsList');
            

            if(skillsList) skillsList.innerHTML = '';
            if(projectsList) projectsList.innerHTML = '';

            data.umiejetnosci.forEach(skill => {
                let li = document.createElement('li');
                li.textContent = skill;
                skillsList.appendChild(li);
            });
            
            data.projekty.forEach(project => {
                let li = document.createElement('li');
                li.textContent = project;
                projectsList.appendChild(li);
            });
        })
        .catch(error => console.error('Wystąpił problem:', error));
}


function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('userNotes')) || [];
    const list = document.getElementById('notesList');
    if(!list) return;
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

    const savedTheme = localStorage.getItem("savedTheme");
    if (savedTheme) document.getElementById("themeLink").setAttribute("href", savedTheme);

    loadData();
    loadNotes();


    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nameField = document.getElementById('firstName');
            const surnameField = document.getElementById('lastName');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            const statusDisplay = document.getElementById('formStatus');

            let isFormValid = true;
            const noDigitsRegex = /^[^0-9]+$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            function validate(field, errorId, condition, errorMsg) {
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


            validate(nameField, 'firstNameError', nameField.value.trim() !== "" && noDigitsRegex.test(nameField.value), "Wymagane, bez cyfr.");
            validate(surnameField, 'lastNameError', surnameField.value.trim() !== "" && noDigitsRegex.test(surnameField.value), "Wymagane, bez cyfr.");
            validate(emailField, 'emailError', emailRegex.test(emailField.value.trim()), "Niepoprawny e-mail.");
            validate(messageField, 'messageError', messageField.value.trim() !== "", "Wiadomość jest pusta.");

            if (isFormValid) {
                statusDisplay.textContent = "Wysyłanie danych...";
                statusDisplay.style.color = "yellow";

                const formData = {
                    firstName: nameField.value,
                    lastName: surnameField.value,
                    email: emailField.value,
                    message: messageField.value
                };


                const backendURL = 'https://67cd270fdd7651e464ed4f4c.mockapi.io/messages';

                fetch(backendURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (response.ok) {
                        statusDisplay.textContent = "✅ Sukces! Wiadomość została zapisana w bazie danych (Backend).";
                        statusDisplay.style.color = "#66ff66";
                        contactForm.reset();

                        [nameField, surnameField, emailField, messageField].forEach(f => f.classList.remove('field-success'));
                    } else {
                        throw new Error("Błąd serwera");
                    }
                })
                .catch(error => {
                    statusDisplay.textContent = "❌ Wystąpił błąd podczas wysyłania.";
                    statusDisplay.style.color = "#ff6666";
                    console.error('Błąd Fetch POST:', error);
                });
            } else {
                statusDisplay.textContent = "❌ Popraw błędy w formularzu.";
                statusDisplay.style.color = "#ff6666";
            }
        });
    }
});
