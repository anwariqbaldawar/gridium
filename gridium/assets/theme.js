/* Gridium v1.0.0 — Core UI, Focus Trap, Header, Modals, Policy TOC & Utilities */
(() => {
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let activeTrapCleanup = null;
  let lastFocusedEl = null;

  function trapFocus(container) {
    if (activeTrapCleanup) activeTrapCleanup();
    lastFocusedEl = document.activeElement;
    const nodes = () => Array.from(container.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const list = nodes();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', onKeyDown);
    const initial = nodes()[0];
    if (initial) setTimeout(() => initial.focus(), 40);
    activeTrapCleanup = () => {
      container.removeEventListener('keydown', onKeyDown);
      if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
      activeTrapCleanup = null;
    };
  }

  function openOverlay(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    trapFocus(el);
  }

  function closeOverlay(el) {
    if (!el) return;
    el.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('[aria-hidden="false"].drawer-backdrop, [aria-hidden="false"].modal-overlay, [aria-hidden="false"].search-overlay')) {
      document.body.style.overflow = '';
    }
    if (activeTrapCleanup) activeTrapCleanup();
  }

  window.GridiumUI = { openOverlay, closeOverlay };

  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-overlay-open]');
    if (openBtn) {
      e.preventDefault();
      openOverlay(openBtn.getAttribute('data-overlay-open'));
      return;
    }
    const closeBtn = e.target.closest('[data-overlay-close]');
    if (closeBtn) {
      e.preventDefault();
      closeOverlay(closeBtn.closest('[aria-hidden]'));
      return;
    }
    if (e.target.matches('.drawer-backdrop, .modal-overlay, .search-overlay')) {
      closeOverlay(e.target);
    }
    const tabBtn = e.target.closest('[data-collection-tab]');
    if (tabBtn) {
      const wrap = tabBtn.closest('[data-tabs-section]');
      if (!wrap) return;
      const target = tabBtn.getAttribute('data-collection-tab');
      wrap.querySelectorAll('[data-collection-tab]').forEach((b) => {
        const active = b === tabBtn;
        b.classList.toggle('button', active);
        b.classList.toggle('button--secondary', !active);
        b.setAttribute('aria-selected', String(active));
      });
      wrap.querySelectorAll('[data-collection-panel]').forEach((p) => {
        p.hidden = p.getAttribute('data-collection-panel') !== target;
      });
    }
    const copyBtn = e.target.closest('[data-copy-url]');
    if (copyBtn && navigator.clipboard) {
      navigator.clipboard.writeText(copyBtn.getAttribute('data-copy-url') || window.location.href).then(() => {
        const label = copyBtn.querySelector('[data-copy-label]');
        if (label) {
          const prev = label.textContent;
          label.textContent = (window.GridiumStrings && window.GridiumStrings.copied) || 'Copied';
          setTimeout(() => { label.textContent = prev; }, 2000);
        }
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('[aria-hidden="false"]').forEach((el) => closeOverlay(el));
    }
  });

  // Sticky Header & Back to Top
  const header = document.querySelector('[data-site-header]');
  const backTop = document.querySelector('[data-back-to-top]');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (backTop) backTop.classList.toggle('is-visible', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Rotating Announcement Bar
  document.querySelectorAll('[data-announcement-rotator]').forEach((bar) => {
    const slides = bar.querySelectorAll('.announcement-bar__slide');
    if (slides.length <= 1) return;
    let idx = 0;
    const speed = ( parseInt(bar.getAttribute('data-speed'), 10) || 5 ) * 1000;
    setInterval(() => {
      slides[idx].classList.remove('is-active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('is-active');
    }, speed);
  });

  // Scroll Reveal Observer
  if ('IntersectionObserver' in window && document.body.classList.contains('has-motion')) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  }

  // Localization Selectors Auto-Submit
  document.querySelectorAll('[data-localization-form] select').forEach((sel) => {
    sel.addEventListener('change', () => sel.closest('form').submit());
  });

  // Auto-Built Policy Sticky Table of Contents
  const policyBody = document.querySelector('[data-policy-content]');
  const policyToc = document.querySelector('[data-policy-toc]');
  if (policyBody && policyToc) {
    const headings = policyBody.querySelectorAll('h2, h3');
    if (!headings.length) {
      const wrap = policyToc.closest('.policy-toc');
      if (wrap) wrap.hidden = true;
    } else {
      headings.forEach((h, index) => {
        if (!h.id) h.id = `section-${index + 1}-${h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${h.id}`;
        a.className = 'policy-toc__link';
        a.textContent = h.textContent;
        li.appendChild(a);
        policyToc.appendChild(li);
      });
    }
  }

  // Cookie Notice & Delayed Newsletter Popup
  const cookieBar = document.querySelector('[data-cookie-banner]');
  if (cookieBar && !localStorage.getItem('gridium_cookie_consent')) {
    cookieBar.hidden = false;
    cookieBar.querySelectorAll('[data-cookie-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        localStorage.setItem('gridium_cookie_consent', btn.getAttribute('data-cookie-action'));
        cookieBar.hidden = true;
      });
    });
  }

  const newsModal = document.getElementById('NewsletterPopupModal');
  if (newsModal && !localStorage.getItem('gridium_newsletter_dismissed')) {
    const delay = (parseInt(newsModal.getAttribute('data-delay'), 10) || 8) * 1000;
    setTimeout(() => {
      openOverlay('NewsletterPopupModal');
      localStorage.setItem('gridium_newsletter_dismissed', '1');
    }, delay);
  }
})();

