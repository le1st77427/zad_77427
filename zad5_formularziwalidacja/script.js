document.getElementById('contactForm').addEventListener('submit', function(event) {
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

    // Універсальна функція перевірки
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

    // Фінальний статус
    const statusDisplay = document.getElementById('formStatus');
    if (isFormValid) {
        statusDisplay.textContent = "✅ Formularz wysłany pomyślnie!";
        statusDisplay.style.color = "#2e7d32";
    } else {
        statusDisplay.textContent = "❌ Popraw błędy w formularzu.";
        statusDisplay.style.color = "#d32f2f";
    }
});