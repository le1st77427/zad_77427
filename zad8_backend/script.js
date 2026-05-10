document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadJSONData();
    renderNotes();
});


function changeTheme() {
    const themeLink = document.getElementById('themeLink');
    if (themeLink.getAttribute('href') === 'green.css') {
        themeLink.setAttribute('href', 'red.css');
        localStorage.setItem('savedTheme', 'red.css');
    } else {
        themeLink.setAttribute('href', 'green.css');
        localStorage.setItem('savedTheme', 'green.css');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('savedTheme');
    if (savedTheme) {
        document.getElementById('themeLink').setAttribute('href', savedTheme);
    }
}


function loadJSONData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const skillsList = document.getElementById('skillsList');
            const projectsList = document.getElementById('projectsList');
            
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
        .catch(error => console.error('Błąd pobierania danych:', error));
}


function addNote() {
    const input = document.getElementById('noteInput');
    const text = input.value.trim();
    if (text === "") return;

    let notes = JSON.parse(localStorage.getItem('userNotes')) || [];
    notes.push(text);
    localStorage.setItem('userNotes', JSON.stringify(notes));
    
    input.value = "";
    renderNotes();
}

function renderNotes() {
    const list = document.getElementById('notesList');
    list.innerHTML = "";
    let notes = JSON.parse(localStorage.getItem('userNotes')) || [];

    notes.forEach((note, index) => {
        let li = document.createElement('li');
        li.innerHTML = `<span>${note}</span> <button onclick="deleteNote(${index})">Usuń</button>`;
        list.appendChild(li);
    });
}

function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem('userNotes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('userNotes', JSON.stringify(notes));
    renderNotes();
}

const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('firstName');
        const surname = document.getElementById('lastName');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const statusDisplay = document.getElementById('formStatus');

        let isFormValid = true;
        const noDigits = /^[^0-9]+$/;
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

        validate(name, 'firstNameError', name.value.trim() !== "" && noDigits.test(name.value), "Wymagane, bez cyfr.");
        validate(surname, 'lastNameError', surname.value.trim() !== "" && noDigits.test(surname.value), "Wymagane, bez cyfr.");
        validate(email, 'emailError', emailRegex.test(email.value.trim()), "Błędny e-mail.");
        validate(message, 'messageError', message.value.trim() !== "", "Wiadomość nie może być pusta.");

        if (isFormValid) {
            statusDisplay.textContent = "Wysyłanie danych na serwer...";
            statusDisplay.style.color = "blue";

            const formData = {
                firstName: name.value,
                lastName: surname.value,
                email: email.value,
                message: message.value
            };

            const backendURL = 'https://6a00f29436fb6ad04de097f5.mockapi.io/message';

            fetch(backendURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    statusDisplay.textContent = "✅ Sukces! Dane zapisane na serwerze (MockAPI).";
                    statusDisplay.style.color = "green";
                    contactForm.reset();
                    [name, surname, email, message].forEach(f => f.classList.remove('field-success'));
                } else {
                    throw new Error("Błąd serwera");
                }
            })
            .catch(error => {
                statusDisplay.textContent = "❌ Wystąpił błąd serwera.";
                statusDisplay.style.color = "red";
                console.error(error);
            });
        }
    });
}