async function loadAds() {
    try {
        const response = await fetch('/api/my_cards/');
        if (!response.ok) throw new Error('Ошибка при получении объявлений');

        const ads = await response.json();
        const container = document.getElementById('ads-container');
        container.innerHTML = '';

        ads.forEach(ad => {
            const col = document.createElement('div');
            col.className = 'col';

            const imageTag = ad.image_url
                ? `<img src="${ad.image_url}" class="card-img-top object-fit-cover" alt="Изображение" style="height: 200px;">`
                : '';

            col.innerHTML = `
                <div class="card h-100 d-flex flex-column">
                    <a href="/ads/${ad.id}/" class="text-decoration-none text-dark flex-grow-1">
                        ${imageTag}
                        <div class="card-body">
                            <h5 class="card-title">${ad.title}</h5>
                            <p class="card-text">${ad.description}</p>
                        </div>
                    </a>
                    <button class="btn btn-danger btn-sm mt-2 delete-btn" data-id="${ad.id}">Удалить</button>
                </div>
            `;
            container.appendChild(col);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const csrfToken = getCookie('csrftoken');

                const { ok, data } = await fetchJSON(`/api/Ad/${id}/`, 'DELETE', null, csrfToken);

                window.location.href = window.location.pathname + '?deleted=1';

            });
        });

    } catch (error) {
        console.error('Ошибка загрузки объявлений:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadAds);