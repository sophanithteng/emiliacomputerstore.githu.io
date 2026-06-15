(function () {
  function getActivePageCategory(pathname) {
    const path = pathname.split('/').pop() || '';

    if (path === '' || path === 'index.html') return 'home';
    if (path.startsWith('rog_')) return 'rog';
    if (path.startsWith('msi_') || path.startsWith('vector_') || path.startsWith('raider_')) return 'msi';
    if (path.startsWith('asus_') || path.startsWith('dell_') || path.startsWith('nb_dell_')) return 'asus';

    return null;
  }

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

  function initNavbar() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) return;

    const navbarPath = window.location.pathname.includes('/page/')
      ? '../assets/include/navbar.html'
      : 'assets/include/navbar.html';

    fetch(navbarPath)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((data) => {
        navbarPlaceholder.innerHTML = data;

        const activeCategory = getActivePageCategory(window.location.pathname);
        document.querySelectorAll('.navbar .nav-link').forEach((link) => {
          link.classList.remove('active');

          const linkHref = link.getAttribute('href') || '';
          if (activeCategory && link.dataset.page === activeCategory) {
            link.classList.add('active');
          } else if (linkHref && window.location.pathname.endsWith(linkHref)) {
            link.classList.add('active');
          }
        });

        updateSystemClock();
        window.setInterval(updateSystemClock, 1000);
      })
      .catch((error) => console.error('Error loading navbar:', error));
  }

  function initGallery() {
    const mainImg = document.getElementById('mainImg');
    const thumbs = document.querySelectorAll('.thumb');

    if (!mainImg || thumbs.length === 0) return;

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach((item) => item.classList.remove('active'));
        thumb.classList.add('active');

        const src = thumb.getAttribute('src');
        if (src) {
          mainImg.src = src;
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initGallery();
  });
})();
