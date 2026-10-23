/* Gridium — Storefront Filtering, Sort By & Persistent Grid Density Toggle */
(() => {
  const root = document.querySelector('[data-collection-root]');
  if (!root) return;

  const applyDensity = (cols) => {
    const grid = document.querySelector('[data-collection-grid]');
    if (grid) {
      grid.classList.remove('product-grid--2', 'product-grid--3', 'product-grid--4');
      grid.classList.add(`product-grid--${cols}`);
    }
    document.querySelectorAll('[data-density-cols]').forEach((btn) => {
      const active = btn.getAttribute('data-density-cols') === String(cols);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  };

  const savedDensity = localStorage.getItem('gridium_grid_density');
  if (savedDensity) applyDensity(savedDensity);

  async function renderCollectionFromUrl(url) {
    root.style.opacity = '0.55';
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const nextRoot = doc.querySelector('[data-collection-root]');
      if (nextRoot) {
        root.innerHTML = nextRoot.innerHTML;
        window.history.pushState({}, '', url);
        const currentCols = localStorage.getItem('gridium_grid_density');
        if (currentCols) applyDensity(currentCols);
        if (window.GridiumWishlist) window.GridiumWishlist.syncButtons();
      }
    } finally {
      root.style.opacity = '1';
    }
  }

  function submitFiltersForm(form) {
    const params = new URLSearchParams(new FormData(form));
    const sortSelect = document.querySelector('[data-sort-select]');
    if (sortSelect && !params.has('sort_by')) params.set('sort_by', sortSelect.value);
    const url = `${window.location.pathname}?${params.toString()}`;
    renderCollectionFromUrl(url);
  }

  document.addEventListener('change', (e) => {
    const form = e.target.closest('[data-facets-form]');
    if (form) {
      submitFiltersForm(form);
      return;
    }
    const sort = e.target.closest('[data-sort-select]');
    if (sort) {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', sort.value);
      renderCollectionFromUrl(url.toString());
    }
  });

  document.addEventListener('click', (e) => {
    const densityBtn = e.target.closest('[data-density-cols]');
    if (densityBtn) {
      const cols = densityBtn.getAttribute('data-density-cols');
      localStorage.setItem('gridium_grid_density', cols);
      applyDensity(cols);
      return;
    }

    const facetLink = e.target.closest('[data-facet-remove]');
    if (facetLink) {
      e.preventDefault();
      renderCollectionFromUrl(facetLink.getAttribute('href'));
    }
  });
})();
