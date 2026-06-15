(function () {
  function updateSystemClock() {
    const clockEl = document.getElementById('live-sys-clock');
    if (!clockEl) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  }

  function setupProductSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const featuresBlock = document.getElementById('featuresBlock');
    const upcomingProductsBlock = document.getElementById('upcomingProductsBlock');
    const noProductsFoundMessage = document.getElementById('noProductsFound');

    if (!searchForm || !searchInput) return;

    function toggleTopSections(query) {
      if (!featuresBlock || !upcomingProductsBlock) return;
      const visible = query ? 'none' : 'block';
      featuresBlock.style.display = visible;
      upcomingProductsBlock.style.display = visible;
    }

    function filterProducts(query) {
      const productCards = document.querySelectorAll('.product-card');
      let visibleCount = 0;

      productCards.forEach((card) => {
        const titleEl = card.querySelector('h6');
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        const showCard = title.includes(query);

        if (card.parentElement) {
          card.parentElement.style.display = showCard ? '' : 'none';
        }

        if (showCard) visibleCount += 1;
      });

      if (noProductsFoundMessage) {
        noProductsFoundMessage.style.display = query && visibleCount === 0 ? 'block' : 'none';
      }
    }

    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = searchInput.value.toLowerCase().trim();
      filterProducts(query);
      toggleTopSections(query);
    });

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      filterProducts(query);
      toggleTopSections(query);
    });

    const searchParam = new URLSearchParams(window.location.search).get('search');
    if (searchParam) {
      searchInput.value = searchParam;
      const normalizedQuery = searchParam.toLowerCase().trim();
      filterProducts(normalizedQuery);
      toggleTopSections(normalizedQuery);
    }
  }

  function updateCountdowns() {
    document.querySelectorAll('.countdown').forEach((el) => {
      const endDate = new Date(el.dataset.end).getTime();
      const now = Date.now();
      const diff = endDate - now;

      if (diff <= 0) {
        el.innerHTML = '<span class="text-danger fw-bold">Deal ended</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      el.innerHTML = `<i class="bi bi-clock-history text-danger me-1"></i> ${days}d ${hours}h ${minutes}m ${seconds}s`;
    });
  }

  function updateDiscounts() {
    document.querySelectorAll('.discount-badge').forEach((badge) => {
      const newPrice = parseFloat(badge.dataset.new);
      const oldPrice = parseFloat(badge.dataset.old);

      if (!Number.isNaN(newPrice) && !Number.isNaN(oldPrice) && oldPrice > newPrice) {
        const discountPercent = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
        badge.textContent = `-${discountPercent}%`;
      } else {
        badge.style.display = 'none';
      }
    });
  }

  function initNavbar() {
    fetch('assets/include/navbar.html')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((data) => {
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (!navbarPlaceholder) return;

        navbarPlaceholder.innerHTML = data;

        document.querySelectorAll('.navbar .nav-link').forEach((link) => {
          if (link.dataset.page === 'home') {
            link.classList.add('active');
          }
        });

        updateSystemClock();
        window.setInterval(updateSystemClock, 1000);
        setupProductSearch();
      })
      .catch((error) => console.error('Error loading navbar:', error));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    updateCountdowns();
    updateDiscounts();
    window.setInterval(updateCountdowns, 1000);
  });
})();
