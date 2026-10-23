import React, { useEffect, useRef } from 'react';
import { STUDIO_MEDIA } from '../data/shirts';

interface AboutPageProps {
  navigate: (route: string) => void;
}

const STATS = [
  { value: '22', label: 'STITCHES PER INCH', caption: 'Single-needle lockstitch across every side seam.' },
  { value: '04', label: 'MILL PARTNERS', caption: 'Portugal, Belgium, Italy and Japan — visited twice yearly.' },
  { value: '2016', label: 'FOUNDED IN', caption: 'One Oxford block, drafted in a Brooklyn studio.' },
  { value: '0%', label: 'PLASTIC PACKAGING', caption: 'FSC-certified board, glassine and paper tape only.' },
];

const PRINCIPLES = [
  { title: 'Proportion before decoration', text: 'Silhouette is resolved on the pattern table. Trims come last, and only if they earn their place.' },
  { title: 'Materials with a paper trail', text: 'Every yarn has a mill, a batch number and a certification we can name out loud.' },
  { title: 'Repair before replace', text: 'Buttons, interlinings and collar stock are held for a decade so a shirt can outlive a trend cycle.' },
];

const CHAPTERS = [
  { year: '2016', place: 'BROOKLYN, NY', title: 'The first Oxford block', text: "Built from a tailor's reference shirt and re-graded eleven times until the shoulder stopped pulling forward." },
  { year: '2018', place: 'PORTO, PT', title: 'The first mill partnership', text: 'Somelos wove our two-ply poplin at a volume small enough that we could reject an entire run over one crooked placket.' },
  { year: '2020', place: 'GHENT, BE', title: 'Belgian flax, traced', text: 'Masters of Linen® certification arrived with a paper trail we could publish — so we published it, lot by lot.' },
  { year: '2023', place: 'PORTO, PT', title: 'The atelier opens', text: 'Cutting and finishing moved under one roof so we could control the seams customers actually feel.' },
  { year: '2026', place: 'NEW YORK, NY', title: 'Repairs, in perpetuity', text: 'Buttons, interlinings and collar stock are now held for ten years. A shirt should never become waste because one stitch failed.' },
];

const STEPS = [
  { title: 'Yarn & weaving', meta: 'PT · 21 DAYS', spec: '130 GSM · TWO-PLY · OEKO-TEX® 100', text: 'Long-staple cotton is spun and woven in a single mill so the lot can be traced from bale to bolt. We test shrinkage after five washes before any fabric is approved.' },
  { title: 'Pattern & cutting', meta: 'ATELIER · 9 DAYS', spec: '38 BLOCKS · 6 FITS', text: 'Every block is drafted in-house and graded across six sizes. Cutters work in short runs so a crooked panel is caught in the room, not in the warehouse.' },
  { title: 'Sewing & finishing', meta: 'ATELIER · 41 DAYS', spec: '22 SPI · 3.2MM MOTHER-OF-PEARL', text: 'Collars are single-needle set and left unfused. Buttons are whipped onto thermally locked shanks so they flex instead of cracking.' },
  { title: 'Inspection & archive', meta: 'NY · 23 DAYS', spec: '100% HAND-CHECKED · 10-YEAR REPAIR STOCK', text: 'Two people check each shirt against the master sample. Pattern, fabric lot and machine operator are logged into the archive.' },
];

const MATERIALS = [
  { title: 'Two-ply Portuguese poplin', description: 'High-twist long-staple cotton with a dry, quiet hand. Holds a crease through a full day of meetings.', mill: 'Somelos · PT', weight: '130 GSM', care: 'Cold wash · warm iron', tag: 'OEKO-TEX® 100', swatch: '#EDEAE3' },
  { title: 'Washed Oxford cloth', description: 'Basket-woven and garment-washed until the collar rolls unfused and soft. Our most reordered shirt.', mill: 'Albini · IT', weight: '145 GSM', care: 'Machine wash · hang dry', tag: 'ORGANIC COTTON', swatch: '#DCD9D1' },
  { title: 'Belgian flax linen', description: 'Rain-fed flax, wet-spun for a dry touch that softens with wear instead of thinning out.', mill: 'Libeco · BE', weight: '165 GSM', care: 'Cold wash · line dry', tag: 'MASTERS OF LINEN®', swatch: '#C9C6B9' },
  { title: '240 GSM Supima jersey', description: 'Long-staple American Supima, compact-spun for opacity and a dense, structured drape.', mill: 'Kurabo · JP', weight: '240 GSM', care: 'Cold wash · tumble low', tag: 'SUPIMA®', swatch: '#F4F3EF' },
];

