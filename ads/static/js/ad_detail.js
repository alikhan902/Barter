let currentAd = null;

async function loadAdDetail() {
    const pathParts = window.location.pathname.split('/');
    const adId = pathParts[pathParts.length - 2];

    try {
        const response = await fetch(`/api/Ad/${adId}/`);
        if (!response.ok) throw new Error('Объявление не найдено');

        const ad = await response.json();
        currentAd = ad;

        const container = document.getElementById('ad-detail');
        const imageTag = ad.image_url
            ? `<img src="${ad.image_url}" class="img-fluid mb-3" alt="Изображение">`
            : '';

        container.innerHTML = `
            <div class="card">
                ${imageTag}
                <div class="card-body">
                    <h3 class="card-title">${ad.title}</h3>
                    <p class="card-text">${ad.description}</p>
                    <p class="text-muted">Категория: ${ad.category}</p>
                </div>
            </div>
        `;

        loadProposalForm(ad.user);

    } catch (error) {
        document.getElementById('ad-detail').innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
}

async function loadProposalForm(ownerId) {
    const myAdsResponse = await fetch('/api/my_cards/');
    if (!myAdsResponse.ok) return;

    const myAds = await myAdsResponse.json();
    if (myAds.length === 0) return;

    const currentUserId = myAds[0].user;

    if (ownerId === currentUserId) return;

    const formContainer = document.getElementById('proposal-form-container');
    const options = myAds.map(ad =>
        `<option value="${ad.id}">${ad.title}</option>`
    ).join('');

    formContainer.innerHTML = `
        <h4>Сделать предложение обмена</h4>
        <form id="proposal-form">
            <div class="mb-3">
                <label for="my-ad" class="form-label">Выберите ваше объявление:</label>
                <select class="form-select" id="my-ad" required>
                    ${options}
                </select>
            </div>
            <div class="mb-3">
                <label for="comment" class="form-label">Комментарий:</label>
                <textarea class="form-control" id="comment" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Отправить предложение</button>
            <div id="proposal-status" class="mt-3"></div>
        </form>
    `;

    document.getElementById('proposal-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const senderAdId = document.getElementById('my-ad').value;
        const comment = document.getElementById('comment').value;

        const result = await fetch('/api/ExchangeProposal/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                ad_sender: senderAdId,
                ad_receiver: currentAd.id,
                comment: comment
            })
        });

        const statusBox = document.getElementById('proposal-status');
        if (result.ok) {
            statusBox.innerHTML = `<div class="alert alert-success">Предложение отправлено</div>`;
        } else {
            statusBox.innerHTML = `<div class="alert alert-danger">У вас уже есть предложение обмена на этот товар или вы не оставили комментарий</div>`;
        }
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener('DOMContentLoaded', loadAdDetail);
