document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const sortSelect = document.getElementById('sortSelect');
    const container = document.querySelector('.portfolio-items');

    // ========== FILTERING ========== 
    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Remove 'active' class from all filter buttons
            filterButtons.forEach((button) => button.classList.remove('active'));
            // Add 'active' class to the clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Show/hide items
            portfolioItems.forEach((item) => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Check if we need horizontal layout for wedding
            if (filterValue === 'wedding') {
                // Count how many wedding items are visible
                const visibleWeddingItems = Array.from(portfolioItems).filter(
                    (item) =>
                        item.style.display === 'block' &&
                        item.getAttribute('data-category') === 'wedding'
                );
                if (visibleWeddingItems.length > 1) {
                    container.classList.add('horizontal-layout');
                } else {
                    container.classList.remove('horizontal-layout');
                }
            } else {
                container.classList.remove('horizontal-layout');
            }
        });
    });

    // ========== SORTING ========== 
    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value; // 'oldest' or 'newest'
        // Convert NodeList to an array to sort
        const itemsArray = Array.from(portfolioItems);

        itemsArray.sort((a, b) => {
            const dateA = new Date(a.getAttribute('data-date'));
            const dateB = new Date(b.getAttribute('data-date'));

            // If 'oldest', ascending order (earliest date first)
            // If 'newest', descending order (latest date first)
            if (sortValue === 'oldest') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });

        // Re-append sorted items to their parent container
        itemsArray.forEach((item) => {
            container.appendChild(item);
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const galleryContainer = document.getElementById('galleryContainer');

    // Retrieve gallery items from localStorage
    const galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];

    galleryContainer.innerHTML = ''; // Clear previous content

    // Render each gallery item
    galleryItems.forEach(item => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-sm-6 col-md-4 col-lg-3 mb-4';
        colDiv.innerHTML = `
            <div class="card">
                <img src="${item.imageUrl}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text"><small>${item.date}</small></p>
                </div>
            </div>
        `;
        galleryContainer.appendChild(colDiv);
    });
});
