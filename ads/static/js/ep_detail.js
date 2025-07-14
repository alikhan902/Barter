async function fetchAd(id) {
        const response = await fetch(`/api/Ad/${id}/`);
        if (!response.ok) throw new Error(`Ошибка при получении объявления ${id}`);
        return await response.json();
    }

    async function loadProposal() {
        const urlParts = window.location.pathname.split('/');
        const proposalId = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];

        try {
            const response = await fetch(`/api/ExchangeProposal/${proposalId}/`);
            if (!response.ok) throw new Error('Ошибка при получении предложения');

            const proposal = await response.json();
            const senderAd = await fetchAd(proposal.ad_sender);
            const receiverAd = await fetchAd(proposal.ad_receiver);

            const container = document.getElementById('proposal-container');

            container.innerHTML = `
                <div class="col-md-6 mb-3">
                    <a href="/ads/${senderAd.id}/" class="text-decoration-none text-dark">
                    <div class="card h-100">
                        ${senderAd.image_url ? `<img src="${senderAd.image_url}" class="card-img-top" style="height: 200px; object-fit: cover;">` : ''}
                        <div class="card-body">
                            <h5 class="card-title">Предлагаемое объявление</h5>
                            <h6>${senderAd.title}</h6>
                            <p>${senderAd.description}</p>
                            <p class="text-muted">Категория: ${senderAd.category}</p>
                        </div>
                    </div>
                    </a>
                </div>
                <div class="col-md-6 mb-3">
                <a href="/ads/${receiverAd.id}/" class="text-decoration-none text-dark">
                    <div class="card h-100">
                        ${receiverAd.image_url ? `<img src="${receiverAd.image_url}" class="card-img-top" style="height: 200px; object-fit: cover;">` : ''}
                        <div class="card-body">
                            <h5 class="card-title">Объявление получателя</h5>
                            <h6>${receiverAd.title}</h6>
                            <p>${receiverAd.description}</p>
                            <p class="text-muted">Категория: ${receiverAd.category}</p>
                        </div>
                    </div>
                    </a>
                </div>
                <div class="col-12">
                    <p><strong>Комментарий:</strong> ${proposal.comment || 'Нет комментария'}</p>
                    <p><strong>Статус:</strong> ${proposal.status}</p>
                    <p><strong>Дата создания:</strong> ${new Date(proposal.created_at).toLocaleString()}</p>
                    <div class="d-flex gap-3 mt-3">
    <button class="btn btn-success" onclick="updateStatus('Принято')">Принять</button>
    <button class="btn btn-danger" onclick="updateStatus('Отказано')">Отказать</button>
</div>
<div id="status-message" class="mt-3"></div>
                </div>
            `;
        } catch (error) {
            console.error('Ошибка загрузки предложения:', error);
        }
    }

    async function updateStatus(newStatus) {
    const urlParts = window.location.pathname.split('/');
    const proposalId = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];

    try {
        const response = await fetch(`/api/ExchangeProposal/${proposalId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Не удалось обновить статус');

        document.getElementById('status-message').innerHTML =
            `<div class="alert alert-success">Статус обновлён на: <strong>${newStatus}</strong></div>`;

        setTimeout(() => location.reload(), 1000);

    } catch (error) {
        document.getElementById('status-message').innerHTML =
            `<div class="alert alert-danger">Ошибка: ${error.message}</div>`;
    }
}


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


    document.addEventListener('DOMContentLoaded', loadProposal);