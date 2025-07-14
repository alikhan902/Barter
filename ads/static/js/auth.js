async function fetchJSON(url, method = 'GET', data = null, csrfToken = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    if (csrfToken) {
        options.headers['X-CSRFToken'] = csrfToken;
    }
    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const text = await response.text();

    try {
        const json = JSON.parse(text);
        return { ok: response.ok, data: json };
    } catch {
        return { ok: false, data: text };
    }
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}


function initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true; // Отключаем кнопку

        const data = {
            username: form.username.value,
            password: form.password.value
        };

        const csrfToken = form.querySelector('input[name="csrfmiddlewaretoken"]')?.value;
        const resultDiv = document.getElementById('result');

        const { ok, data: result } = await fetchJSON('/api/login/', 'POST', data, csrfToken);

        if (ok) {
            resultDiv.innerHTML = '<div class="alert alert-success">Успешный вход!</div>';
            setTimeout(() => { window.location.href = '/'; }, 1000);
        } else {
            resultDiv.innerHTML = '<div class="alert alert-danger">Ошибка</div>';
            setTimeout(() => {
                submitBtn.disabled = false; 
            }, 3000);
        }
    });
}

function initRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            username: form.username.value,
            password: form.password.value
        };

        const csrfToken = form.querySelector('input[name="csrfmiddlewaretoken"]')?.value;
        const resultDiv = document.getElementById('result');

        const { ok, data: result } = await fetchJSON('/api/signup/', 'POST', data, csrfToken);

        if (ok) {
            resultDiv.innerHTML = '<div class="alert alert-success">Пользователь зарегистрирован!</div>';
            form.reset();
        } else {
            let messages = '';
            for (const errors of Object.values(result)) {
                messages += `${errors.join(', ')}<br>`;
            }

            resultDiv.innerHTML = `<div class="alert alert-danger">${messages}</div>`;
        }
    });
}



function initLogoutButton() {
    const logoutBtn = document.getElementById('logout-button');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const csrfToken = getCookie('csrftoken');  

        const { ok, data } = await fetchJSON('/api/logout/', 'POST', null, csrfToken);

        if (ok) {
            window.location.href = '/';
        } else {
            alert('Ошибка выхода'(data));
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    initLoginForm();
    initRegisterForm();
    initLogoutButton();
});
