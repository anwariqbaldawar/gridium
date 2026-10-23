import React, { useEffect, useRef, useState } from 'react';
import { COLLECTIONS, formatPrice, ShirtProduct, ShirtSize, SHIRTS } from '../data/shirts';

export const Icon: React.FC<{ name: string; size?: number }> = ({ name, size = 20 }) => (
  <svg
    className={`icon icon--${name}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
  >
    {name === 'menu' && <path d="M3 7h18M3 12h18M3 17h18" />}
    {name === 'search' && (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4.2-4.2" />
      </>
    )}
    {name === 'bag' && (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    )}
    {name === 'heart' && <path d="M12 20.5s-7.5-4.6-9.5-9A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9.5 5.5c-2 4.4-9.5 9-9.5 9Z" />}
    {name === 'user' && (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c1.8-3.6 5-5 8-5s6.2 1.4 8 5" />
      </>
    )}
    {name === 'close' && <path d="M6 6l12 12M18 6 6 18" />}
    {name === 'plus' && <path d="M12 5v14M5 12h14" />}
    {name === 'minus' && <path d="M5 12h14" />}
    {name === 'chevron-down' && <path d="m6 9 6 6 6-6" />}
    {name === 'arrow-up' && <path d="M12 19V5M6 11l6-6 6 6" />}
    {name === 'arrow-right' && <path d="M4 12h15M13 6l6 6-6 6" />}
    {name === 'filter' && <path d="M4 7h16M7 12h10M10 17h4" />}
    {name === 'zoom' && (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M11 8v6M8 11h6m6 9-4.2-4.2" />
      </>
    )}
    {name === 'ruler' && <path d="M3 9h18v6H3zM7 9v3M11 9v2M15 9v3M19 9v2" />}
    {name === 'shield' && <path d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6l-7-3Z" />}
    {name === 'truck' && (
      <>
        <path d="M2 6h12v10H2zM14 9h4l4 4v3h-8z" />
        <circle cx="6.5" cy="17.5" r="2" />
        <circle cx="17.5" cy="17.5" r="2" />
      </>
    )}
    {name === 'return' && (
      <>
        <path d="M9 14 4 9l5-5" />
        <path d="M4 9h11a5 5 0 0 1 0 10h-3" />
      </>
    )}
    {name === 'shirt' && <path d="M9 4 4 7l2 4 3-1v10h6V10l3 1 2-4-5-3-3 2-3-2Z" />}
    {name === 'share' && (
      <>
        <path d="M10 14 20 4M15 4h5v5" />
        <path d="M19 13v6H5V5h6" />
      </>
    )}
    {name === 'star' && <path d="m12 3.5 2.6 5.3 5.9.8-4.3 4.2 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5Z" fill="currentColor" />}
  </svg>
);

export interface CartLineItem {
  key: string;
  product: ShirtProduct;
  colorName: string;
  size: ShirtSize;
  quantity: number;
}

interface ProductCardProps {
  product: ShirtProduct;
  country: string;
  isSaved: boolean;
  onToggleWishlist: (handle: string) => void;
  onQuickAdd: (product: ShirtProduct, colorName: string, size: ShirtSize) => void;
  onOpenProduct: (handle: string, colorName?: string) => void;
}

const SIZES: ShirtSize[] = ['S', 'M', 'L', 'XL'];

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  country,
  isSaved,
  onToggleWishlist,
  onQuickAdd,
  onOpenProduct,
}) => {
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const color = product.colors[activeColorIdx] || product.colors[0];
  const onSale = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const savePct = onSale && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <article className="product-card has-secondary">
      <div className="product-card__media-wrap">
        <div className="badge-stack">
          {onSale && <span className="badge badge--sale">-{savePct}%</span>}
          {product.isNew && <span className="badge">New</span>}
          {product.isBestseller && <span className="badge">Bestseller</span>}
        </div>

        <button
          type="button"
          className={`wishlist-btn${isSaved ? ' is-saved' : ''}`}
          aria-pressed={isSaved}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.handle);
          }}
        >
          <Icon name="heart" size={18} />
        </button>

        <a
          href={`#product/${product.handle}`}
          onClick={(e) => {
            e.preventDefault();
            onOpenProduct(product.handle, color.name);
          }}
          aria-label={product.title}
        >
          <img
            src={color.image}
            alt={`${product.title} in ${color.name}`}
            className="product-card__img product-card__img--primary"
            width={600}
            height={750}
            loading="lazy"
          />
          <img
            src={color.secondaryImage}
            alt={`${product.title} detail`}
            className="product-card__img product-card__img--secondary"
            width={600}
            height={750}
            loading="lazy"
          />
        </a>

        <div className="quick-add">
          <span className="mono-label">QUICK ADD — {color.name.toUpperCase()}</span>
          <div className="quick-add__sizes">
            {SIZES.map((sz) => {
              const available = color.stock[sz] > 0;
              return (
                <button
                  key={sz}
                  type="button"
                  className="quick-add__size-btn"
                  disabled={!available}
                  onClick={() => onQuickAdd(product, color.name, sz)}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="product-card__info">
        <div className="product-card__meta-row mono-label">
          <span>{product.type.toUpperCase()}</span>
          <span>FIT: {product.fit.toUpperCase()}</span>
        </div>

        <a
          href={`#product/${product.handle}`}
          className="product-card__title"
          onClick={(e) => {
            e.preventDefault();
            onOpenProduct(product.handle, color.name);
          }}
        >
          {product.title}
        </a>

        <span className={`price${onSale ? ' price--on-sale' : ''}`}>
          <span className="price__regular">{formatPrice(product.price, country)}</span>
          {onSale && product.compareAtPrice && (
            <s className="price__compare">{formatPrice(product.compareAtPrice, country)}</s>
          )}
        </span>

        <div className="card-swatches" role="group" aria-label="Available colors">
          {product.colors.slice(0, 5).map((c, idx) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setActiveColorIdx(idx)}
              aria-label={`Preview ${c.name}`}
              title={c.name}
              style={{
                padding: 0,
                background: 'none',
                border: idx === activeColorIdx ? '1px solid var(--color-text)' : '1px solid transparent',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <span className="swatch-dot" style={{ '--swatch-color': c.hex } as React.CSSProperties} />
            </button>
          ))}
        </div>
      </div>
    </article>
  );
};

/* Size Guide + Client-Side Find My Size Modal */
const SIZE_CHART_CM = [
  { size: 'XS', chest: 98, length: 70, shoulder: 43, sleeve: 61 },
  { size: 'S', chest: 104, length: 72, shoulder: 45, sleeve: 62.5 },
  { size: 'M', chest: 110, length: 74, shoulder: 47, sleeve: 64 },
  { size: 'L', chest: 116, length: 76, shoulder: 49, sleeve: 65.5 },
  { size: 'XL', chest: 122, length: 78, shoulder: 51, sleeve: 67 },
  { size: 'XXL', chest: 128, length: 80, shoulder: 53, sleeve: 68.5 },
];

export const SizeGuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [height, setHeight] = useState(180);
  const [weight, setWeight] = useState(75);
  const [pref, setPref] = useState<'slim' | 'regular' | 'relaxed'>('regular');
  const [suggested, setSuggested] = useState<string | null>(null);

  if (!open) return null;

  const fmt = (cmVal: number) => (unit === 'cm' ? cmVal : Math.round((cmVal / 2.54) * 2) / 2);

  const calculateFit = () => {
    const matrix = [
      { size: 'XS', maxH: 170, maxW: 62 },
      { size: 'S', maxH: 176, maxW: 70 },
      { size: 'M', maxH: 181, maxW: 79 },
      { size: 'L', maxH: 186, maxW: 88 },
      { size: 'XL', maxH: 191, maxW: 98 },
      { size: 'XXL', maxH: 215, maxW: 140 },
    ];
    let idx = matrix.findIndex((r) => height <= r.maxH && weight <= r.maxW);
    if (idx === -1) idx = matrix.length - 1;
    if (pref === 'slim') idx = Math.max(0, idx - 1);
    if (pref === 'relaxed') idx = Math.min(matrix.length - 1, idx + 1);
    setSuggested(matrix[idx].size);
  };

  return (
    <div
      className="modal-overlay"
      aria-hidden="false"
      role="dialog"
      aria-modal="true"
      aria-labelledby="SizeGuideModalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <div>
            <span className="mono-label">01 / GARMENT SPECIFICATION</span>
            <h2 id="SizeGuideModalTitle" className="h3" style={{ marginTop: 4 }}>Shirt Size &amp; Measurement Guide</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="unit-toggle" role="group" aria-label="Measurement units">
              <button type="button" className={unit === 'cm' ? 'is-active' : ''} onClick={() => setUnit('cm')}>CM</button>
              <button type="button" className={unit === 'in' ? 'is-active' : ''} onClick={() => setUnit('in')}>IN</button>
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: 16 }}>
          Measurements refer to garment dimensions laid flat ({unit.toUpperCase()}). Take your usual size for intended architectural drape.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Back Length</th>
                <th>Shoulder</th>
                <th>Sleeve</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART_CM.map((r) => (
                <tr key={r.size}>
                  <td><strong>{r.size}</strong></td>
                  <td>{fmt(r.chest)}</td>
                  <td>{fmt(r.length)}</td>
                  <td>{fmt(r.shoulder)}</td>
                  <td>{fmt(r.sleeve)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fit-finder">
          <div>
            <span className="mono-label">02 / FIND MY SIZE HELPER</span>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Enter your height and weight for client-side shirting block guidance.</p>
          </div>
          <div className="fit-finder__grid">
            <label className="field">
              <span className="field__label">Height (cm)</span>
              <input type="number" className="field__input" value={height} min={145} max={215} onChange={(e) => setHeight(Number(e.target.value))} />
            </label>
            <label className="field">
              <span className="field__label">Weight (kg)</span>
              <input type="number" className="field__input" value={weight} min={42} max={140} onChange={(e) => setWeight(Number(e.target.value))} />
            </label>
            <label className="field">
              <span className="field__label">Fit Preference</span>
              <select className="field__select" value={pref} onChange={(e) => setPref(e.target.value as 'slim' | 'regular' | 'relaxed')}>
                <option value="slim">Closer / Tailored</option>
                <option value="regular">Signature Regular</option>
                <option value="relaxed">Relaxed / Oversized</option>
              </select>
            </label>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <button type="button" className="button button--sm" onClick={calculateFit}>Suggest My Size</button>
            {suggested && (
              <p className="mono-label" style={{ color: 'var(--color-text)' }}>
                SUGGESTED SIZE: <strong style={{ fontSize: '1.125rem' }}>{suggested}</strong> (GUIDANCE)
              </p>
            )}
          </div>
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>
            Guidance based on standard Gridium shirting blocks. Compare flat chest width against a favorite shirt for exact precision.
          </p>
        </div>
      </div>
    </div>
  );
};

/* Slide-Out AJAX Cart Drawer */
interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartLineItem[];
  country: string;
  orderNote: string;
  onChangeNote: (note: string) => void;
  onUpdateQty: (key: string, qty: number) => void;
  onQuickAdd: (product: ShirtProduct, colorName: string, size: ShirtSize) => void;
  onNavigate: (route: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  items,
  country,
  orderNote,
  onChangeNote,
  onUpdateQty,
  onQuickAdd,
  onNavigate,
}) => {
  const [checkoutDone, setCheckoutDone] = useState(false);
  const subtotalUsd = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const threshold = 150;
  const remaining = Math.max(0, threshold - subtotalUsd);
  const progress = Math.min(100, Math.round((subtotalUsd / threshold) * 100));
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const inCartHandles = new Set(items.map((i) => i.product.handle));
  const upsells = SHIRTS.filter((s) => !inCartHandles.has(s.handle)).slice(0, 2);

  return (
    <div
      className="drawer-backdrop"
      aria-hidden={open ? 'false' : 'true'}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="drawer-panel drawer-panel--right">
        <div className="drawer-header">
          <span className="mono-label">YOUR BAG ({totalCount})</span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close bag">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="cart-shipping-bar">
          {remaining <= 0 ? (
            <span>Complimentary express shipping unlocked.</span>
          ) : (
            <span>
              Add <strong>{formatPrice(remaining, country)}</strong> more for complimentary express shipping.
            </span>
          )}
          <div className="cart-shipping-bar__track">
            <div className="cart-shipping-bar__fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="drawer-body">
          {checkoutDone && (
            <div className="form-status form-status--success">
              Demo Checkout Triggered — In Shopify, this submits straight to native encrypted `/checkout`.
            </div>
          )}

          {items.length === 0 ? (
            <div className="cart-empty">
              <p className="h4">Your bag is currently empty.</p>
              <p className="text-muted">Explore crisp organic poplins, 240 GSM jersey tees, and breathable European linens.</p>
              <button
                type="button"
                className="button"
                onClick={() => {
                  onClose();
                  onNavigate('collection:all');
                }}
              >
                Shop All Shirts
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {items.map((item) => {
                  const colorObj = item.product.colors.find((c) => c.name === item.colorName) || item.product.colors[0];
                  return (
                    <div key={item.key} className="cart-item">
                      <a
                        href={`#product/${item.product.handle}`}
                        className="cart-item__media"
                        onClick={(e) => {
                          e.preventDefault();
                          onClose();
                          onNavigate(`product:${item.product.handle}`);
                        }}
                      >
                        <img src={colorObj.image} alt={item.product.title} width={80} height={100} />
                      </a>
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
                            <button
                              type="button"
                              className="qty-stepper__btn"
                              onClick={() => onUpdateQty(item.key, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Icon name="minus" size={14} />
                            </button>
                            <span className="qty-stepper__input" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="qty-stepper__btn"
                              onClick={() => onUpdateQty(item.key, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Icon name="plus" size={14} />
                            </button>
                          </div>

                          <button type="button" className="cart-item__remove" onClick={() => onUpdateQty(item.key, 0)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {upsells.length > 0 && (
                <div className="cart-upsell">
                  <span className="mono-label">PAIR WITH</span>
                  {upsells.map((up) => (
                    <div key={up.id} className="cart-upsell__card">
                      <div className="cart-item__media">
                        <img src={up.colors[0].image} alt={up.title} width={56} height={70} />
                      </div>
                      <div>
                        <div className="cart-item__title" style={{ fontSize: '0.8125rem' }}>{up.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{formatPrice(up.price, country)}</div>
                      </div>
                      <button
                        type="button"
                        className="button button--secondary button--sm"
                        onClick={() => onQuickAdd(up, up.colors[0].name, 'M')}
                      >
                        + M
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <details className="accordion-item">
              <summary className="accordion-summary" style={{ minHeight: 38, paddingBlock: 6 }}>
                <span className="mono-label">ORDER / GIFT NOTE</span>
                <Icon name="plus" size={14} />
              </summary>
              <div className="accordion-content">
                <textarea
                  className="field__textarea"
                  style={{ minHeight: 68 }}
                  value={orderNote}
                  onChange={(e) => onChangeNote(e.target.value)}
                  placeholder="Add tailoring notes or gift enclosure instructions..."
                />
              </div>
            </details>

            <div className="cart-subtotal-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotalUsd, country)}</span>
            </div>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
              Shipping, duties, and applicable taxes calculated at checkout.
            </p>
            <button
              type="button"
              className="button button--full"
              onClick={() => {
                setCheckoutDone(true);
                setTimeout(() => setCheckoutDone(false), 3500);
              }}
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              className="button button--secondary button--full button--sm"
              onClick={() => {
                onClose();
                onNavigate('cart');
              }}
            >
              View Full Bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* Predictive Search Overlay */
export const PredictiveSearchModal: React.FC<{
  open: boolean;
  onClose: () => void;
  country: string;
  onSelectProduct: (handle: string) => void;
  onSelectCollection: (handle: string) => void;
}> = ({ open, onClose, country, onSelectProduct, onSelectCollection }) => {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setActiveIdx(-1);
    }
  }, [open]);

  const q = query.trim().toLowerCase();
  const matchedProducts = q.length >= 1
    ? SHIRTS.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.fabric.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q) ||
          s.colors.some((c) => c.name.toLowerCase().includes(q))
      ).slice(0, 4)
    : SHIRTS.slice(0, 4);

  const matchedCols = q.length >= 1
    ? COLLECTIONS.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    : COLLECTIONS.slice(0, 3);

  const suggestions = ['Oxford Shirt', '240 GSM Supima', 'Belgian Linen', 'Optic White'];

  return (
    <div
      className="search-overlay"
      aria-hidden={open ? 'false' : 'true'}
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalogue"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-overlay__panel">
        <div className="container">
          <form
            className="search-bar-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (matchedProducts[0]) {
                onClose();
                onSelectProduct(matchedProducts[0].handle);
              }
            }}
          >
            <Icon name="search" size={20} />
            <input
              ref={inputRef}
              type="search"
              className="search-bar-form__input"
              placeholder="Search Oxford, linen, heavyweight tee, navy..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIdx(-1);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActiveIdx((i) => (i + 1) % Math.max(1, matchedProducts.length));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActiveIdx((i) => (i - 1 + matchedProducts.length) % Math.max(1, matchedProducts.length));
                } else if (e.key === 'Enter' && activeIdx >= 0 && matchedProducts[activeIdx]) {
                  e.preventDefault();
                  onClose();
                  onSelectProduct(matchedProducts[activeIdx].handle);
                }
              }}
            />
            {query && (
              <button
                type="button"
                className="mono-label"
                style={{ background: 'none', border: 0, cursor: 'pointer' }}
                onClick={() => setQuery('')}
              >
                Clear
              </button>
            )}
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search">
              <Icon name="close" size={20} />
            </button>
          </form>

          <div className="predictive-results">
            <div className="predictive-results__cols">
              <div style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
                <div>
                  <span className="mono-label">SUGGESTIONS</span>
                  <ul style={{ display: 'grid', gap: 8, marginTop: 10 }}>
                    {suggestions.map((sug) => (
                      <li key={sug}>
                        <button
                          type="button"
                          className="link-underline"
                          style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', fontSize: '0.875rem' }}
                          onClick={() => setQuery(sug)}
                        >
                          {sug}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="mono-label">COLLECTIONS</span>
                  <ul style={{ display: 'grid', gap: 8, marginTop: 10 }}>
                    {matchedCols.map((col) => (
                      <li key={col.handle}>
                        <a
                          href={`#collection/${col.handle}`}
                          className="link-underline"
                          style={{ fontSize: '0.875rem' }}
                          onClick={(e) => {
                            e.preventDefault();
                            onClose();
                            onSelectCollection(col.handle);
                          }}
                        >
                          {col.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <span className="mono-label">SHIRTS ({matchedProducts.length})</span>
                {matchedProducts.length === 0 ? (
                  <p className="text-muted" style={{ marginTop: 12 }}>No shirts matched &ldquo;{query}&rdquo;.</p>
                ) : (
                  <div className="predictive-product-list" style={{ marginTop: 12 }}>
                    {matchedProducts.map((p, idx) => (
                      <a
                        key={p.id}
                        href={`#product/${p.handle}`}
                        className="predictive-item"
                        aria-selected={idx === activeIdx}
                        style={{ display: 'grid', gap: 8, padding: 6 }}
                        onClick={(e) => {
                          e.preventDefault();
                          onClose();
                          onSelectProduct(p.handle);
                        }}
                      >
                        <div className="product-card__media-wrap">
                          <img src={p.colors[0].image} alt={p.title} className="product-card__img" width={300} height={375} />
                        </div>
                        <span className="mono-label">{p.fit} · {p.fabric}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{p.title}</span>
                        <span className="price"><span className="price__regular">{formatPrice(p.price, country)}</span></span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
