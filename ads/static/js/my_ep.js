async function fetchAd(adId) {
        const response = await fetch(`/api/Ad/${adId}/`);
        if (!response.ok) throw new Error(`Ошибка при получении объявления ${adId}`);
        return await response.json();
    }

    async function loadProposals() {
        try {
            const response = await fetch('/api/ExchangeProposal/');
            if (!response.ok) throw new Error('Ошибка при получении предложений');

            const proposals = await response.json();
            const container = document.getElementById('ads-container');
            container.innerHTML = '';

            for (const proposal of proposals) {
                const senderAd = await fetchAd(proposal.ad_sender);
                const receiverAd = await fetchAd(proposal.ad_receiver);

                const col = document.createElement('div');
                col.className = 'col';

                const statusClass = {
                    'Принято': 'bg-success',
                    'Ожидает': 'bg-warning text-dark',
                    'Отказано': 'bg-danger'
                }[proposal.status] || 'bg-secondary';

                col.innerHTML = `
                <a href="/exchange/${proposal.id}/" class="text-decoration-none text-dark">
                    <div class="card h-100 p-2">
                        <div class="row g-2 align-items-center">
                            <div class="col-md-6">
                                <h6 class="text-center">Ваше предложение</h6>
                                <div class="card">
                                    ${senderAd.image_url ? `<img src="${senderAd.image_url}" class="card-img-top" style="height: 150px; object-fit: cover;">` : ''}
                                    <div class="card-body">
                                        <h5 class="card-title">${senderAd.title}</h5>
                                        <p class="card-text">${senderAd.description}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-center">В обмен на</h6>
                                <div class="card">
                                    ${receiverAd.image_url ? `<img src="${receiverAd.image_url}" class="card-img-top" style="height: 150px; object-fit: cover;">` : ''}
                                    <div class="card-body">
                                        <h5 class="card-title">${receiverAd.title}</h5>
                                        <p class="card-text">${receiverAd.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p>Комментарий: ${proposal.comment}</p>
                        <div class="mt-3 text-center">
                            <span class="badge ${statusClass}">Статус: ${proposal.status}</span>
                        </div>
                    </div>
                </a>
                `;

                container.appendChild(col);
            }
        } catch (error) {
            console.error('Ошибка загрузки предложений:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', loadProposals);