const TEAM = [
  { role: 'HEAD OF PATTERN ARCHITECTURE', name: 'Lukas Lindqvist', bio: '18 years drafting bespoke and ready-to-wear shirting blocks across Stockholm and Porto. Signs off every collar roll.', img: STUDIO_MEDIA.modelMonoShirt },
  { role: 'DIRECTOR OF TEXTILES', name: 'Clara Monteiro', bio: 'Textile engineer specialising in high-twist organic poplins, mercerised knits and enzyme washes. Owns the mill relationships.', img: STUDIO_MEDIA.modelPoisedBW },
  { role: 'CREATIVE & STUDIO LEAD', name: 'Julian Vance', bio: 'Industrial designer focused on calm wardrobe systems and zero-excess garment detailing. Runs the New York studio.', img: STUDIO_MEDIA.modelStudioCasual },
];

const FAQS = [
  { q: 'Why do you only make shirts?', a: 'Because a category is a craft. Splitting attention across trousers, knitwear and outerwear would mean abandoning the pattern revisions that make our collars sit correctly. One category, held to one standard.' },
  { q: 'Where is a Gridium shirt made?', a: 'Fabric is woven by our partner mills in Portugal, Belgium, Italy and Japan. Cutting, sewing and finishing happen in our own atelier in Porto, with final inspection in New York.' },
  { q: 'Do you repair shirts after purchase?', a: 'Yes. Repairs are free within the first year and at cost afterwards, for as long as we hold stock of the component. Send a note to the studio with your order number.' },
  { q: 'Can I visit the studio?', a: 'The New York studio is open by appointment, Monday to Friday. Fittings include a comparison against three adjacent sizes so you leave knowing your block, not guessing at it.' },
];

