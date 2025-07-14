let nextPage = null;
let prevPage = null;
let currentUrl = '/api/Ad/';

async function loadAds(url = currentUrl) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка при получении объявлений');

        const data = await response.json();
        const ads = data.results;
        nextPage = data.next;
        prevPage = data.previous;
        currentUrl = url;

        const container = document.getElementById('ads-container');
        container.innerHTML = '';

        if (ads.length === 0) {
            container.innerHTML = '<p>Объявления не найдены.</p>';
        } else {
            ads.forEach(ad => {
                const col = document.createElement('div');
                col.className = 'col';

                const imageTag = ad.image_url
                    ? `<img src="${ad.image_url}" class="card-img-top object-fit-cover" alt="Изображение" style="height: 200px;">`
                    : '';

                col.innerHTML = `
                    <a href="/ads/${ad.id}/" class="text-decoration-none text-dark">
                        <div class="card h-100 d-flex flex-column">
                            ${imageTag}
                            <div class="card-body">
                                <h5 class="card-title">${ad.title}</h5>
                                <p class="card-text">${ad.description}</p>
                            </div>
                        </div>
                    </a>
                `;
                container.appendChild(col);
            });
        }

        document.getElementById('prev-btn').disabled = !prevPage;
        document.getElementById('next-btn').disabled = !nextPage;
    } catch (error) {
        console.error('Ошибка загрузки объявлений:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAds();

    document.getElementById('next-btn').addEventListener('click', () => {
        if (nextPage) loadAds(nextPage);
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (prevPage) loadAds(prevPage);
    });

    document.getElementById('filter-form').addEventListener('submit', e => {
        e.preventDefault();

        const search = document.getElementById('search-input')?.value.trim();
        const ordering = document.getElementById('ordering-select')?.value;
        const category = document.getElementById('category-input')?.value.trim();
        const condition = document.getElementById('condition-select')?.value;

        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (ordering) params.append('ordering', ordering);
        if (category) params.append('category', category);
        if (condition) params.append('condition', condition);

        const url = `/api/Ad/?${params.toString()}`;
        loadAds(url);
    });
});
