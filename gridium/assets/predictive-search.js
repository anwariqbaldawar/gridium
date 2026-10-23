/* Gridium — Predictive Search Custom Element with Keyboard Navigation */
(() => {
  class PredictiveSearch extends HTMLElement {
    connectedCallback() {
      this.input = this.querySelector('input[type="search"]');
      this.results = this.querySelector('[data-predictive-results]');
      this.clearBtn = this.querySelector('[data-search-clear]');
      this.cache = new Map();
      this.timer = null;
      this.activeIndex = -1;

      if (!this.input || !this.results) return;

      this.input.addEventListener('input', () => {
        const q = this.input.value.trim();
        if (this.clearBtn) this.clearBtn.hidden = !q.length;
        clearTimeout(this.timer);
        if (q.length < 2) {
          this.results.innerHTML = '';
          return;
        }
        this.timer = setTimeout(() => this.fetchSuggestions(q), 220);
      });

      this.input.addEventListener('keydown', (e) => this.onKeyDown(e));

      if (this.clearBtn) {
        this.clearBtn.addEventListener('click', () => {
          this.input.value = '';
          this.clearBtn.hidden = true;
          this.results.innerHTML = '';
          this.input.focus();
        });
      }
    }

    async fetchSuggestions(query) {
      if (this.cache.has(query)) {
        this.renderMarkup(this.cache.get(query));
        return;
      }
      try {
        const url = `${window.GridiumRoutes.predictive_search_url}?q=${encodeURIComponent(query)}&resources[type]=product,collection,query&resources[limit]=4&section_id=predictive-search`;
        const res = await fetch(url);
        if (!res.ok) return;
        const html = await res.text();
        this.cache.set(query, html);
        this.renderMarkup(html);
      } catch (_) {}
    }

    renderMarkup(html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const inner = doc.querySelector('#shopify-section-predictive-search');
      this.results.innerHTML = inner ? inner.innerHTML : html;
      this.activeIndex = -1;
    }

    onKeyDown(e) {
      const items = Array.from(this.results.querySelectorAll('[data-predictive-item]'));
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.activeIndex = (this.activeIndex + 1) % items.length;
        this.highlight(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.activeIndex = (this.activeIndex - 1 + items.length) % items.length;
        this.highlight(items);
      } else if (e.key === 'Enter' && this.activeIndex >= 0 && items[this.activeIndex]) {
        e.preventDefault();
        items[this.activeIndex].click();
      }
    }

    highlight(items) {
      items.forEach((el, idx) => el.setAttribute('aria-selected', String(idx === this.activeIndex)));
      if (items[this.activeIndex]) items[this.activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  if (!customElements.get('predictive-search')) customElements.define('predictive-search', PredictiveSearch);
})();
