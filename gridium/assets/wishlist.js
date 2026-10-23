/* Gridium — LocalStorage Wishlist Heart Toggle & Wishlist Page Hydrator */
(() => {
  const KEY = 'gridium_wishlist';

  function getSaved() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (_) {
      return [];
    }
  }

  function setSaved(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
    syncButtons();
  }

  function syncButtons() {
    const saved = getSaved();
    document.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
      const handle = btn.getAttribute('data-wishlist-toggle');
      const active = saved.includes(handle);
      btn.classList.toggle('is-saved', active);
      btn.setAttribute('aria-pressed', String(active));
      btn.setAttribute('aria-label', active
        ? (window.GridiumStrings?.wishlistRemove || 'Remove from wishlist')
        : (window.GridiumStrings?.wishlistAdd || 'Save to wishlist'));
    });
    document.querySelectorAll('[data-wishlist-count]').forEach((el) => {
      el.textContent = saved.length;
    });
  }

  async function renderWishlistPage() {
    const wrap = document.querySelector('[data-wishlist-page]');
    if (!wrap) return;
    const grid = wrap.querySelector('[data-wishlist-grid]');
    const empty = wrap.querySelector('[data-wishlist-empty]');
    const saved = getSaved();

    if (!saved.length) {
      if (grid) grid.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    const products = (await Promise.all(
      saved.map((h) => fetch(`${window.GridiumRoutes.root_url}products/${h}.js`).then((r) => (r.ok ? r.json() : null)).catch(() => null))
    )).filter(Boolean);

    if (!products.length) {
      if (empty) empty.hidden = false;
      return;
    }

    grid.innerHTML = products.map((p) => {
      const price = `$${(p.price / 100).toFixed(2)}`;
      const media = p.featured_image
        ? `<img class="product-card__img" src="${p.featured_image}" alt="${p.title.replace(/"/g, '&quot;')}" width="600" height="750" loading="lazy">`
        : '';
      return `<article class="product-card">
        <div class="product-card__media-wrap">
          <button type="button" class="wishlist-btn is-saved" data-wishlist-toggle="${p.handle}" aria-pressed="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M12 20.5s-7.5-4.6-9.5-9A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9.5 5.5c-2 4.4-9.5 9-9.5 9Z"/></svg>
          </button>
          <a href="${p.url}">${media}</a>
        </div>
        <div class="product-card__info">
          <span class="mono-label">${p.type || 'SHIRT'}</span>
          <a href="${p.url}" class="product-card__title">${p.title}</a>
          <span class="price"><span class="price__regular">${price}</span></span>
        </div>
      </article>`;
    }).join('');
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-wishlist-toggle]');
    if (!btn) return;
    e.preventDefault();
    const handle = btn.getAttribute('data-wishlist-toggle');
    const saved = getSaved();
    const next = saved.includes(handle) ? saved.filter((h) => h !== handle) : [...saved, handle];
    setSaved(next);
    renderWishlistPage();
  });

  syncButtons();
  renderWishlistPage();
  window.GridiumWishlist = { getSaved, syncButtons, renderWishlistPage };
})();
