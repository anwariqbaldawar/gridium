import React, { useEffect, useMemo, useState } from 'react';
import {
  COLLECTIONS,
  CURRENCIES,
  FitType,
  formatPrice,
  ShirtProduct,
  ShirtSize,
  SHIRTS,
  STUDIO_MEDIA,
} from './data/shirts';
import {
  CartDrawer,
  CartLineItem,
  Icon,
  PredictiveSearchModal,
  ProductCard,
  SizeGuideModal,
} from './components/StoreComponents';
import { ThemeStudioModal } from './components/ThemeStudioModal';

type SchemeName = 'paper' | 'stone' | 'midnight';

const ALL_SIZES: ShirtSize[] = ['S', 'M', 'L', 'XL'];
const ALL_FITS: FitType[] = ['Slim', 'Regular', 'Relaxed', 'Oversized'];

export function App() {
  // Navigation state: 'home' | 'collection:<handle>' | 'collections' | 'product:<handle>' | 'about' | 'contact' | 'privacy' | 'refund' | 'wishlist' | 'cart' | 'account'
  const [route, setRoute] = useState<string>('home');
  const [pdpInitialColor, setPdpInitialColor] = useState<string | undefined>(undefined);
  const [globalScheme, setGlobalScheme] = useState<SchemeName>('paper');
  const [country, setCountry] = useState<string>('US');
  const [language, setLanguage] = useState<string>('en');

  // Overlays
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  // Header & Announcement state
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Persistent Wishlist & Recently Viewed & Cart
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('gridium_wishlist') || '["mercer-two-ply-oxford-shirt"]');
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('gridium_recently_viewed') || '[]');
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartLineItem[]>(() => [
    {
      key: 'mercer-two-ply-oxford-shirt:Optic White:M',
      product: SHIRTS[0],
      colorName: 'Optic White',
      size: 'M',
      quantity: 1,
    },
  ]);
  const [orderNote, setOrderNote] = useState('');

  // Homepage tab state & newsletter state
  const [homeTab, setHomeTab] = useState<'all' | 'woven' | 'tees'>('all');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Collection filter & sort state
  const [selectedSizes, setSelectedSizes] = useState<ShirtSize[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<FitType[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Contact form state
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    localStorage.setItem('gridium_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const id = setInterval(() => setAnnouncementIdx((i) => (i + 1) % 2), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setSizeGuideOpen(false);
        setStudioOpen(false);
        setMobileFilterOpen(false);
        setZoomImageUrl(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navigate = (nextRoute: string, colorHint?: string) => {
    setPdpInitialColor(colorHint);
    setRoute(nextRoute);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (nextRoute.startsWith('product:')) {
      const handle = nextRoute.replace('product:', '');
      setRecentlyViewed((prev) => {
        const updated = [handle, ...prev.filter((h) => h !== handle)].slice(0, 6);
        localStorage.setItem('gridium_recently_viewed', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const toggleWishlist = (handle: string) => {
    setWishlist((prev) => (prev.includes(handle) ? prev.filter((h) => h !== handle) : [...prev, handle]));
  };

  const addToCart = (product: ShirtProduct, colorName: string, size: ShirtSize, qty = 1) => {
    const key = `${product.handle}:${colorName}:${size}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...prev, { key, product, colorName, size, quantity: qty }];
    });
    setCartOpen(true);
  };

  const updateCartQty = (key: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.key !== key));
    } else {
      setCart((prev) => prev.map((i) => (i.key === key ? { ...i, quantity: qty } : i)));
    }
  };

  const totalBagCount = cart.reduce((s, i) => s + i.quantity, 0);

  // Derived data for Collection view
  const allUniqueColors = useMemo(() => {
    const map = new Map<string, string>();
    SHIRTS.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
    return Array.from(map.entries());
  }, []);

  const allUniqueFabrics = useMemo(() => Array.from(new Set(SHIRTS.map((p) => p.fabric))), []);

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedFits([]);
    setSelectedFabrics([]);
    setInStockOnly(false);
    setMaxPrice(200);
  };

  const activeFilterCount =
    selectedSizes.length +
    selectedColors.length +
    selectedFits.length +
    selectedFabrics.length +
    (inStockOnly ? 1 : 0) +
    (maxPrice < 200 ? 1 : 0);

  return (
    <div className={`color-${globalScheme}`} style={{ minHeight: '100vh' }}>
      <a className="skip-to-content-link button" href="#MainContent">
        Skip to main content
      </a>

      {/* Developer / Theme Studio Bar */}
      <div className="studio-dev-bar">
        <div className="container studio-dev-bar__inner">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            <span>GRIDIUM v1.0.0 · ONLINE STORE 2.0 SHOPIFY THEME</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span style={{ opacity: 0.8 }}>SCHEME:</span>
            {(['paper', 'stone', 'midnight'] as SchemeName[]).map((sc) => (
              <button
                key={sc}
                type="button"
                className={`studio-pill-btn${globalScheme === sc ? ' is-active' : ''}`}
                onClick={() => setGlobalScheme(sc)}
              >
                {sc}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <button type="button" className="studio-pill-btn is-active" onClick={() => setStudioOpen(true)}>
              Inspect 91 Theme Files &amp; Download .ZIP
            </button>
          </div>
        </div>
      </div>

      {/* Rotating Announcement Bar */}
      <div className="announcement-bar color-midnight">
        <div className="container announcement-bar__inner">
          {announcementIdx === 0 ? (
            <span className="mono-label" style={{ color: 'inherit' }}>
              COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER {formatPrice(150, country)} — EASY 30-DAY EXCHANGES
            </span>
          ) : (
            <button
              type="button"
              className="mono-label link-underline"
              style={{ color: 'inherit', background: 'none', border: 0, cursor: 'pointer' }}
              onClick={() => navigate('collection:all')}
            >
              SEASON 04 SHIRTING: PORTUGUESE TWO-PLY POPLIN &amp; BELGIAN FLAX LINEN NOW LIVE
            </button>
          )}
        </div>
      </div>

      {/* Sticky Architectural Header + Mega Menu */}
      <div className="site-header-wrapper">
        <header className={`site-header color-${globalScheme}${scrolled ? ' is-scrolled' : ''}`}>
          <div className="container site-header__bar">
            <div className="site-header__mobile-trigger">
              <button
                type="button"
                className="icon-btn"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <Icon name="menu" size={22} />
              </button>
            </div>

            <a
              href="#home"
              className="site-header__logo"
              onClick={(e) => {
                e.preventDefault();
                navigate('home');
              }}
            >
              GRIDIUM
            </a>

            <nav className="site-header__nav" aria-label="Primary">
              <div className="nav-item--has-mega">
                <a
                  href="#collection/all"
                  className="site-header__link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('collection:all');
                  }}
                >
                  <span>Shirts</span>
                  <Icon name="chevron-down" size={14} />
                </a>

                <div className="mega-menu">
                  <div className="container mega-menu__grid">
                    <div className="mega-menu__links">
                      <div>
                        <span className="mono-label mega-menu__col-title" style={{ color: 'var(--color-text)' }}>
                          01 / BY CATEGORY
                        </span>
                        <ul className="mega-menu__sublist">
                          <li>
                            <a href="#all" className="link-underline" onClick={(e) => { e.preventDefault(); navigate('collection:all'); }}>
                              All Products ({SHIRTS.length})
                            </a>
                          </li>
                          {COLLECTIONS.map((col) => (
                            <li key={col.handle}>
                              <a
                                href={`#${col.handle}`}
                                className="link-underline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`collection:${col.handle}`);
                                }}
                              >
                                {col.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="mono-label mega-menu__col-title" style={{ color: 'var(--color-text)' }}>
                          02 / BY FIT BLOCK
                        </span>
                        <ul className="mega-menu__sublist">
                          {ALL_FITS.map((fit) => (
                            <li key={fit}>
                              <a
                                href={`#fit-${fit}`}
                                className="link-underline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  clearAllFilters();
                                  setSelectedFits([fit]);
                                  navigate('collection:all');
                                }}
                              >
                                {fit} Fit
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="mono-label mega-menu__col-title" style={{ color: 'var(--color-text)' }}>
                          03 / STUDIO TOOLS
                        </span>
                        <ul className="mega-menu__sublist">
                          <li>
                            <button
                              type="button"
                              className="link-underline"
                              style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
                              onClick={() => setSizeGuideOpen(true)}
                            >
                              Size Guide &amp; Fit Finder
                            </button>
                          </li>
                          <li>
                            <a href="#collections" className="link-underline" onClick={(e) => { e.preventDefault(); navigate('collections'); }}>
                              Collection Directory
                            </a>
                          </li>
                          <li>
                            <a href="#wishlist" className="link-underline" onClick={(e) => { e.preventDefault(); navigate('wishlist'); }}>
                              Saved Shortlist ({wishlist.length})
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mega-menu__promo">
                      <div className="mega-menu__promo-media">
                        <img src={STUDIO_MEDIA.rackMinimal} alt="Season 04 Mill Edition" width={400} height={250} />
                      </div>
                      <span className="mono-label">01 / SEASONAL MILL EDITION</span>
                      <p className="h4">240 GSM Supima &amp; Two-Ply Poplin</p>
                      <a
                        href="#all"
                        className="mono-label link-underline"
                        style={{ color: 'var(--color-text)', width: 'fit-content' }}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('collection:all');
                        }}
                      >
                        Shop All Shirts →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#collection/all"
                className="site-header__link"
                onClick={(e) => {
                  e.preventDefault();
                  clearAllFilters();
                  navigate('collection:all');
                }}
              >
                All Products
              </a>
              <a
                href="#collections"
                className="site-header__link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('collections');
                }}
              >
                Collections
              </a>
              <a
                href="#about"
                className="site-header__link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('about');
                }}
              >
                About Us
              </a>
              <a
                href="#contact"
                className="site-header__link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('contact');
                }}
              >
                Contact
              </a>
            </nav>

            <div className="site-header__actions">
              <button type="button" className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Open search">
                <Icon name="search" size={20} />
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => navigate('wishlist')}
                aria-label="Saved shirts"
              >
                <Icon name="heart" size={20} />
                <span className="header-count-badge">{wishlist.length}</span>
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => navigate('account')}
                aria-label="Client Account"
              >
                <Icon name="user" size={20} />
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setCartOpen(true)}
                aria-label="Open shopping bag"
              >
                <Icon name="bag" size={20} />
                <span className="header-count-badge">{totalBagCount}</span>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Menu Slide-out Drawer */}
      <div
        className="drawer-backdrop"
        aria-hidden={mobileMenuOpen ? 'false' : 'true'}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        onClick={(e) => {
          if (e.target === e.currentTarget) setMobileMenuOpen(false);
        }}
      >
        <div className="drawer-panel drawer-panel--left">
          <div className="drawer-header">
            <span className="mono-label">MENU</span>
            <button type="button" className="icon-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close">
              <Icon name="close" size={20} />
            </button>
          </div>
          <div className="drawer-body">
            <ul>
              {[
                { label: 'Home', to: 'home' },
                { label: 'All Products', to: 'collection:all' },
                { label: 'Collections Directory', to: 'collections' },
                { label: 'About Us', to: 'about' },
                { label: 'Contact Studio', to: 'contact' },
                { label: 'Privacy Policy', to: 'privacy' },
                { label: 'Refund Policy', to: 'refund' },
                { label: `Saved Shirts (${wishlist.length})`, to: 'wishlist' },
              ].map((item) => (
                <li key={item.to} className="mobile-nav__item">
                  <a
                    href={`#${item.to}`}
                    className="mobile-nav__link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.to);
                    }}
                  >
                    <span>{item.label}</span>
                    <Icon name="arrow-right" size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT ROUTER */}
      <main id="MainContent" className="main-content" role="main" tabIndex={-1}>
        {/* 1. HOMEPAGE */}
        {route === 'home' && (
          <>
            {/* Hero */}
            <section className="hero color-midnight" style={{ '--hero-overlay': 0.36 } as React.CSSProperties}>
              <div className="hero__media">
                <img
                  src={STUDIO_MEDIA.heroRack}
                  alt="Gridium architectural shirting rack"
                  fetchPriority="high"
                  width={1800}
                  height={1000}
                />
                <div className="hero__scrim" />
              </div>
              <div className="container hero__content">
                <div className="hero__grid">
                  <div>
                    <p className="mono-label" style={{ color: '#FAFAF8', opacity: 0.85, marginBottom: 16 }}>
                      01 / SEASON 04 SHIRTING ARCHIVE
                    </p>
                    <h1 className="display-xl" style={{ color: '#FAFAF8' }}>
                      Engineered Shirting. Exact Proportions.
                    </h1>
                  </div>
                  <div style={{ color: '#FAFAF8' }}>
                    <p style={{ fontSize: '1.0625rem', lineHeight: 1.55, opacity: 0.9 }}>
                      Single-needle Portuguese poplin, 240 GSM Supima jersey tees, and breathable Belgian flax linen built for calm daily uniforming.
                    </p>
                    <div className="hero__actions">
                      <button type="button" className="button" onClick={() => navigate('collection:all')}>
                        Shop All Shirts
                      </button>
                      <button
                        type="button"
                        className="button button--secondary"
                        style={{ color: '#FAFAF8', borderColor: 'rgba(250,250,248,0.55)' }}
                        onClick={() => navigate('about')}
                      >
                        Our Craft
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Asymmetric Category Tiles */}
            <section className="section-pad section-border-bottom">
              <div className="container">
                <div className="section-header">
                  <div className="section-header__titles">
                    <span className="mono-label">02 / SILHOUETTES</span>
                    <h2>Shop by Category</h2>
                  </div>
                  <a
                    href="#collections"
                    className="mono-label link-underline"
                    style={{ color: 'var(--color-text)' }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('collections');
                    }}
                  >
                    View All Collections
                  </a>
                </div>

                <div className="category-tiles-grid">
                  {COLLECTIONS.map((col) => (
                    <a
                      key={col.handle}
                      href={`#collection/${col.handle}`}
                      className={`category-tile category-tile--${col.layoutSpan}`}
                      onClick={(e) => {
                        e.preventDefault();
                        clearAllFilters();
                        navigate(`collection:${col.handle}`);
                      }}
                    >
                      <div className="category-tile__media">
                        <img src={col.image} alt={col.title} width={900} height={675} loading="lazy" />
                      </div>
                      <div className="category-tile__meta">
                        <div>
                          <span className="mono-label">{col.code}</span>
                          <h3 className="h4" style={{ marginTop: 4 }}>{col.title}</h3>
                        </div>
                        <Icon name="arrow-right" size={18} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Collection with Tabs */}
            <section className="section-pad section-border-bottom">
              <div className="container">
                <div className="section-header">
                  <div className="section-header__titles">
                    <span className="mono-label">03 / NEW ARRIVALS</span>
                    <h2>Seasonal Shirting</h2>
                  </div>
                  <div role="tablist" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {[
                      { id: 'all', label: 'All Arrivals' },
                      { id: 'woven', label: 'Woven Shirts' },
                      { id: 'tees', label: 'Tees & Polos' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={homeTab === t.id}
                        className={`button button--sm${homeTab === t.id ? '' : ' button--secondary'}`}
                        onClick={() => setHomeTab(t.id as 'all' | 'woven' | 'tees')}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="product-grid product-grid--4">
                  {SHIRTS.filter((p) => {
                    if (homeTab === 'woven') return ['Casual Shirt', 'Linen Shirt', 'Formal Shirt'].includes(p.type);
                    if (homeTab === 'tees') return ['T-Shirt', 'Graphic Tee', 'Polo'].includes(p.type);
                    return true;
                  })
                    .slice(0, 4)
                    .map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        country={country}
                        isSaved={wishlist.includes(p.handle)}
                        onToggleWishlist={toggleWishlist}
                        onQuickAdd={(prod, cName, sz) => addToCart(prod, cName, sz, 1)}
                        onOpenProduct={(h, c) => navigate(`product:${h}`, c)}
                      />
                    ))}
                </div>
              </div>
            </section>

            {/* Editorial 5/7 Split */}
            <section className={`section-pad section-border-bottom ${globalScheme === 'midnight' ? 'color-midnight' : 'color-stone'}`}>
              <div className="container">
                <div className="grid-12 split-5-7">
                  <div className="editorial-media">
                    <img src={STUDIO_MEDIA.atelierPatterns} alt="Gridium pattern drafting atelier" width={800} height={1000} loading="lazy" />
                  </div>
                  <div className="editorial-copy">
                    <span className="mono-label">04 / MILL SPECIFICATION</span>
                    <h2>22 Stitches Per Inch. Zero Excess.</h2>
                    <p className="text-muted">
                      Every Gridium shirt begins at family-owned European mills. We specify long-staple organic yarns, unfused soft collars that mold naturally over wear, and genuine 3.2mm mother-of-pearl shanks cross-stitched for permanence.
                    </p>
                    <p
                      className="mono-label"
                      style={{ paddingTop: 14, borderTop: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                    >
                      MILLS: SOMELOS (PT) · LIBECO (BE) · ALBINI (IT)
                    </p>
                    <div style={{ marginTop: 8 }}>
                      <button type="button" className="button button--secondary" onClick={() => navigate('about')}>
                        Read Our Craft
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Numbered USP Row 01–04 */}
            <section className="section-pad-sm section-border-bottom">
              <div className="container">
                <div className="usp-grid">
                  {[
                    {
                      code: '01 / TEXTILE',
                      icon: 'shirt',
                      title: 'Mill-Certified Fabrics',
                      text: 'Two-ply organic poplin, 240 GSM Supima jersey, and breathable European flax.',
                    },
                    {
                      code: '02 / EXCHANGE',
                      icon: 'return',
                      title: '30-Day Effortless Returns',
                      text: 'Complimentary size exchanges and prepaid return labels on unworn garments.',
                    },
                    {
                      code: '03 / DISPATCH',
                      icon: 'truck',
                      title: '24-Hour Tracked Dispatch',
                      text: 'Orders placed before 2 PM ship same-day in plastic-free archival packaging.',
                    },
                    {
                      code: '04 / CHECKOUT',
                      icon: 'shield',
                      title: 'Encrypted Global Payment',
                      text: 'PCI-DSS Level 1 security with Shop Pay, Apple Pay, and multi-currency duties.',
                    },
                  ].map((u) => (
                    <div key={u.code} className="usp-card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="mono-label">{u.code}</span>
                        <Icon name={u.icon} size={20} />
                      </div>
                      <h3 className="h4">{u.title}</h3>
                      <p className="text-muted" style={{ fontSize: '0.875rem' }}>{u.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bestsellers */}
            <section className="section-pad section-border-bottom">
              <div className="container">
                <div className="section-header">
                  <div className="section-header__titles">
                    <span className="mono-label">05 / PERMANENT COLLECTION</span>
                    <h2>Studio Bestsellers</h2>
                  </div>
                  <a
                    href="#all"
                    className="mono-label link-underline"
                    style={{ color: 'var(--color-text)' }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('collection:all');
                    }}
                  >
                    Shop All {SHIRTS.length} Styles
                  </a>
                </div>
                <div className="product-grid product-grid--4">
                  {SHIRTS.filter((s) => s.isBestseller)
                    .slice(0, 4)
                    .map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        country={country}
                        isSaved={wishlist.includes(p.handle)}
                        onToggleWishlist={toggleWishlist}
                        onQuickAdd={(prod, cName, sz) => addToCart(prod, cName, sz, 1)}
                        onOpenProduct={(h, c) => navigate(`product:${h}`, c)}
                      />
                    ))}
                </div>
              </div>
            </section>

            {/* Verified Client Testimonials */}
            <section className="section-pad section-border-bottom">
              <div className="container">
                <div className="section-header">
                  <div className="section-header__titles">
                    <span className="mono-label">06 / CLIENT NOTES</span>
                    <h2>Worn &amp; Reviewed</h2>
                  </div>
                </div>
                <div className="testimonials-grid">
                  {[
                    {
                      quote:
                        'The collar roll on the Mercer Oxford rivals bespoke shirts twice its price. Holds a crisp architectural shoulder line all day.',
                      author: 'Marcus V. — Zurich',
                      garment: 'SIZE L / OXFORD',
                    },
                    {
                      quote:
                        'Finally a heavyweight white T-shirt that is completely opaque, drapes cleanly off the chest, and never twists at the side seams.',
                      author: 'Daniel K. — London',
                      garment: 'SIZE M / 240 GSM TEE',
                    },
                    {
                      quote:
                        'Took two Belgian Linen Camp Shirts to Lisbon. Breathable in 32°C heat with an understated, tailored drape for dinner.',
                      author: 'Henrik S. — Copenhagen',
                      garment: 'SIZE L / LINEN',
                    },
                  ].map((r) => (
                    <blockquote key={r.author} className="testimonial-card" style={{ margin: 0 }}>
                      <div style={{ display: 'grid', gap: 16 }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Icon key={n} name="star" size={14} />
                          ))}
                        </div>
                        <p style={{ fontSize: '1.0625rem', lineHeight: 1.55 }}>&ldquo;{r.quote}&rdquo;</p>
                      </div>
                      <footer
                        style={{
                          borderTop: '1px solid var(--color-border)',
                          paddingTop: 14,
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 12,
                        }}
                      >
                        <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{r.author}</span>
                        <span className="mono-label">{r.garment}</span>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            </section>

            {/* Visual Archive / Instagram Lookbook Grid */}
            <section className="section-pad section-border-bottom">
              <div className="container">
                <div className="section-header">
                  <div className="section-header__titles">
                    <span className="mono-label">07 / UNIFORM INDEX</span>
                    <h2>In Daily Rotation</h2>
                  </div>
                  <span className="mono-label" style={{ color: 'var(--color-text)' }}>@GRIDIUM.STUDIO</span>
                </div>
                <div className="ig-grid">
                  {[
                    { img: STUDIO_MEDIA.modelWhiteShirt, handle: 'albini-120s-formal-poplin-shirt' },
                    { img: STUDIO_MEDIA.modelOliveShirt, handle: 'belgian-flax-linen-camp-shirt' },
                    { img: STUDIO_MEDIA.modelWhiteTee, handle: 'supima-240-heavyweight-tee' },
                    { img: STUDIO_MEDIA.modelStriped, handle: 'mercer-two-ply-oxford-shirt' },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={`#product/${item.handle}`}
                      className="ig-item"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`product:${item.handle}`);
                      }}
                    >
                      <img src={item.img} alt="Gridium uniform lookbook" width={500} height={625} loading="lazy" />
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* Newsletter */}
            <section className={`section-pad ${globalScheme === 'midnight' ? 'color-midnight' : 'color-stone'}`}>
              <div className="container">
                <div className="grid-12 split-5-7" style={{ alignItems: 'center' }}>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <span className="mono-label">08 / STUDIO DISPATCH</span>
                    <h2>Seasonal Mill Releases</h2>
                    <p className="text-muted">
                      Early access to small-batch Italian poplins, Japanese chambrays, and archival restocks.
                    </p>
                  </div>
                  <div>
                    {newsletterSubmitted ? (
                      <p className="form-status form-status--success">
                        Thank you. You are subscribed to Gridium Studio dispatches.
                      </p>
                    ) : (
                      <form
                        style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
                        onSubmit={(e) => {
                          e.preventDefault();
                          setNewsletterSubmitted(true);
                        }}
                      >
                        <input
                          type="email"
                          className="field__input"
                          style={{ flex: '1 1 240px' }}
                          required
                          placeholder="Enter your email address"
                          aria-label="Email address"
                        />
                        <button type="submit" className="button">Subscribe</button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 2. ALL PRODUCTS & COLLECTIONS PAGE */}
        {route.startsWith('collection:') && (() => {
          const colHandle = route.replace('collection:', '');
          const colObj = COLLECTIONS.find((c) => c.handle === colHandle);
          const heading = colHandle === 'all' ? 'All Products' : colObj?.title || 'Shirting';
          const desc =
            colObj?.description ||
            'Complete seasonal shirting index: organic two-ply poplins, brushed Oxfords, European flax linens, knit polos, and heavyweight Supima tees.';

          const baseProducts = SHIRTS.filter((p) => p.collectionHandles.includes(colHandle));
          const filtered = baseProducts
            .filter((p) => {
              if (selectedFits.length && !selectedFits.includes(p.fit)) return false;
              if (selectedFabrics.length && !selectedFabrics.includes(p.fabric)) return false;
              if (p.price > maxPrice) return false;
              if (selectedColors.length && !p.colors.some((c) => selectedColors.includes(c.name))) return false;
              if (selectedSizes.length && !p.colors.some((c) => selectedSizes.some((sz) => c.stock[sz] > 0))) return false;
              if (inStockOnly && !p.colors.some((c) => ALL_SIZES.some((sz) => c.stock[sz] > 0))) return false;
              return true;
            })
            .sort((a, b) => {
              if (sortBy === 'price-asc') return a.price - b.price;
              if (sortBy === 'price-desc') return b.price - a.price;
              if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
              return 0;
            });

          const toggleItem = <T,>(arr: T[], val: T, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
            setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
          };

          return (
            <>
              <nav className="breadcrumbs" aria-label="Breadcrumbs">
                <div className="container">
                  <ol className="breadcrumbs__list mono-label">
                    <li>
                      <a href="#home" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a>
                    </li>
                    <li className="breadcrumbs__sep">/</li>
                    <li aria-current="page">{heading}</li>
                  </ol>
                </div>
              </nav>

              <header className="collection-banner">
                <div className="container collection-banner__grid">
                  <div>
                    <span className="mono-label">01 / CATALOGUE — {baseProducts.length} STYLES</span>
                    <h1 style={{ marginTop: 8 }}>{heading}</h1>
                  </div>
                  <p className="text-muted">{desc}</p>
                </div>
              </header>

              {/* Sticky Filter & Sort Toolbar */}
              <div className="facets-toolbar">
                <div className="container">
                  <div className="facets-toolbar__inner">
                    <button
                      type="button"
                      className="button button--secondary button--sm facets-mobile-btn"
                      onClick={() => setMobileFilterOpen(true)}
                    >
                      <Icon name="filter" size={16} />
                      <span>Filter &amp; Sort {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
                    </button>

                    <div className="facets-desktop">
                      {/* Size Facet */}
                      <details className="facet-dropdown">
                        <summary className="facet-dropdown__summary">
                          <span>Size {selectedSizes.length > 0 && `(${selectedSizes.length})`}</span>
                          <Icon name="chevron-down" size={14} />
                        </summary>
                        <div className="facet-dropdown__panel">
                          <ul className="facet-options">
                            {ALL_SIZES.map((sz) => (
                              <li key={sz}>
                                <label className="facet-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={selectedSizes.includes(sz)}
                                    onChange={() => toggleItem(selectedSizes, sz, setSelectedSizes)}
                                  />
                                  <span>Size {sz}</span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>

                      {/* Color Facet */}
                      <details className="facet-dropdown">
                        <summary className="facet-dropdown__summary">
                          <span>Color {selectedColors.length > 0 && `(${selectedColors.length})`}</span>
                          <Icon name="chevron-down" size={14} />
                        </summary>
                        <div className="facet-dropdown__panel">
                          <ul className="facet-options">
                            {allUniqueColors.map(([cName, hex]) => (
                              <li key={cName}>
                                <label className="facet-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={selectedColors.includes(cName)}
                                    onChange={() => toggleItem(selectedColors, cName, setSelectedColors)}
                                  />
                                  <span className="swatch-dot" style={{ '--swatch-color': hex } as React.CSSProperties} />
                                  <span>{cName}</span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>

                      {/* Fit Facet */}
                      <details className="facet-dropdown">
                        <summary className="facet-dropdown__summary">
                          <span>Fit {selectedFits.length > 0 && `(${selectedFits.length})`}</span>
                          <Icon name="chevron-down" size={14} />
                        </summary>
                        <div className="facet-dropdown__panel">
                          <ul className="facet-options">
                            {ALL_FITS.map((fit) => (
                              <li key={fit}>
                                <label className="facet-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={selectedFits.includes(fit)}
                                    onChange={() => toggleItem(selectedFits, fit, setSelectedFits)}
                                  />
                                  <span>{fit}</span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>

                      {/* Fabric Facet */}
                      <details className="facet-dropdown">
                        <summary className="facet-dropdown__summary">
                          <span>Fabric {selectedFabrics.length > 0 && `(${selectedFabrics.length})`}</span>
                          <Icon name="chevron-down" size={14} />
                        </summary>
                        <div className="facet-dropdown__panel">
                          <ul className="facet-options">
                            {allUniqueFabrics.map((fab) => (
                              <li key={fab}>
                                <label className="facet-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={selectedFabrics.includes(fab)}
                                    onChange={() => toggleItem(selectedFabrics, fab, setSelectedFabrics)}
                                  />
                                  <span>{fab}</span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>

                      {/* Price & Availability */}
                      <details className="facet-dropdown">
                        <summary className="facet-dropdown__summary">
                          <span>Price &amp; Stock</span>
                          <Icon name="chevron-down" size={14} />
                        </summary>
                        <div className="facet-dropdown__panel" style={{ display: 'grid', gap: 12 }}>
                          <label className="field">
                            <span className="field__label">Max Price: {formatPrice(maxPrice, country)}</span>
                            <input
                              type="range"
                              min={70}
                              max={200}
                              step={5}
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(Number(e.target.value))}
                            />
                          </label>
                          <label className="facet-checkbox">
                            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                            <span>In stock only</span>
                          </label>
                        </div>
                      </details>
                    </div>

                    <div className="facets-controls-right">
                      <span className="mono-label">{filtered.length} SHIRTS</span>

                      <div className="density-toggle" role="group" aria-label="Grid columns">
                        {([2, 3, 4] as const).map((cols) => (
                          <button
                            key={cols}
                            type="button"
                            className={`density-btn${gridCols === cols ? ' is-active' : ''}`}
                            onClick={() => setGridCols(cols)}
                          >
                            {cols}
                          </button>
                        ))}
                      </div>

                      <select
                        className="localization-select"
                        aria-label="Sort by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      >
                        <option value="featured">Featured</option>
                        <option value="newest">Newest Arrivals</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filter Chips */}
                  {activeFilterCount > 0 && (
                    <div className="active-facets">
                      {selectedSizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          className="filter-chip"
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleItem(selectedSizes, sz, setSelectedSizes)}
                        >
                          <span>Size: {sz}</span>
                          <Icon name="close" size={12} />
                        </button>
                      ))}
                      {selectedColors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className="filter-chip"
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleItem(selectedColors, c, setSelectedColors)}
                        >
                          <span>Color: {c}</span>
                          <Icon name="close" size={12} />
                        </button>
                      ))}
                      {selectedFits.map((f) => (
                        <button
                          key={f}
                          type="button"
                          className="filter-chip"
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleItem(selectedFits, f, setSelectedFits)}
                        >
                          <span>Fit: {f}</span>
                          <Icon name="close" size={12} />
                        </button>
                      ))}
                      {selectedFabrics.map((fb) => (
                        <button
                          key={fb}
                          type="button"
                          className="filter-chip"
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleItem(selectedFabrics, fb, setSelectedFabrics)}
                        >
                          <span>Fabric: {fb}</span>
                          <Icon name="close" size={12} />
                        </button>
                      ))}
                      {maxPrice < 200 && (
                        <button type="button" className="filter-chip" style={{ cursor: 'pointer' }} onClick={() => setMaxPrice(200)}>
                          <span>Under {formatPrice(maxPrice, country)}</span>
                          <Icon name="close" size={12} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="mono-label link-underline"
                        style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--color-text)' }}
                        onClick={clearAllFilters}
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Filter Drawer */}
              <div
                className="drawer-backdrop"
                aria-hidden={mobileFilterOpen ? 'false' : 'true'}
                role="dialog"
                aria-modal="true"
                aria-label="Filter Shirts"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setMobileFilterOpen(false);
                }}
              >
                <div className="drawer-panel drawer-panel--left">
                  <div className="drawer-header">
                    <span className="mono-label">FILTER &amp; SORT</span>
                    <button type="button" className="icon-btn" onClick={() => setMobileFilterOpen(false)}>
                      <Icon name="close" size={20} />
                    </button>
                  </div>
                  <div className="drawer-body" style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
                    <div>
                      <span className="mono-label">SIZE</span>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        {ALL_SIZES.map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            className={`size-button${selectedSizes.includes(sz) ? ' is-selected' : ''}`}
                            onClick={() => toggleItem(selectedSizes, sz, setSelectedSizes)}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="mono-label">FIT</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                        {ALL_FITS.map((fit) => (
                          <button
                            key={fit}
                            type="button"
                            className={`size-button${selectedFits.includes(fit) ? ' is-selected' : ''}`}
                            onClick={() => toggleItem(selectedFits, fit, setSelectedFits)}
                          >
                            {fit}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="mono-label">COLOR</span>
                      <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                        {allUniqueColors.map(([cName]) => (
                          <label key={cName} className="facet-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedColors.includes(cName)}
                              onChange={() => toggleItem(selectedColors, cName, setSelectedColors)}
                            />
                            <span>{cName}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="cart-drawer__footer">
                    <button type="button" className="button button--secondary button--full button--sm" onClick={clearAllFilters}>
                      Clear All
                    </button>
                    <button type="button" className="button button--full" onClick={() => setMobileFilterOpen(false)}>
                      Show {filtered.length} Shirts
                    </button>
                  </div>
                </div>
              </div>

              <section className="section-pad-sm">
                <div className="container">
                  {filtered.length === 0 ? (
                    <div className="collection-empty">
                      <span className="mono-label">0 RESULTS</span>
                      <h2 className="h3">No shirts match your active filters.</h2>
                      <p className="text-muted">Try clearing a size, color, or fabric filter to view available silhouettes.</p>
                      <button type="button" className="button" onClick={clearAllFilters}>
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className={`product-grid product-grid--${gridCols}`}>
                      {filtered.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          country={country}
                          isSaved={wishlist.includes(p.handle)}
                          onToggleWishlist={toggleWishlist}
                          onQuickAdd={(prod, cName, sz) => addToCart(prod, cName, sz, 1)}
                          onOpenProduct={(h, c) => navigate(`product:${h}`, c)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </>
          );
        })()}

        {/* 3. LIST COLLECTIONS PAGE */}
        {route === 'collections' && (
          <>
            <nav className="breadcrumbs" aria-label="Breadcrumbs">
              <div className="container">
                <ol className="breadcrumbs__list mono-label">
                  <li><a href="#home" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a></li>
                  <li className="breadcrumbs__sep">/</li>
                  <li aria-current="page">Collections</li>
                </ol>
              </div>
            </nav>
            <section className="section-pad">
              <div className="container">
                <div className="section-header">
                  <div className="section-header__titles">
                    <span className="mono-label">01 / DIRECTORY</span>
                    <h1>Shirting Collections</h1>
                  </div>
                </div>
                <div className="collections-list-grid">
                  {COLLECTIONS.map((col) => {
                    const count = SHIRTS.filter((s) => s.collectionHandles.includes(col.handle)).length;
                    return (
                      <a
                        key={col.handle}
                        href={`#collection/${col.handle}`}
                        className="collection-card"
                        onClick={(e) => {
                          e.preventDefault();
                          clearAllFilters();
                          navigate(`collection:${col.handle}`);
                        }}
                      >
                        <div className="collection-card__media">
                          <img src={col.image} alt={col.title} width={700} height={875} loading="lazy" />
                        </div>
                        <div className="collection-card__body">
                          <h2 className="h4">{col.title}</h2>
                          <span className="mono-label">{count} STYLES</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </section>
          </>
        )}

        {/* 4. PRODUCT DETAILS PAGE (PDP) */}
        {route.startsWith('product:') && (
          <ProductDetailView
            handle={route.replace('product:', '')}
            initialColor={pdpInitialColor}
            country={country}
            wishlist={wishlist}
            recentlyViewed={recentlyViewed}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onOpenSizeGuide={() => setSizeGuideOpen(true)}
            onZoom={(url) => setZoomImageUrl(url)}
            onNavigate={navigate}
          />
        )}

        {/* 5. ABOUT US PAGE */}
        {route === 'about' && (
          <>
            <nav className="breadcrumbs" aria-label="Breadcrumbs">
              <div className="container">
                <ol className="breadcrumbs__list mono-label">
                  <li><a href="#home" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a></li>
                  <li className="breadcrumbs__sep">/</li>
                  <li aria-current="page">About Us</li>
                </ol>
              </div>
            </nav>

            <section className="section-pad section-border-bottom">
              <div className="container">
                <div style={{ maxWidth: 860, display: 'grid', gap: 20 }}>
                  <span className="mono-label">01 / ABOUT GRIDIUM STUDIO</span>
                  <h1 className="display-xl">One Garment Category. Perfected Without Noise.</h1>
                  <p className="text-lead">
                    Founded on the conviction that a shirt is the architectural anchor of modern dress, Gridium develops permanent shirting blocks in partnership with family-owned European mills.
                  </p>
                </div>

                <div className="usp-grid" style={{ marginTop: 56 }}>
                  {[
                    { label: 'SEAM PRECISION', num: '22 SPI', cap: 'Single-needle French lockstitch across every side seam.' },
                    { label: 'EUROPEAN MILLS', num: '100%', cap: 'Partnered exclusively with weavers in Portugal, Belgium & Italy.' },
                    { label: 'JERSEY WEIGHT', num: '240 GSM', cap: 'Long-staple combed Supima cotton engineered for opaque drape.' },
                    { label: 'PLASTIC PACKAGING', num: '0%', cap: 'Delivered in FSC-certified archival board and glassine.' },
                  ].map((st) => (
                    <div key={st.label} className="usp-card">
                      <span className="mono-label">{st.label}</span>
                      <p className="h1">{st.num}</p>
                      <p className="text-muted" style={{ fontSize: '0.875rem' }}>{st.cap}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 64 }}>
                  <span className="mono-label" style={{ display: 'block', marginBottom: 24 }}>02 / DESIGN PRINCIPLES</span>
                  <div className="testimonials-grid">
                    {[
                      {
                        title: 'Architectural Pattern Discipline',
                        text: 'Every shirt block is drafted in-house with high, pitched armholes for clean chest lines and unrestricted reach.',
                      },
                      {
                        title: 'Unfused Soft Collar Roll',
                        text: 'We avoid rigid synthetic fusing so collars frame the neck naturally whether buttoned with tailoring or worn open.',
                      },
                      {
                        title: 'Permanent Archive Over Trends',
                        text: 'Core silhouettes stay in production year-round so you can reorder your exact block in seasonal fabrics.',
                      },
                    ].map((v, idx) => (
                      <div key={v.title} className="testimonial-card">
                        <span className="mono-label">0{idx + 1} / PRINCIPLE</span>
                        <div style={{ display: 'grid', gap: 10 }}>
                          <h2 className="h4">{v.title}</h2>
                          <p className="text-muted" style={{ fontSize: '0.9375rem' }}>{v.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className={`section-pad section-border-bottom ${globalScheme === 'midnight' ? 'color-midnight' : 'color-stone'}`}>
              <div className="container">
                <div className="grid-12 split-5-7">
                  <div className="editorial-media">
                    <img src={STUDIO_MEDIA.textileRolls} alt="European shirting textile archive" width={800} height={1000} loading="lazy" />
                  </div>
                  <div className="editorial-copy">
                    <span className="mono-label">03 / MILL CRAFTSMANSHIP</span>
                    <h2>Single-Origin Yarns &amp; Mother-of-Pearl.</h2>
                    <p className="text-muted">
                      Our two-ply poplins are woven by Somelos in northern Portugal; our summer linens carry the Masters of Linen® mark from Belgian flax; and every woven shirt is finished with 3.2mm Australian mother-of-pearl buttons whipped on thermally locked shanks.
                    </p>
                    <p className="mono-label" style={{ paddingTop: 12, borderTop: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                      CERTIFICATIONS: GOTS ORGANIC · OEKO-TEX® 100 · MASTERS OF LINEN
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="section-pad">
              <div className="container">
                <div className="section-header">
                  <div className="section-header__titles">
                    <span className="mono-label">04 / ATELIER LEADERSHIP</span>
                    <h2>Patternmakers &amp; Textile Leads</h2>
                  </div>
                </div>
                <div className="testimonials-grid">
                  {[
                    {
                      role: 'HEAD OF PATTERN ARCHITECTURE',
                      name: 'Lukas Lindqvist',
                      bio: '18 years drafting bespoke and ready-to-wear shirting blocks across Stockholm and Porto.',
                      img: STUDIO_MEDIA.modelMonoShirt,
                    },
                    {
                      role: 'DIRECTOR OF TEXTILES',
                      name: 'Clara Monteiro',
                      bio: 'Textile engineer specializing in high-twist organic poplins, mercerized knits, and enzyme washes.',
                      img: STUDIO_MEDIA.modelPoisedBW,
                    },
                    {
                      role: 'CREATIVE & STUDIO LEAD',
                      name: 'Julian Vance',
                      bio: 'Industrial designer focused on calm wardrobe systems and zero-excess garment detailing.',
                      img: STUDIO_MEDIA.modelStudioCasual,
                    },
                  ].map((m) => (
                    <article key={m.name} className="product-card">
                      <div className="product-card__media-wrap">
                        <img src={m.img} alt={m.name} className="product-card__img" width={500} height={625} loading="lazy" />
                      </div>
                      <div style={{ display: 'grid', gap: 4 }}>
                        <span className="mono-label">{m.role}</span>
                        <h3 className="h4">{m.name}</h3>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>{m.bio}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 64,
                    padding: 'clamp(28px, 4vw, 48px)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                  }}
                >
                  <div>
                    <span className="mono-label">ARCHIVE ACCESS</span>
                    <h3 className="h2" style={{ marginTop: 6 }}>Inspect the Current Shirting Collection</h3>
                  </div>
                  <button type="button" className="button" onClick={() => navigate('collection:all')}>
                    Explore All Shirts
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 6. CONTACT US PAGE */}
        {route === 'contact' && (
          <>
            <nav className="breadcrumbs" aria-label="Breadcrumbs">
              <div className="container">
                <ol className="breadcrumbs__list mono-label">
                  <li><a href="#home" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a></li>
                  <li className="breadcrumbs__sep">/</li>
                  <li aria-current="page">Contact</li>
                </ol>
              </div>
            </nav>

            <section className="section-pad section-border-bottom">
              <div className="container">
                <div className="grid-12 split-5-7">
                  <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
                    <div>
                      <span className="mono-label">01 / CLIENT CONCIERGE</span>
                      <h1 style={{ marginTop: 8 }}>Contact the Studio</h1>
                    </div>
                    <p className="text-muted">
                      For garment measurement advice, fabric inquiries, press pulls, or existing order assistance, write directly to our New York shirting desk.
                    </p>
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20, display: 'grid', gap: 16 }}>
                      <div>
                        <span className="mono-label">CLIENT SERVICE</span>
                        <p style={{ marginTop: 4 }}>concierge@gridiumstudio.com</p>
                      </div>
                      <div>
                        <span className="mono-label">STUDIO ADDRESS</span>
                        <p className="text-muted" style={{ marginTop: 4 }}>48 Mercer Street, Floor 3{'\n'}New York, NY 10013</p>
                      </div>
                      <div>
                        <span className="mono-label">HOURS</span>
                        <p className="text-muted" style={{ marginTop: 4 }}>Monday – Friday, 09:00 – 18:00 EST</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ border: '1px solid var(--color-border)', padding: 'clamp(24px, 4vw, 44px)' }}>
                    {contactSent && (
                      <p className="form-status form-status--success" role="status">
                        Thank you for contacting Gridium Studio. Our client service team responds within one business day.
                      </p>
                    )}
                    <form
                      style={{ display: 'grid', gap: 18 }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        setContactSent(true);
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                        <label className="field">
                          <span className="field__label">Full Name *</span>
                          <input type="text" className="field__input" required />
                        </label>
                        <label className="field">
                          <span className="field__label">Email Address *</span>
                          <input type="email" className="field__input" required />
                        </label>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                        <label className="field">
                          <span className="field__label">Phone Number (Optional)</span>
                          <input type="tel" className="field__input" />
                        </label>
                        <label className="field">
                          <span className="field__label">Order Number (Optional)</span>
                          <input type="text" className="field__input" placeholder="#GRD-1042" />
                        </label>
                      </div>
                      <label className="field">
                        <span className="field__label">How can our studio assist you? *</span>
                        <textarea className="field__textarea" required />
                      </label>
                      <div>
                        <button type="submit" className="button">Send Message</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Accordion */}
            <section className={`section-pad ${globalScheme === 'midnight' ? 'color-midnight' : 'color-stone'}`}>
              <div className="container">
                <div className="grid-12 split-4-8">
                  <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
                    <span className="mono-label">02 / FREQUENTLY ASKED</span>
                    <h2>Sizing, Care &amp; Dispatch</h2>
                    <p className="text-muted">Immediate answers on garment measurements, mill care, and 30-day exchanges.</p>
                  </div>
                  <div>
                    {[
                      {
                        q: 'How do I choose between Slim, Regular, and Oversized fits?',
                        a: 'Regular is our signature tailored block with clean chest room. Slim tapers 3 cm closer through the waist for wearing under suiting. Oversized features a dropped shoulder and relaxed drape—take your normal size in each block.',
                      },
                      {
                        q: 'Will Gridium cotton or linen shirts shrink after washing?',
                        a: 'All fabrics undergo mill sanforization and garment pre-washing. When washed cold (30°C) and hung dry, dimensional variance remains under 1.5%.',
                      },
                      {
                        q: 'How fast do orders ship and can I exchange sizes?',
                        a: 'In-stock orders placed before 2 PM EST dispatch the same business day. Size exchanges and returns are complimentary within 30 days of delivery.',
                      },
                      {
                        q: 'Are your heavyweight T-shirts see-through in white?',
                        a: 'Never. Our Optic White tee is knitted at a dense 240 GSM from two-ply combed Supima cotton specifically to guarantee full opacity and collar retention.',
                      },
                    ].map((faq, idx) => (
                      <details key={faq.q} className="accordion-item" open={idx === 0}>
                        <summary className="accordion-summary">
                          <span>{faq.q}</span>
                          <Icon name="plus" size={16} />
                        </summary>
                        <div className="accordion-content">{faq.a}</div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 7 & 8. PRIVACY POLICY & REFUND POLICY PAGES */}
        {(route === 'privacy' || route === 'refund') && (
          <PolicyView type={route} onHome={() => navigate('home')} />
        )}

        {/* SUPPORTING: WISHLIST PAGE */}
        {route === 'wishlist' && (
          <section className="section-pad">
            <div className="container">
              <div className="section-header">
                <div className="section-header__titles">
                  <span className="mono-label">01 / PERSONAL SHORTLIST</span>
                  <h1>Saved Shirts ({wishlist.length})</h1>
                  <p className="text-muted">Your shortlist of fabrics and silhouettes stored on this device.</p>
                </div>
              </div>

              {wishlist.length === 0 ? (
                <div className="collection-empty" style={{ border: '1px solid var(--color-border)' }}>
                  <h2 className="h3">No shirts saved yet.</h2>
                  <p className="text-muted">Select the heart icon on any shirt to build your personal wardrobe shortlist.</p>
                  <button type="button" className="button" onClick={() => navigate('collection:all')}>
                    Browse All Shirts
                  </button>
                </div>
              ) : (
                <div className="product-grid product-grid--4">
                  {SHIRTS.filter((s) => wishlist.includes(s.handle)).map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      country={country}
                      isSaved
                      onToggleWishlist={toggleWishlist}
                      onQuickAdd={(prod, cName, sz) => addToCart(prod, cName, sz, 1)}
                      onOpenProduct={(h, c) => navigate(`product:${h}`, c)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* SUPPORTING: FULL CART PAGE */}
        {route === 'cart' && (
          <section className="section-pad">
            <div className="container">
              <div className="section-header">
                <div className="section-header__titles">
                  <span className="mono-label">01 / SHOPPING BAG</span>
                  <h1>Your Bag ({totalBagCount})</h1>
                </div>
                <button
                  type="button"
                  className="mono-label link-underline"
                  style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--color-text)' }}
                  onClick={() => navigate('collection:all')}
                >
                  Shop All Shirts
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="cart-empty" style={{ border: '1px solid var(--color-border)' }}>
                  <h2 className="h3">Your bag is currently empty.</h2>
                  <p className="text-muted">Explore crisp organic poplins, heavyweight jersey tees, and breathable European linens.</p>
                  <button type="button" className="button" onClick={() => navigate('collection:all')}>
                    Shop All Shirts
                  </button>
                </div>
              ) : (
                <div className="cart-page-grid">
                  <div className="cart-items-list">
                    {cart.map((item) => {
                      const col = item.product.colors.find((c) => c.name === item.colorName) || item.product.colors[0];
                      return (
                        <div key={item.key} className="cart-item">
                          <div className="cart-item__media">
                            <img src={col.image} alt={item.product.title} width={80} height={100} />
                          </div>
                          <div className="cart-item__details">
                            <div>
                              <div className="cart-item__top">
                                <span className="cart-item__title">{item.product.title}</span>
                                <span className="price">{formatPrice(item.product.price * item.quantity, country)}</span>
                              </div>
                              <p className="cart-item__options">{item.colorName} / {item.size}</p>
                            </div>
                            <div className="cart-item__bottom">
                              <div className="qty-stepper">
                                <button type="button" className="qty-stepper__btn" onClick={() => updateCartQty(item.key, item.quantity - 1)}>
                                  <Icon name="minus" size={14} />
                                </button>
                                <span className="qty-stepper__input" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {item.quantity}
                                </span>
                                <button type="button" className="qty-stepper__btn" onClick={() => updateCartQty(item.key, item.quantity + 1)}>
                                  <Icon name="plus" size={14} />
                                </button>
                              </div>
                              <button type="button" className="cart-item__remove" onClick={() => updateCartQty(item.key, 0)}>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <aside className="cart-summary-card">
                    <label className="field">
                      <span className="field__label">Order / Gift Note</span>
                      <textarea
                        className="field__textarea"
                        style={{ minHeight: 84 }}
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        placeholder="Add tailoring notes or gift enclosure instructions..."
                      />
                    </label>
                    <div className="cart-subtotal-row">
                      <span>Subtotal</span>
                      <span>
                        {formatPrice(
                          cart.reduce((s, i) => s + i.product.price * i.quantity, 0),
                          country
                        )}
                      </span>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.8125rem' }}>
                      Shipping, duties, and applicable taxes calculated at checkout.
                    </p>
                    <button type="button" className="button button--full" onClick={() => setCartOpen(true)}>
                      Proceed to Checkout
                    </button>
                  </aside>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SUPPORTING: CLIENT ACCOUNT LOGIN VIEW */}
        {route === 'account' && (
          <div className="container customer-box">
            <span className="mono-label">01 / CLIENT PORTAL</span>
            <h1 className="h2" style={{ marginBlock: '8px 24px' }}>Client Sign In</h1>
            <form
              style={{ display: 'grid', gap: 16 }}
              onSubmit={(e) => {
                e.preventDefault();
                navigate('home');
              }}
            >
              <label className="field">
                <span className="field__label">Email</span>
                <input type="email" className="field__input" required placeholder="client@domain.com" />
              </label>
              <label className="field">
                <span className="field__label">Password</span>
                <input type="password" className="field__input" required placeholder="••••••••" />
              </label>
              <button type="submit" className="button button--full">Sign In</button>
            </form>
          </div>
        )}
      </main>

      {/* Architectural Footer + Country/Currency & Language Selectors */}
      <footer className="site-footer">
        <div className="container">
          <div className="site-footer__top">
            <div className="site-footer__brand">
              <a
                href="#home"
                className="site-header__logo"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('home');
                }}
              >
                GRIDIUM
              </a>
              <p className="text-muted" style={{ fontSize: '0.9375rem', maxWidth: '34ch' }}>
                Architectural shirting engineered for order, longevity, and daily precision. Cut from single-origin organic cottons and European flax.
              </p>
            </div>

            <div>
              <span className="mono-label">01 / SHIRTING</span>
              <ul className="site-footer__links">
                <li><a href="#all" className="link-underline" onClick={(e) => { e.preventDefault(); navigate('collection:all'); }}>All Products</a></li>
                <li><a href="#oxf" className="link-underline" onClick={(e) => { e.preventDefault(); navigate('collection:oxford-casual'); }}>Oxford &amp; Casual</a></li>
                <li><a href="#tee" className="link-underline" onClick={(e) => { e.preventDefault(); navigate('collection:heavyweight-tees'); }}>Heavyweight Tees</a></li>
                <li><a href="#lin" className="link-underline" onClick={(e) => { e.preventDefault(); navigate('collection:linen-resort'); }}>Belgian Linen</a></li>
              </ul>
            </div>

            <div>
              <span className="mono-label">02 / CLIENT CARE</span>
              <ul className="site-footer__links">
                <li><a href="#about" className="link-underline" onClick={(e) => { e.preventDefault(); navigate('about'); }}>About Us</a></li>
                <li><a href="#contact" className="link-underline" onClick={(e) => { e.preventDefault(); navigate('contact'); }}>Contact Us</a></li>
                <li><a href="#privacy" className="link-underline" onClick={(e) => { e.preventDefault(); navigate('privacy'); }}>Privacy Policy</a></li>
                <li><a href="#refund" className="link-underline" onClick={(e) => { e.preventDefault(); navigate('refund'); }}>Refund Policy</a></li>
              </ul>
            </div>

            <div>
              <span className="mono-label">03 / ATELIER</span>
              <div className="site-footer__links text-muted">
                <p>48 Mercer Street, Floor 3{'\n'}New York, NY 10013</p>
                <p>Mon–Fri 09:00–18:00 EST</p>
              </div>
            </div>

            <div>
              <span className="mono-label">04 / THEME EXPORT</span>
              <div className="site-footer__links">
                <button type="button" className="button button--secondary button--sm" onClick={() => setStudioOpen(true)}>
                  Theme Files &amp; .ZIP
                </button>
              </div>
            </div>
          </div>

          <div className="site-footer__bottom">
            <span>&copy; {new Date().getFullYear()} Gridium Studio. All rights reserved.</span>

            <div className="localization-bar">
              <label className="visually-hidden" htmlFor="CountrySelect">Country / Currency</label>
              <select
                id="CountrySelect"
                className="localization-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {Object.entries(CURRENCIES).map(([iso, c]) => (
                  <option key={iso} value={iso}>
                    {c.country} ({c.code} {c.symbol.trim()})
                  </option>
                ))}
              </select>

              <label className="visually-hidden" htmlFor="LangSelect">Language</label>
              <select
                id="LangSelect"
                className="localization-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <div className="floating-stack">
        <button
          type="button"
          className={`floating-btn floating-btn--backtop${scrolled ? ' is-visible' : ''}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <Icon name="arrow-up" size={18} />
        </button>
      </div>

      {/* Modals & Drawers */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        country={country}
        orderNote={orderNote}
        onChangeNote={setOrderNote}
        onUpdateQty={updateCartQty}
        onQuickAdd={(p, c, s) => addToCart(p, c, s, 1)}
        onNavigate={navigate}
      />

      <PredictiveSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        country={country}
        onSelectProduct={(h) => navigate(`product:${h}`)}
        onSelectCollection={(h) => navigate(`collection:${h}`)}
      />

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      <ThemeStudioModal open={studioOpen} onClose={() => setStudioOpen(false)} />

      {/* Lightbox Image Zoom Modal */}
      {zoomImageUrl && (
        <div
          className="modal-overlay"
          aria-hidden="false"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoomImageUrl(null);
          }}
        >
          <div className="modal-panel" style={{ maxWidth: 880, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button type="button" className="icon-btn" onClick={() => setZoomImageUrl(null)} aria-label="Close zoom">
                <Icon name="close" size={20} />
              </button>
            </div>
            <img src={zoomImageUrl} alt="Fabric zoom inspection" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* Product Detail Sub-View (PDP) */
const ProductDetailView: React.FC<{
  handle: string;
  initialColor?: string;
  country: string;
  wishlist: string[];
  recentlyViewed: string[];
  onToggleWishlist: (handle: string) => void;
  onAddToCart: (product: ShirtProduct, colorName: string, size: ShirtSize, qty: number) => void;
  onOpenSizeGuide: () => void;
  onZoom: (url: string) => void;
  onNavigate: (route: string, colorHint?: string) => void;
}> = ({
  handle,
  initialColor,
  country,
  wishlist,
  recentlyViewed,
  onToggleWishlist,
  onAddToCart,
  onOpenSizeGuide,
  onZoom,
  onNavigate,
}) => {
  const product = SHIRTS.find((p) => p.handle === handle) || SHIRTS[0];
  const [colorName, setColorName] = useState<string>(initialColor || product.colors[0].name);
  const [size, setSize] = useState<ShirtSize>('M');
  const [qty, setQty] = useState<number>(1);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const valid = product.colors.find((c) => c.name === initialColor)?.name || product.colors[0].name;
    setColorName(valid);
    setActiveSlideIdx(0);
    setQty(1);
  }, [product, initialColor]);

  const colorObj = product.colors.find((c) => c.name === colorName) || product.colors[0];
  const slides = [colorObj.image, colorObj.secondaryImage, STUDIO_MEDIA.atelierPatterns];
  const stockQty = colorObj.stock[size];
  const available = stockQty > 0;
  const onSale = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const savePct =
    onSale && product.compareAtPrice
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;
  const sku = `${product.skuPrefix}-${colorName.slice(0, 3).toUpperCase()}-${size}`;
  const isSaved = wishlist.includes(product.handle);
  const pairedProduct = SHIRTS.find((p) => p.handle === product.pairedHandle) || SHIRTS[1];
  const related = SHIRTS.filter((p) => p.handle !== product.handle).slice(0, 4);
  const recentProducts = recentlyViewed
    .filter((h) => h !== product.handle)
    .map((h) => SHIRTS.find((p) => p.handle === h))
    .filter((p): p is ShirtProduct => Boolean(p))
    .slice(0, 4);

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumbs">
        <div className="container">
          <ol className="breadcrumbs__list mono-label">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a></li>
            <li className="breadcrumbs__sep">/</li>
            <li><a href="#all" onClick={(e) => { e.preventDefault(); onNavigate('collection:all'); }}>All Products</a></li>
            <li className="breadcrumbs__sep">/</li>
            <li aria-current="page">{product.title}</li>
          </ol>
        </div>
      </nav>

      <section className="section-pad-sm section-border-bottom">
        <div className="container">
          <div className="pdp-grid">
            {/* Gallery: Vertical Thumbnails on Desktop, Swipeable on Mobile + Zoom */}
            <div className="pdp-gallery">
              <div className="pdp-thumbs" role="tablist" aria-label="Product views">
                {slides.map((src, idx) => (
                  <button
                    key={src + idx}
                    type="button"
                    className={`pdp-thumb${activeSlideIdx === idx ? ' is-active' : ''}`}
                    onClick={() => setActiveSlideIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={src} alt="" width={84} height={105} />
                  </button>
                ))}
              </div>

              <div className="pdp-stage">
                <div className="pdp-slide is-active">
                  <img
                    src={slides[activeSlideIdx] || colorObj.image}
                    alt={`${product.title} — ${colorName}`}
                    width={960}
                    height={1200}
                  />
                </div>
                <button
                  type="button"
                  className="icon-btn pdp-zoom-trigger"
                  onClick={() => onZoom(slides[activeSlideIdx] || colorObj.image)}
                  aria-label="Inspect fabric detail"
                >
                  <Icon name="zoom" size={18} />
                </button>
              </div>
            </div>

            {/* Product Details Column */}
            <div className="pdp-info">
              <div style={{ display: 'grid', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }} className="mono-label">
                  <span>{product.type} · {product.mill}</span>
                  <span>SKU: {sku}</span>
                </div>
                <h1 className="h2">{product.title}</h1>
              </div>

              <div>
                <span className={`price${onSale ? ' price--on-sale' : ''}`} style={{ fontSize: '1.25rem' }}>
                  <span className="price__regular">{formatPrice(product.price, country)}</span>
                  {onSale && product.compareAtPrice && (
                    <>
                      <s className="price__compare">{formatPrice(product.compareAtPrice, country)}</s>
                      <span className="badge badge--sale">Save {savePct}%</span>
                    </>
                  )}
                </span>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: 4 }}>
                  Taxes included. Express shipping calculated at checkout.
                </p>
              </div>

              {/* Fit & Model Metafield Bar */}
              <div className="pdp-fit-bar">
                <span className="mono-label" style={{ color: 'var(--color-text)' }}>
                  FIT: {product.fit.toUpperCase()} ({product.gsm})
                </span>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>{product.modelInfo}</span>
              </div>

              {/* Color Swatches */}
              <div className="option-group">
                <div className="option-group__head">
                  <span className="mono-label">
                    COLOR: <strong style={{ color: 'var(--color-text)' }}>{colorName}</strong>
                  </span>
                </div>
                <div className="swatch-list">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      className={`swatch-button${c.name === colorName ? ' is-selected' : ''}`}
                      aria-pressed={c.name === colorName}
                      aria-label={c.name}
                      title={c.name}
                      onClick={() => {
                        setColorName(c.name);
                        setActiveSlideIdx(0);
                      }}
                    >
                      <span className="swatch-button__fill" style={{ '--swatch-color': c.hex } as React.CSSProperties} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Picker + Size Guide Trigger */}
              <div className="option-group">
                <div className="option-group__head">
                  <span className="mono-label">
                    SIZE: <strong style={{ color: 'var(--color-text)' }}>{size}</strong>
                  </span>
                  <button
                    type="button"
                    className="mono-label link-underline"
                    style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--color-text)' }}
                    onClick={onOpenSizeGuide}
                  >
                    <Icon name="ruler" size={15} />
                    <span>Size Guide &amp; Fit Finder</span>
                  </button>
                </div>
                <div className="size-list">
                  {ALL_SIZES.map((sz) => {
                    const szAvail = colorObj.stock[sz] > 0;
                    return (
                      <button
                        key={sz}
                        type="button"
                        className={`size-button${sz === size ? ' is-selected' : ''}${!szAvail ? ' is-unavailable' : ''}`}
                        aria-pressed={sz === size}
                        onClick={() => setSize(sz)}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Low-Stock / Availability Indicator */}
              <div
                className={`stock-indicator${
                  !available ? ' stock-indicator--out' : stockQty <= 5 ? ' stock-indicator--low' : ''
                }`}
              >
                <span className="stock-dot" />
                <span>
                  {!available
                    ? 'Sold Out in selected size — select another size or color'
                    : stockQty <= 5
                      ? `Only ${stockQty} left in stock`
                      : 'In stock — dispatches within 24 hours'}
                </span>
              </div>

              {/* Quantity Stepper + AJAX Add to Bag + Wishlist */}
              <div className="pdp-buy-row">
                <div className="qty-stepper">
                  <button
                    type="button"
                    className="qty-stepper__btn"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Icon name="minus" size={15} />
                  </button>
                  <input
                    type="number"
                    className="qty-stepper__input"
                    value={qty}
                    min={1}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                    aria-label="Quantity"
                  />
                  <button
                    type="button"
                    className="qty-stepper__btn"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Icon name="plus" size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  className="button button--full"
                  disabled={!available}
                  onClick={() => onAddToCart(product, colorName, size, qty)}
                >
                  {available ? 'Add to Bag' : 'Sold Out'}
                </button>

                <button
                  type="button"
                  className="icon-btn"
                  style={{
                    borderColor: 'var(--color-border)',
                    minWidth: 48,
                    background: isSaved ? 'var(--color-bg-subtle)' : 'transparent',
                  }}
                  aria-pressed={isSaved}
                  aria-label="Save to wishlist"
                  onClick={() => onToggleWishlist(product.handle)}
                >
                  <Icon name="heart" size={18} />
                </button>
              </div>

              <p className="text-muted" style={{ fontSize: '0.9375rem' }}>{product.description}</p>

              {/* Accordions */}
              <div>
                <details className="accordion-item" open>
                  <summary className="accordion-summary">
                    <span>Fabric &amp; Care</span>
                    <Icon name="plus" size={16} />
                  </summary>
                  <div className="accordion-content">{product.fabricCare}</div>
                </details>
                <details className="accordion-item">
                  <summary className="accordion-summary">
                    <span>Delivery &amp; 30-Day Exchanges</span>
                    <Icon name="plus" size={16} />
                  </summary>
                  <div className="accordion-content">
                    Complimentary express shipping on orders over {formatPrice(150, country)}. Same-day dispatch before 2 PM EST. Free size exchanges and prepaid returns within 30 days.
                  </div>
                </details>
              </div>

              {/* Complete the Uniform Pairing */}
              <div style={{ border: '1px solid var(--color-border)', padding: 14, display: 'grid', gap: 10 }}>
                <span className="mono-label">COMPLETE THE UNIFORM</span>
                <div className="cart-upsell__card" style={{ marginTop: 0 }}>
                  <a
                    href={`#product/${pairedProduct.handle}`}
                    className="cart-item__media"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`product:${pairedProduct.handle}`);
                    }}
                  >
                    <img src={pairedProduct.colors[0].image} alt={pairedProduct.title} width={56} height={70} />
                  </a>
                  <div>
                    <a
                      href={`#product/${pairedProduct.handle}`}
                      className="cart-item__title"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`product:${pairedProduct.handle}`);
                      }}
                    >
                      {pairedProduct.title}
                    </a>
                    <div className="text-muted" style={{ fontSize: '0.8125rem' }}>{formatPrice(pairedProduct.price, country)}</div>
                  </div>
                  <button
                    type="button"
                    className="button button--secondary button--sm"
                    onClick={() => onAddToCart(pairedProduct, pairedProduct.colors[0].name, 'M', 1)}
                  >
                    + Quick Add
                  </button>
                </div>
              </div>

              {/* Trust Badges & Share */}
              <div className="trust-row">
                <div className="trust-item"><Icon name="shirt" size={16} /><span>Organic Mill Fibers</span></div>
                <div className="trust-item"><Icon name="return" size={16} /><span>30-Day Free Exchanges</span></div>
                <div className="trust-item"><Icon name="shield" size={16} /><span>24h Express Dispatch</span></div>
              </div>

              <div>
                <button
                  type="button"
                  className="button button--secondary button--sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 1800);
                  }}
                >
                  <Icon name="share" size={14} />
                  <span>{copiedLink ? 'Link Copied' : 'Share Garment'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="sticky-atc is-visible">
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{product.title}</div>
          <div className="mono-label">{colorName} · {size} · {formatPrice(product.price, country)}</div>
        </div>
        <button
          type="button"
          className="button button--sm"
          disabled={!available}
          onClick={() => onAddToCart(product, colorName, size, 1)}
        >
          {available ? 'Add to Bag' : 'Sold Out'}
        </button>
      </div>

      {/* Related Shirtings */}
      <section className="section-pad section-border-bottom">
        <div className="container">
          <div className="section-header">
            <div className="section-header__titles">
              <span className="mono-label">02 / RELATED ARCHIVE</span>
              <h2>Related Shirtings</h2>
            </div>
          </div>
          <div className="product-grid product-grid--4">
            {related.map((rec) => (
              <ProductCard
                key={rec.id}
                product={rec}
                country={country}
                isSaved={wishlist.includes(rec.handle)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={(prod, cName, sz) => onAddToCart(prod, cName, sz, 1)}
                onOpenProduct={(h, c) => onNavigate(`product:${h}`, c)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Inspected */}
      {recentProducts.length > 0 && (
        <section className="section-pad">
          <div className="container">
            <div className="section-header">
              <div className="section-header__titles">
                <span className="mono-label">03 / VIEWED HISTORY</span>
                <h2>Recently Inspected</h2>
              </div>
            </div>
            <div className="product-grid product-grid--4">
              {recentProducts.map((rp) => (
                <ProductCard
                  key={rp.id}
                  product={rp}
                  country={country}
                  isSaved={wishlist.includes(rp.handle)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={(prod, cName, sz) => onAddToCart(prod, cName, sz, 1)}
                  onOpenProduct={(h, c) => onNavigate(`product:${h}`, c)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

/* Legal Policy View with Sticky Table of Contents & 68ch Reading Column */
const PolicyView: React.FC<{ type: 'privacy' | 'refund'; onHome: () => void }> = ({ type, onHome }) => {
  const sections =
    type === 'privacy'
      ? [
          {
            id: 'info-collect',
            title: '1. Information We Collect',
            body: 'When you browse or purchase from Gridium, we collect essential contact, shipping, and encrypted payment token details necessary to fulfill your garment order, process exchanges, and provide concierge sizing assistance.',
          },
          {
            id: 'how-we-use',
            title: '2. How We Use Your Data',
            body: 'Personal information is strictly used for order dispatch, fraud prevention, statutory tax compliance, and—only where explicitly opted in—studio newsletter dispatches. We never sell or rent client records to third parties.',
          },
          {
            id: 'shopify-security',
            title: '3. Payment Security & Shopify Infrastructure',
            body: 'Our online store is hosted on Shopify Inc. All card transactions are encrypted through PCI-DSS Level 1 standards; Gridium never stores raw credit card numbers on studio systems.',
          },
          {
            id: 'cookies-storage',
            title: '4. Cookies & Local Storage',
            body: 'We use minimal functional cookies and browser localStorage to preserve your shopping bag, currency preference, grid density, and saved wishlist items across sessions.',
          },
          {
            id: 'privacy-rights',
            title: '5. Your Privacy Rights',
            body: 'Under GDPR, UK GDPR, and CCPA, you may request access, correction, portability, or deletion of your personal records at any time by writing to concierge@gridiumstudio.com.',
          },
        ]
      : [
          {
            id: 'return-window',
            title: '1. 30-Day Return & Exchange Window',
            body: 'We accept returns and complimentary size exchanges within 30 days of delivery. Shirts must remain unworn, unwashed, unaltered, and returned in original archival packaging with garment tags attached.',
          },
          {
            id: 'instant-exchange',
            title: '2. Instant Size Exchanges',
            body: 'Need a closer Slim fit or a roomier Regular size? Request an exchange using your order number via our Contact page and we will reserve your replacement shirt immediately upon carrier scan.',
          },
          {
            id: 'refund-timeline',
            title: '3. Refund Processing',
            body: 'Once inspected at our studio warehouse, approved refunds are credited back to your original payment method within 3–5 business days. Express shipping upgrades are non-refundable.',
          },
          {
            id: 'international-returns',
            title: '4. International Duties & Returns',
            body: 'International clients may generate a prepaid DHL or UPS return airwaybill through client care. Import duties paid directly to local customs authorities can be reclaimed locally.',
          },
          {
            id: 'quality-guarantee',
            title: '5. Mill & Seam Quality Guarantee',
            body: 'In the rare event of a mill weave flaw or seam defect, contact our atelier team with a photograph for an immediate complimentary replacement.',
          },
        ];

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumbs">
        <div className="container">
          <ol className="breadcrumbs__list mono-label">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); onHome(); }}>Home</a></li>
            <li className="breadcrumbs__sep">/</li>
            <li aria-current="page">{type === 'privacy' ? 'Privacy Policy' : 'Returns & Refund Policy'}</li>
          </ol>
        </div>
      </nav>

      <section className="section-pad">
        <div className="container">
          <div style={{ marginBottom: 48, paddingBottom: 28, borderBottom: '1px solid var(--color-border)' }}>
            <span className="mono-label">EFFECTIVE &amp; REVIEWED: CURRENT SEASON</span>
            <h1 style={{ marginTop: 8 }}>{type === 'privacy' ? 'Privacy Policy' : 'Returns & Refund Policy'}</h1>
          </div>

          <div className="policy-layout">
            <aside className="policy-toc" aria-label="On This Page">
              <span className="mono-label">ON THIS PAGE</span>
              <ul className="policy-toc__list">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="policy-toc__link">{s.title}</a>
                  </li>
                ))}
              </ul>
            </aside>

            <article className="rte">
              {sections.map((s) => (
                <div key={s.id} id={s.id} style={{ marginBottom: 32 }}>
                  <h2 className="h3" style={{ marginTop: 0 }}>{s.title}</h2>
                  <p className="text-muted">{s.body}</p>
                </div>
              ))}
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default App;