/* Gridium v1.1 — Motion & layout refinements */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Measure the live header so sticky offsets and anchors stay accurate */
  const header = document.querySelector('[data-site-header]');
  const syncHeaderHeight = () => {
    if (!header) return;
    document.documentElement.style.setProperty('--header-height', `${Math.round(header.getBoundingClientRect().height)}px`);
  };
  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight, { passive: true });
  header?.addEventListener('transitionend', syncHeaderHeight);

  /* Reading progress */
  const progress = document.querySelector('[data-scroll-progress] .scroll-progress__fill');
  if (progress) {
    let frame = null;
    const paint = () => {
      frame = null;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };
    const schedule = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(paint);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    paint();
  }

  /* Reveal observer: elements, image reveals and staggered children */
  if ('IntersectionObserver' in window && document.body.classList.contains('has-motion')) {
    const targets = document.querySelectorAll('[data-reveal]:not(.is-visible), [data-reveal-media]:not(.is-visible)');
    if (targets.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
      );
      targets.forEach((el) => io.observe(el));
    }
  }

  /* Badge bump whenever the cart or wishlist count changes */
  const bump = (el) => {
    const value = (el.textContent || '').trim();
    el.dataset.count = value;
    el.classList.remove('is-bumped');
    void el.offsetWidth;
    el.classList.add('is-bumped');
    window.setTimeout(() => el.classList.remove('is-bumped'), 620);
  };
  const watchCounts = () => {
    document.querySelectorAll('[data-cart-count], [data-wishlist-count]').forEach((el) => {
      bump(el);
      new MutationObserver(() => bump(el)).observe(el, { childList: true, characterData: true, subtree: true });
    });
  };
  watchCounts();

  /* Subtle parallax on flagged media (opt-in via data-parallax) */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduceMotion) {
    let ticking = false;
    const update = () => {
      ticking = false;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* Close <details> siblings in the craft accordion for a cleaner read */
  document.querySelectorAll('.about-step').forEach((step) => {
    step.addEventListener('toggle', () => {
      if (!step.open) return;
      step.closest('.about-craft__steps')
        ?.querySelectorAll('.about-step[open]')
        .forEach((other) => {
          if (other !== step) other.open = false;
        });
    });
  });

  /* Smooth in-page anchors that respect the sticky header */
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    const offset = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 72) + 20;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
    history.replaceState(null, '', id);
  });
})();
