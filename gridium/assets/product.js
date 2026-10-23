/* Gridium — Product Variant Picker, Gallery, Lightbox, Size Guide, Recommendations & Recently Viewed */
(() => {
  function formatMoney(cents, formatTemplate) {
    const amount = (Number(cents || 0) / 100).toFixed(2);
    const noDecimals = Math.round(Number(cents || 0) / 100).toString();
    const tpl = formatTemplate || '${{amount}}';
    return tpl
      .replace('{{amount_no_decimals}}', noDecimals)
      .replace('{{amount_with_comma_separator}}', amount.replace('.', ','))
      .replace('{{amount}}', amount);
  }

  class ProductInfo extends HTMLElement {
    connectedCallback() {
      const jsonEl = this.querySelector('[data-product-variants]');
      if (!jsonEl) return;
      this.variants = JSON.parse(jsonEl.textContent);
      this.inventoryMap = JSON.parse(this.querySelector('[data-variant-inventory]')?.textContent || '{}');
      this.moneyFormat = this.getAttribute('data-money-format') || '${{amount}}';
      this.updateUrl = this.getAttribute('data-update-url') === 'true';

      this.addEventListener('click', (e) => {
        const optBtn = e.target.closest('[data-option-value]');
        if (optBtn) {
          const group = optBtn.closest('[data-option-position]');
          group.querySelectorAll('[data-option-value]').forEach((b) => {
            b.classList.remove('is-selected');
            b.setAttribute('aria-pressed', 'false');
          });
          optBtn.classList.add('is-selected');
          optBtn.setAttribute('aria-pressed', 'true');
          const labelVal = group.querySelector('[data-selected-option-label]');
          if (labelVal) labelVal.textContent = optBtn.getAttribute('data-option-value');
          this.onOptionChange();
          return;
        }

        const thumb = e.target.closest('[data-media-thumb]');
        if (thumb) {
          this.activateMedia(thumb.getAttribute('data-media-thumb'));
          return;
        }

        const qtyStep = e.target.closest('[data-qty-step]');
        if (qtyStep) {
          const input = this.querySelector('[name="quantity"]');
          if (!input) return;
          const next = Math.max(1, (parseInt(input.value, 10) || 1) + parseInt(qtyStep.getAttribute('data-qty-step'), 10));
          input.value = next;
          return;
        }

        const zoomBtn = e.target.closest('[data-zoom-open]');
        if (zoomBtn) {
          const activeImg = this.querySelector('.pdp-slide.is-active img');
          const modalImg = document.querySelector('[data-zoom-modal-img]');
          if (activeImg && modalImg && window.GridiumUI) {
            modalImg.src = activeImg.currentSrc || activeImg.src;
            modalImg.alt = activeImg.alt || '';
            window.GridiumUI.openOverlay(zoomBtn.getAttribute('data-zoom-open'));
          }
        }
      });

      this.syncOptionAvailability();
      this.setupStickyATC();
      this.recordRecentlyViewed();
    }

    getSelectedOptions() {
      return Array.from(this.querySelectorAll('[data-option-position]')).map((group) => {
        const active = group.querySelector('[data-option-value].is-selected');
        return active ? active.getAttribute('data-option-value') : null;
      });
    }

    onOptionChange() {
      const selected = this.getSelectedOptions();
      const variant = this.variants.find((v) => v.options.every((opt, idx) => opt === selected[idx]));
      this.syncOptionAvailability();
      this.renderVariantState(variant);
    }

    syncOptionAvailability() {
      const selected = this.getSelectedOptions();
      this.querySelectorAll('[data-option-position]').forEach((group, posIdx) => {
        group.querySelectorAll('[data-option-value]').forEach((btn) => {
          const val = btn.getAttribute('data-option-value');
          const probe = [...selected];
          probe[posIdx] = val;
          const match = this.variants.find((v) => v.options.every((opt, i) => opt === probe[i]));
          const available = Boolean(match && match.available);
          btn.classList.toggle('is-unavailable', !available);
        });
      });
    }

    renderVariantState(variant) {
      const idInput = this.querySelector('input[name="id"]');
      const submitBtn = this.querySelector('[data-atc-button]');
      const stickyBtn = document.querySelector('[data-sticky-atc-btn]');
      const priceWrap = this.querySelector('[data-product-price]');
      const skuEl = this.querySelector('[data-product-sku]');
      const stockEl = this.querySelector('[data-stock-status]');

      if (!variant) {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = (window.GridiumStrings && window.GridiumStrings.unavailable) || 'Unavailable';
        }
        return;
      }

      if (idInput) idInput.value = variant.id;
      if (this.updateUrl && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url.toString());
      }

      if (variant.featured_media && variant.featured_media.id) {
        this.activateMedia(String(variant.featured_media.id));
      }

      if (priceWrap) {
        const onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
        let html = `<span class="price ${onSale ? 'price--on-sale' : ''}"><span class="price__regular">${formatMoney(variant.price, this.moneyFormat)}</span>`;
        if (onSale) {
          const pct = Math.round(((variant.compare_at_price - variant.price) / variant.compare_at_price) * 100);
          html += `<s class="price__compare">${formatMoney(variant.compare_at_price, this.moneyFormat)}</s><span class="badge badge--sale">-${pct}%</span>`;
        }
        html += '</span>';
        priceWrap.innerHTML = html;
      }

      if (skuEl) skuEl.textContent = variant.sku || '—';

      if (stockEl) {
        const inv = this.inventoryMap[variant.id];
        const threshold = (window.GridiumSettings && window.GridiumSettings.lowStockThreshold) || 5;
        stockEl.className = 'stock-indicator';
        if (!variant.available) {
          stockEl.classList.add('stock-indicator--out');
          stockEl.innerHTML = `<span class="stock-dot"></span><span>${window.GridiumStrings?.soldOut || 'Sold Out'}</span>`;
        } else if (inv && inv.managed && inv.qty > 0 && inv.qty <= threshold) {
          stockEl.classList.add('stock-indicator--low');
          const msg = (window.GridiumStrings?.lowStock || 'Only {{ count }} left').replace('{{ count }}', inv.qty);
          stockEl.innerHTML = `<span class="stock-dot"></span><span>${msg}</span>`;
        } else {
          stockEl.innerHTML = `<span class="stock-dot"></span><span>${window.GridiumStrings?.inStock || 'In stock'}</span>`;
        }
      }

      const label = variant.available
        ? (window.GridiumStrings?.addToCart || 'Add to Bag')
        : (window.GridiumStrings?.soldOut || 'Sold Out');
      if (submitBtn) {
        submitBtn.disabled = !variant.available;
        submitBtn.textContent = label;
      }
      if (stickyBtn) {
        stickyBtn.disabled = !variant.available;
        stickyBtn.textContent = label;
      }
    }

    activateMedia(mediaId) {
      this.querySelectorAll('[data-media-id]').forEach((slide) => {
        slide.classList.toggle('is-active', slide.getAttribute('data-media-id') === mediaId);
      });
      this.querySelectorAll('[data-media-thumb]').forEach((thumb) => {
        thumb.classList.toggle('is-active', thumb.getAttribute('data-media-thumb') === mediaId);
      });
    }

    setupStickyATC() {
      const bar = document.querySelector('[data-sticky-atc]');
      const form = this.querySelector('[data-ajax-cart-form]');
      if (!bar || !form || !('IntersectionObserver' in window)) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => bar.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0));
      });
      obs.observe(form);
      const stickyBtn = bar.querySelector('[data-sticky-atc-btn]');
      if (stickyBtn) {
        stickyBtn.addEventListener('click', () => {
          const submit = form.querySelector('[type="submit"]');
          if (submit && !submit.disabled) submit.click();
        });
      }
    }

    recordRecentlyViewed() {
      const handle = this.getAttribute('data-product-handle');
      if (!handle) return;
      try {
        const list = JSON.parse(localStorage.getItem('gridium_recently_viewed') || '[]').filter((h) => h !== handle);
        list.unshift(handle);
        localStorage.setItem('gridium_recently_viewed', JSON.stringify(list.slice(0, 8)));
      } catch (_) {}
    }
  }

  if (!customElements.get('product-info')) customElements.define('product-info', ProductInfo);

  // Size Guide Unit Switcher & Fit Finder
  document.addEventListener('click', (e) => {
    const unitBtn = e.target.closest('[data-size-unit]');
    if (unitBtn) {
      const unit = unitBtn.getAttribute('data-size-unit');
      const wrap = unitBtn.closest('[data-size-guide-root]');
      if (!wrap) return;
      wrap.querySelectorAll('[data-size-unit]').forEach((b) => b.classList.toggle('is-active', b === unitBtn));
      wrap.querySelectorAll('[data-cm]').forEach((cell) => {
        const cm = parseFloat(cell.getAttribute('data-cm'));
        if (Number.isNaN(cm)) return;
        cell.textContent = unit === 'in' ? (Math.round((cm / 2.54) * 2) / 2).toString() : cm.toString();
      });
      return;
    }

    const calcBtn = e.target.closest('[data-fit-calculate]');
    if (calcBtn) {
      const root = calcBtn.closest('[data-fit-finder]');
      const h = parseFloat(root.querySelector('[name="fit_height"]')?.value || '178');
      const w = parseFloat(root.querySelector('[name="fit_weight"]')?.value || '74');
      const pref = root.querySelector('[name="fit_pref"]')?.value || 'regular';
      const raw = (window.GridiumSettings && window.GridiumSettings.fitFinderMatrix) || 'XS:170:62\nS:176:70\nM:181:79\nL:186:88\nXL:191:98\nXXL:210:130';
      const rows = raw.split('\n').map((line) => {
        const [size, maxH, maxW] = line.trim().split(':');
        return { size, maxH: parseFloat(maxH), maxW: parseFloat(maxW) };
      }).filter((r) => r.size && !Number.isNaN(r.maxW));
      let idx = rows.findIndex((r) => h <= r.maxH && w <= r.maxW);
      if (idx === -1) idx = rows.length - 1;
      if (pref === 'slim') idx = Math.max(0, idx - 1);
      if (pref === 'relaxed') idx = Math.min(rows.length - 1, idx + 1);
      const out = root.querySelector('[data-fit-result]');
      if (out && rows[idx]) {
        out.hidden = false;
        out.querySelector('strong').textContent = rows[idx].size;
      }
    }
  });

  // Product Recommendations Custom Element
  class ProductRecommendations extends HTMLElement {
    async connectedCallback() {
      const url = this.getAttribute('data-url');
      if (!url) return;
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        const incoming = doc.querySelector('product-recommendations');
        if (incoming && incoming.innerHTML.trim().length) {
          this.innerHTML = incoming.innerHTML;
          if (window.GridiumWishlist) window.GridiumWishlist.syncButtons();
        }
      } catch (_) {}
    }
  }
  if (!customElements.get('product-recommendations')) customElements.define('product-recommendations', ProductRecommendations);

  // Recently Viewed Hydrator
  const recentSection = document.querySelector('[data-recently-viewed]');
  if (recentSection) {
    const current = recentSection.getAttribute('data-exclude-handle');
    const handles = JSON.parse(localStorage.getItem('gridium_recently_viewed') || '[]').filter((h) => h && h !== current).slice(0, 4);
    if (handles.length) {
      Promise.all(handles.map((h) => fetch(`${window.GridiumRoutes.root_url}products/${h}.js`).then((r) => (r.ok ? r.json() : null)).catch(() => null)))
        .then((items) => {
          const valid = items.filter(Boolean);
          if (!valid.length) return;
          recentSection.hidden = false;
          const grid = recentSection.querySelector('[data-recently-grid]');
          grid.innerHTML = valid.map((p) => {
            const img = p.featured_image ? `<img class="product-card__img" src="${p.featured_image}" alt="${p.title.replace(/"/g, '&quot;')}" loading="lazy" width="600" height="750">` : '';
            return `<article class="product-card">
              <a href="${p.url}" class="product-card__media-wrap">${img}</a>
              <div class="product-card__info">
                <span class="mono-label">${p.type || 'SHIRTING'}</span>
                <a href="${p.url}" class="product-card__title">${p.title}</a>
                <span class="price"><span class="price__regular">${formatMoney(p.price)}</span></span>
              </div>
            </article>`;
          }).join('');
        });
    }
  }
})();
