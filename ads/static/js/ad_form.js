// ad_form.js

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function initAdForm() {
    const form = document.getElementById('ad-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const csrfToken = getCookie('csrftoken');

        const response = await fetch('/api/Ad/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            body: formData
        });

        const resultDiv = document.getElementById('result');

        if (response.ok) {
            resultDiv.innerHTML = '<div class="alert alert-success">Объявление создано!</div>';
            form.reset();
        } else {
            const errorText = await response.text();
            resultDiv.innerHTML = '<div class="alert alert-danger">Ошибка: ' + errorText + '</div>';
        }
    });
}

document.addEventListener('DOMContentLoaded', initAdForm);
