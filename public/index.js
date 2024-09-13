document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('seminarForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const seminarSelect = document.getElementById('seminar');

        clearErrors(nameInput, emailInput, seminarSelect);

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const seminar = seminarSelect.value;

        let hasError = false;
        const russianOnlyPattern = /^[А-Яа-яЁё]+$/;
        const invalidCharactersPattern = /[ \.]/;
        if (name === "") {
            setError(nameInput, 'Пожалуйста, введите ваше имя.');
            hasError = true;
        } else if (name.length < 2 || name.length > 15) {
            setError(nameInput, 'Пожалуйста, введите настоящее имя.');
            hasError = true;
        } else if (invalidCharactersPattern.test(name)) {
            setError(nameInput, 'Имя не должно содержать пробелы или точки.');
            hasError = true;
        } else if (!russianOnlyPattern.test(name)) {
            setError(nameInput, 'Имя должно содержать только русские символы.');
            hasError = true;
        } else {
            clearErrors(nameInput);
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const nonEnglishPattern = /[^\x00-\x7F]/;

        if (email === "") {
            setError(emailInput, 'Email не может быть пустым.');
            hasError = true;
        } else if (nonEnglishPattern.test(email)) {
            setError(emailInput, 'Email должен содержать только английские символы.');
            hasError = true;
        } else if (!emailPattern.test(email)) {
            setError(emailInput, 'Введите корректный email.');
            hasError = true;
        } else {
            clearErrors(emailInput);
        }

        if (seminar === "") {
            setError(seminarSelect, 'Выберите семинар.');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const formData = {
            name: name,
            email: email,
            seminar: seminar
        };

        fetch('https://qmedia-five.vercel.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Ваша заявка успешно отправлена и находится в обработке. Ожидайте email с подтверждением бронирования.');
                    clearForm(nameInput, emailInput, seminarSelect);
                } else {
                    alert('Произошла ошибка при отправке заявки.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ошибка при отправке данных.');
            });

    });

    function setError(input, message) {
        input.style.borderColor = 'red';
        input.classList.add('error-placeholder');
        input.placeholder = message;
        input.value = '';
    }

    function clearErrors(...inputs) {
        inputs.forEach(input => {
            input.style.borderColor = '#0d6efd';
            input.placeholder = '';
        });
    }

    function clearForm(...inputs) {
        inputs.forEach(input => {
            input.value = '';
            input.style.borderColor = '';
        });
    }
});