function Marquee({ words }: { words: string[] }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((pass) => (
          <React.Fragment key={pass}>
            {words.map((word) => (
              <span key={`${pass}-${word}`} className="marquee__item">{word}</span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function AboutPage({ navigate }: AboutPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="has-motion" ref={rootRef}>
      <nav className="breadcrumbs" aria-label="Breadcrumbs">
        <div className="container">
          <ol className="breadcrumbs__list mono-label">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a></li>
            <li className="breadcrumbs__sep">/</li>
            <li aria-current="page">About the house</li>
          </ol>
        </div>
      </nav>

      {/* 01 — Editorial hero */}
      <section className="about-hero color-paper">
        <div className="container about-hero__inner">
          <div className="about-hero__copy">
            <p className="eyebrow" data-reveal>01 / THE HOUSE OF GRIDIUM</p>
            <h1 className="display-xl about-hero__title" data-reveal data-reveal-delay="1">
              A shirting house built on
              <span className="about-hero__accent">measurement, not mood.</span>
            </h1>
            <p className="text-lead about-hero__lead" data-reveal data-reveal-delay="2">
              Gridium is an independent shirting atelier. We design and manufacture a deliberately small catalogue of Oxfords,
              poplins, linens and knits — each pattern revised over years, not seasons, with family-owned European mills we visit in person.
            </p>
            <div className="about-hero__actions" data-reveal data-reveal-delay="3">
              <button type="button" className="button" onClick={() => navigate('collection:all')}>
                Shop the Collection
              </button>
              <button type="button" className="button button--secondary" onClick={() => { document.getElementById('about-manifesto')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Read the manifesto
              </button>
            </div>
          </div>

          <figure className="about-hero__media" data-reveal data-reveal-media>
            <div className="about-hero__frame">
              <img src={STUDIO_MEDIA.atelierPatterns} alt="Pattern table inside the Gridium atelier" width={900} height={1125} loading="eager" />
            </div>
            <figcaption className="about-hero__card">
              <span className="mono-label">ATELIER NOTE 001</span>
              <p className="h4">Pattern table, Porto — 07:40</p>
              <span className="spec-row__item">38 BLOCKS · 6 FITS · 1 STANDARD</span>
            </figcaption>
          </figure>
        </div>

        <div className="container">
          <div className="about-stats">
            {STATS.map((stat, index) => (
              <div className="about-stat" key={stat.label} data-reveal data-reveal-delay={index + 1}>
                <span className="about-stat__value">{stat.value}</span>
                <span className="about-stat__label">{stat.label}</span>
                <p className="about-stat__caption">{stat.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — Manifesto */}
      <section className="about-manifesto color-paper" id="about-manifesto">
        <div className="container">
          <div className="about-manifesto__head" data-reveal>
            <span className="mono-label">02 / MANIFESTO</span>
            <span className="section-index">WRITTEN IN PORTO · REVISED 2026</span>
          </div>

          <blockquote className="about-manifesto__quote" data-reveal data-reveal-delay="1">
            <p>We are not interested in reinventing the shirt every season. We are interested in the eleventh revision of the same collar.</p>
            <footer className="about-manifesto__signature">
              <span className="about-manifesto__rule" aria-hidden="true" />
              <span>Lukas Lindqvist &amp; Clara Monteiro</span>
              <span className="text-muted">Founders, Gridium</span>
            </footer>
          </blockquote>

          <div className="about-manifesto__body">
            <div className="about-manifesto__column" data-reveal>
              <h2 className="h4">Why so few styles</h2>
              <div className="rte">
                <p>A wardrobe is a system, not a feed. When a shape is right — the shoulder sits where your arm actually pivots, the hem clears the hip at the correct angle — newness stops being the point. So we keep one shirt block per silhouette and spend the year improving it instead of replacing it.</p>
                <p>The catalogue grows only when a fabric demands a new block. That is why there are six shirts here and not sixty.</p>
              </div>
            </div>
            <div className="about-manifesto__column" data-reveal data-reveal-delay="1">
              <h2 className="h4">How we manufacture</h2>
              <div className="rte">
                <p>Our weaving partners are family-run mills in Portugal, Belgium and Italy that we pay directly, on time, at volumes small enough to keep quality accountable. Every run is cut in a single atelier, checked by hand, and released only when the collar rolls the way the sample did.</p>
                <p>Nothing is outsourced to an agent we have not met. If a lot fails inspection, it does not become a sale — it becomes a note on the wall.</p>
              </div>
            </div>
          </div>

          <ul className="about-principles">
            {PRINCIPLES.map((principle, index) => (
              <li className="about-principle" key={principle.title} data-reveal data-reveal-delay={index + 1}>
                <span className="about-principle__index">0{index + 1}</span>
                <h3 className="about-principle__title">{principle.title}</h3>
                <p className="about-principle__text">{principle.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="about-manifesto__ticker">
          <Marquee words={['MEASURE TWICE', 'CUT ONCE', '22 STITCHES PER INCH', 'NO SEASONAL NOISE', 'REPAIR BEFORE REPLACE', 'MILL-FIRST SOURCING', 'MADE TO BE REWORN']} />
        </div>
      </section>

      {/* 03 — Statement & values */}
      <section className="about-story color-stone section-pad section-border-bottom">
        <div className="container">
          <div className="about-story__head">
            <div className="about-story__statement" data-reveal>
              <span className="eyebrow">03 / WHY WE EXIST</span>
              <h2 className="display-xl">One garment category. Perfected without noise.</h2>
            </div>
            <div className="about-story__lead" data-reveal data-reveal-delay="1">
              <p className="text-lead">
                Gridium began with a frustration: shirts that photographed well and behaved badly after the fourth wash. So we built a studio
                around the parts nobody sees — seam allowance, interlining, button shank.
              </p>
              <p className="text-muted text-small">
                Ten years later the method has not changed. Fewer styles, better patterns, and a mill relationship that survives a bad season.
              </p>
            </div>
          </div>

          <div className="about-story__values">
            <div className="about-story__values-head" data-reveal>
              <span className="mono-label">DESIGN PRINCIPLES</span>
              <span className="section-index">APPLIED TO EVERY BLOCK SINCE 2016</span>
            </div>
            <ul className="about-principles">
              {[
                { title: 'Architectural pattern discipline', text: 'Every block is drafted in-house with high, pitched armholes for clean chest lines and unrestricted reach — graded across six sizes, never scaled from a medium.' },
                { title: 'Unfused soft collar roll', text: 'We avoid rigid synthetic fusing so collars frame the neck naturally, whether buttoned under tailoring or worn open on a Saturday.' },
                { title: 'Permanent archive over trends', text: 'Core silhouettes stay in production year-round, so you can reorder your exact block in a new seasonal fabric without re-learning your size.' },
              ].map((value, index) => (
                <li className="about-principle" key={value.title} data-reveal data-reveal-delay={index + 1}>
                  <span className="about-principle__index">0{index + 1}</span>
                  <h3 className="about-principle__title">{value.title}</h3>
                  <p className="about-principle__text">{value.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 04 — Timeline */}
      <section className="about-timeline color-paper">
        <div className="container">
          <div className="about-timeline__layout">
            <div className="about-timeline__aside">
              <div className="about-timeline__sticky" data-reveal>
                <span className="mono-label">04 / HOUSE HISTORY</span>
                <h2>Ten years, six blocks, one standard.</h2>
                <p className="text-muted text-small">
                  We grew slowly on purpose. Each chapter below marks a decision that narrowed the catalogue rather than widened it.
                </p>
                <p className="spec-row__item about-timeline__footnote">ARCHIVE: EVERY SAMPLE SINCE 2016 IS KEPT ON SITE.</p>
              </div>
            </div>

            <ol className="about-timeline__list">
              {CHAPTERS.map((chapter, index) => (
                <li className="about-chapter" key={chapter.year} data-reveal data-reveal-delay={index + 1}>
                  <span className="about-chapter__dot" aria-hidden="true" />
                  <div className="about-chapter__meta">
                    <span className="about-chapter__year">{chapter.year}</span>
                    <span className="about-chapter__place">{chapter.place}</span>
                  </div>
                  <div className="about-chapter__body">
                    <h3 className="h4">{chapter.title}</h3>
                    <p>{chapter.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 05 — Craft process */}
      <section className="about-craft color-paper">
        <div className="container">
          <div className="section-header" data-reveal>
            <div className="section-header__titles">
              <span className="mono-label">05 / THE PROCESS</span>
              <h2>Four stages between yarn and wardrobe.</h2>
            </div>
            <p className="spec-row__item">AVG. LEAD TIME: 94 DAYS</p>
          </div>

          <div className="about-craft__layout">
            <div className="about-craft__steps">
              {STEPS.map((step, index) => (
                <details className="about-step" key={step.title} open={index === 0}>
                  <summary className="about-step__summary">
                    <span className="about-step__index">0{index + 1}</span>
                    <span className="about-step__title">{step.title}</span>
                    <span className="about-step__meta">{step.meta}</span>
                    <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>
                  <div className="about-step__panel">
                    <p>{step.text}</p>
                    <p className="chip">{step.spec}</p>
                  </div>
                </details>
              ))}
            </div>

            <figure className="about-craft__stage" data-reveal data-reveal-media>
              <div className="about-craft__stage-inner">
                <img src={STUDIO_MEDIA.textileRolls} alt="Rolls of shirting fabric in the mill archive" width={800} height={1000} loading="lazy" />
              </div>
              <figcaption className="mono-label">FIG. 05 — SINGLE-NEEDLE COLLAR CONSTRUCTION, PORTO</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 06 — Materials */}
      <section className="about-materials color-stone">
        <div className="container">
          <div className="section-header" data-reveal>
            <div className="section-header__titles">
              <span className="mono-label">06 / THE MATERIAL LIBRARY</span>
              <h2>Four fabrics. Chosen for how they age.</h2>
            </div>
            <button type="button" className="link-arrow" style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }} onClick={() => navigate('collection:all')}>
              Shop by fabric
            </button>
          </div>

          <div className="material-grid">
            {MATERIALS.map((material, index) => (
              <article className="material-card" key={material.title} data-reveal data-reveal-delay={index + 1}>
                <div className="material-card__top">
                  <span className="material-card__swatch" style={{ ['--swatch-color' as string]: material.swatch }} aria-hidden="true" />
                  <span className="section-index">0{index + 1}</span>
                </div>
                <h3 className="material-card__title">{material.title}</h3>
                <p className="material-card__description">{material.description}</p>
                <dl className="material-card__specs">
                  <div><dt>Mill</dt><dd>{material.mill}</dd></div>
                  <div><dt>Weight</dt><dd>{material.weight}</dd></div>
                  <div><dt>Care</dt><dd>{material.care}</dd></div>
                </dl>
                <span className="chip material-card__tag">{material.tag}</span>
              </article>
            ))}
          </div>
          <p className="spec-row__item about-materials__footnote" data-reveal>
            ALL FABRICS ARE CERTIFIED GOTS ORGANIC OR MASTERS OF LINEN® · MILL ORIGIN LISTED PER LOT
          </p>
        </div>
      </section>

      {/* 07 — People */}
      <section className="about-team section-pad section-border-bottom color-paper">
        <div className="container">
          <div className="section-header" data-reveal>
            <div className="section-header__titles">
              <span className="mono-label">07 / THE PEOPLE</span>
              <h2>Patternmakers, weavers, and one very patient machinist.</h2>
              <p className="text-muted text-small" style={{ maxWidth: '52ch' }}>
                Eleven people work on the Gridium catalogue. These are the three who sign off on a shirt before it ships.
              </p>
            </div>
            <p className="spec-row__item">TEAM: 11 · ATELIER: PORTO + NEW YORK</p>
          </div>

          <div className="team-grid">
            {TEAM.map((member, index) => (
              <article className="team-card" key={member.name} data-reveal data-reveal-delay={index + 1}>
                <div className="team-card__media">
                  <img className="team-card__img" src={member.img} alt={member.name} width={700} height={875} loading="lazy" />
                  <span className="team-card__index">0{index + 1}</span>
                </div>
                <div className="team-card__body">
                  <span className="mono-label team-card__role">{member.role}</span>
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__bio">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="about-team__cta" data-reveal>
            <div className="about-team__cta-copy">
              <span className="mono-label">NEXT STEP</span>
              <h3 className="h2">Inspect the current shirting collection.</h3>
            </div>
            <div className="about-team__cta-actions">
              <button type="button" className="button" onClick={() => navigate('collection:all')}>Explore all shirts</button>
              <button type="button" className="button button--secondary" onClick={() => navigate('contact')}>Talk to the studio</button>
            </div>
          </div>
        </div>
      </section>

      {/* 08 — FAQ */}
      <section className="section-pad section-border-bottom color-paper">
        <div className="container">
          <div className="section-header" data-reveal>
            <div className="section-header__titles">
              <span className="mono-label">08 / QUESTIONS</span>
              <h2>What people ask before their first order</h2>
              <p className="text-muted text-small">Sizing, provenance and care — answered plainly.</p>
            </div>
          </div>
          <div data-reveal>
            {FAQS.map((faq) => (
              <details className="accordion-item" key={faq.q}>
                <summary className="accordion-summary">
                  <span>{faq.q}</span>
                  <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <div className="accordion-content rte"><p>{faq.a}</p></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — Closing CTA */}
      <section className="about-cta color-midnight">
        <div className="container">
          <div className="about-cta__head">
            <div className="about-cta__copy" data-reveal>
              <span className="eyebrow">09 / VISIT THE STUDIO</span>
              <h2 className="display-xl">Come see the seam allowance.</h2>
              <p className="text-lead">
                Our New York studio keeps every sample since 2016 on the wall. Appointments are free, unhurried, and include a fitting
                against three adjacent sizes.
              </p>
              <div className="about-cta__actions">
                <button type="button" className="button" onClick={() => navigate('collection:all')}>Shop the Collection</button>
                <button type="button" className="button button--secondary" onClick={() => navigate('contact')}>Book a fitting</button>
              </div>
            </div>
            <div className="about-cta__media" data-reveal data-reveal-media>
              <img src={STUDIO_MEDIA.rackMinimal} alt="Garment rack in the Gridium studio" width={900} height={720} loading="lazy" />
            </div>
          </div>

          <div className="about-cta__contacts">
            {[
              { label: 'STUDIO', value: '48 Mercer Street, Floor 3', note: 'New York, NY 10013' },
              { label: 'HOURS', value: 'Mon–Fri · 09:00–18:00 EST', note: 'Saturday by appointment' },
              { label: 'CONCIERGE', value: 'studio@gridium.com', note: 'Replies within one business day' },
              { label: 'CARE & REPAIRS', value: 'Repair form', note: 'Free within the first year' },
            ].map((item, index) => (
              <div className="about-cta__contact" key={item.label} data-reveal data-reveal-delay={index + 1}>
                <span className="mono-label">{item.label}</span>
                <span className="about-cta__value">{item.value}</span>
                <span className="about-cta__note">{item.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
