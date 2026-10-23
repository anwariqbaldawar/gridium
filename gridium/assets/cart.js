/* Gridium — AJAX Cart Drawer, Section Rendering API, Quantity & Order Notes */
(() => {
  async function refreshCartUI() {
    try {
      const [drawerRes, cartRes] = await Promise.all([
        fetch(`${window.GridiumRoutes.root_url}?section_id=cart-drawer`),
        fetch(`${window.GridiumRoutes.cart_url}.js`)
      ]);
      const cartData = await cartRes.json();
      document.querySelectorAll('[data-cart-count]').forEach((el) => {
        el.textContent = cartData.item_count;
      });
      if (drawerRes.ok) {
        const html = await drawerRes.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const nextInner = doc.querySelector('[data-cart-drawer-inner]');
        const currInner = document.querySelector('[data-cart-drawer-inner]');
        if (nextInner && currInner) currInner.innerHTML = nextInner.innerHTML;
      }
      if (document.querySelector('[data-main-cart-section]')) {
        const pageRes = await fetch(window.location.href);
        if (pageRes.ok) {
          const doc = new DOMParser().parseFromString(await pageRes.text(), 'text/html');
          const nextMain = doc.querySelector('[data-main-cart-section]');
          const currMain = document.querySelector('[data-main-cart-section]');
          if (nextMain && currMain) currMain.innerHTML = nextMain.innerHTML;
        }
      }
      return cartData;
    } catch (err) {
      console.error('Cart refresh error:', err);
      return null;
    }
  }

  async function addVariantToCart(id, quantity = 1, properties = {}) {
    const res = await fetch(`${window.GridiumRoutes.cart_add_url}.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: Number(id), quantity: Number(quantity), properties })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.description || (window.GridiumStrings && window.GridiumStrings.cartError) || 'Unable to add');
    }
    await refreshCartUI();
    if (window.GridiumSettings && window.GridiumSettings.cartType === 'drawer' && window.GridiumUI) {
      window.GridiumUI.openOverlay('CartDrawer');
    } else {
      window.location.href = window.GridiumRoutes.cart_url;
    }
  }

  async function changeLineQuantity(line, quantity) {
    const res = await fetch(`${window.GridiumRoutes.cart_change_url}.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: Number(line), quantity: Number(quantity) })
    });
    if (res.ok) await refreshCartUI();
  }

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-ajax-cart-form]');
    if (!form) return;
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const errEl = form.querySelector('[data-form-error]');
    if (errEl) errEl.hidden = true;
    if (btn) btn.disabled = true;
    try {
      const fd = new FormData(form);
      await addVariantToCart(fd.get('id'), fd.get('quantity') || 1);
    } catch (err) {
      if (errEl) {
        errEl.textContent = err.message;
        errEl.hidden = false;
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  document.addEventListener('click', async (e) => {
    const quickBtn = e.target.closest('[data-quick-add-variant]');
    if (quickBtn) {
      e.preventDefault();
      quickBtn.disabled = true;
      try {
        await addVariantToCart(quickBtn.getAttribute('data-quick-add-variant'), 1);
      } finally {
        quickBtn.disabled = false;
      }
      return;
    }

    const qtyBtn = e.target.closest('[data-cart-qty-btn]');
    if (qtyBtn) {
      e.preventDefault();
      const line = qtyBtn.getAttribute('data-line');
      const qty = Number(qtyBtn.getAttribute('data-qty'));
      await changeLineQuantity(line, Math.max(0, qty));
      return;
    }

    const remBtn = e.target.closest('[data-cart-remove]');
    if (remBtn) {
      e.preventDefault();
      await changeLineQuantity(remBtn.getAttribute('data-line'), 0);
    }
  });

  document.addEventListener('change', async (e) => {
    const noteEl = e.target.closest('[data-cart-note]');
    if (noteEl) {
      await fetch(`${window.GridiumRoutes.cart_update_url}.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteEl.value })
      });
    }
  });

  window.GridiumCart = { addVariantToCart, changeLineQuantity, refreshCartUI };
})();
