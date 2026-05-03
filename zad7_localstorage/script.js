// ==========================================
// FUNKCJE OGÓLNE I ZAPAMIĘTYWANIE MOTYWU (LocalStorage)
// ==========================================
function changeTheme() {
    const themeLink = document.getElementById("themeLink");
    let currentTheme = themeLink.getAttribute("href");
    let newTheme = currentTheme === "green.css" ? "red.css" : "green.css";
    
    themeLink.setAttribute("href", newTheme);
    
    // Zapisujemy wybrany motyw w Local Storage
    localStorage.setItem("savedTheme", newTheme);
}

function toggleSection() {
    const section = document.getElementById("projekty");
    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

// ==========================================
// ZADANIE 6: POBIERANIE JSON (Fetch)
// ==========================================
function loadData() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Błąd pobierania pliku JSON');
            return response.json();
        })
        .then(data => {
            const skillsList = document.getElementById('skillsList');
            data.umiejetnosci.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                skillsList.appendChild(li);
            });

            const projectsList = document.getElementById('projectsList');
            data.projekty.forEach(project => {
                const li = document.createElement('li');
                li.textContent = project;
                projectsList.appendChild(li);
            });
        })
        .catch(error => console.error('Wystąpił problem:', error));
}

// ==========================================
// ZADANIE 7: LOCAL STORAGE (Notatki)
// ==========================================
function loadNotes() {
    // Odczyt danych z Local Storage (lub pusta tablica, jeśli brak danych)
    const notes = JSON.parse(localStorage.getItem('userNotes')) || [];
    const notesList = document.getElementById('notesList');
    
    // Czyszczenie listy przed ponownym wygenerowaniem
    notesList.innerHTML = '';

    notes.forEach((noteText, index) => {
        const li = document.createElement('li');
        li.className = 'note-item';
        
        li.innerHTML = `
            <span>${noteText}</span>
            <button class="delete-btn" onclick="deleteNote(${index})">Usuń</button>
        `;
        
        notesList.appendChild(li);
    });
}

function addNote() {
    const input = document.getElementById('noteInput');
    const noteText = input.value.trim();

    if (noteText !== "") {
        // 1. Pobierz aktualne notatki
        const notes = JSON.parse(localStorage.getItem('userNotes')) || [];
        // 2. Dodaj nową do tablicy
        notes.push(noteText);
        // 3. Zapisz z powrotem do Local Storage
        localStorage.setItem('userNotes', JSON.stringify(notes));
        
        // 4. Wyczyść input i odśwież widok
        input.value = '';
        loadNotes();
    } else {
        alert("Wpisz tekst notatki!");
    }
}

function deleteNote(index) {
    // 1. Pobierz notatki
    const notes = JSON.parse(localStorage.getItem('userNotes')) || [];
    // 2. Usuń element pod podanym indeksem
    notes.splice(index, 1);
    // 3. Nadpisz Local Storage nową tablicą
    localStorage.setItem('userNotes', JSON.stringify(notes));
    
    // 4. Odśwież widok
    loadNotes();
}

// ==========================================
// INICJALIZACJA PO ZAŁADOWANIU STRONY
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Przywracanie motywu z Local Storage
    const savedTheme = localStorage.getItem("savedTheme");
    if (savedTheme) {
        document.getElementById("themeLink").setAttribute("href", savedTheme);
    }

    // Uruchomienie pobierania JSON (Zadanie 6)
    loadData();

    // Ładowanie notatek z Local Storage (Zadanie 7)
    loadNotes();

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

            validateField(fields.name, 'firstNameError', fields.name.value.trim() !== "" && noDigitsRegex.test(fields.name.value), "Imię jest wymagane i nie może zawierać cyfr.");
            validateField(fields.surname, 'lastNameError', fields.surname.value.trim() !== "" && noDigitsRegex.test(fields.surname.value), "Nazwisko jest wymagane i nie może zawierać cyfr.");
            validateField(fields.email, 'emailError', emailRegex.test(fields.email.value.trim()), "Wprowadź poprawny adres e-mail.");
            validateField(fields.message, 'messageError', fields.message.value.trim() !== "", "Wiadomość nie może być pusta.");

            const statusDisplay = document.getElementById('formStatus');
            if (isFormValid) {
                statusDisplay.textContent = "✅ Formularz wysłany pomyślnie!";
                statusDisplay.style.color = "#66ff66";
            } else {
                statusDisplay.textContent = "❌ Popraw błędy w formularzu.";
                statusDisplay.style.color = "#ff6666";
            }
        });
    }
});