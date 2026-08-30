import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import type { CartItem, Money, Product, ProductVariant } from "@shared/commerce/types";
import { FIT_MEASURES, getProductDetail, getProductGallery, getProductImage, matchesCollection } from "@shared/storefrontData";
import { clampPdpQuantity, getActivePdpAnchorId, getPdpSpecFields, PDP_ANCHORS, PDP_SIZE_HEADERS } from "@shared/pdp";
import { getDropCountdown, getDropLaunchState, getEmailSubmissionState } from "@shared/comingSoon";
import { ArrowRight, ArrowUpRight, ChevronDown, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";

const HERO_IMAGE = "/manus-storage/dos-caminos-hero_ff1bf96d.jpg";
const CAMPAIGN_HERO_IMAGE = "/manus-storage/campaign-hero-desktop-v3_953c1dfd.webp";
const MOBILE_CAMPAIGN_HERO_IMAGE = "/manus-storage/dos-caminos-campaign-hero-mobile-v2_64ada1c7.webp";
export const PRIMARY_WORDMARK_URL = "/manus-storage/dos-caminos-primary-lockup_1923c629.png";
export const DROP_01_TARGET_DATETIME_AMERICA_LOS_ANGELES = "2026-09-18T10:00:00-07:00";

function formatMoney(money?: Money | null) {
  if (!money) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: money.currencyCode, maximumFractionDigits: 0 }).format(Number(money.amount));
}

const BRAND_ICONS = {
  dosCaminos: "/manus-storage/01-dos-caminos_00a5cec5.svg",
  tresCerros: "/manus-storage/02-tres-cerros_f57525c1.svg",
  laPlaya: "/manus-storage/03-la-playa_698770e7.svg",
  lerma: "/manus-storage/04-lerma_0ab57783.svg",
  sello: "/manus-storage/05-sello_1e76fce4.svg",
  agave: "/manus-storage/06-agave_3131d6cb.svg",
  lavado: "/manus-storage/09-lavado_92d9a8de.svg",
} as const;

const BRAND_ICON_TONES = {
  cacao: "brightness(.55) sepia(.78) saturate(1.5) hue-rotate(336deg)",
  vermillion: "invert(41%) sepia(97%) saturate(1353%) hue-rotate(347deg) brightness(102%) contrast(90%)",
  ember: "invert(25%) sepia(83%) saturate(2191%) hue-rotate(358deg) brightness(87%) contrast(93%)",
  coral: "invert(61%) sepia(66%) saturate(577%) hue-rotate(331deg) brightness(103%) contrast(102%)",
} as const;

export const FOOTER_BRAND_MARKS = [
  { icon: "dosCaminos", label: "Dos Caminos mark", tone: "vermillion" },
  { icon: "tresCerros", label: "Tres Cerros mark", tone: "coral" },
  { icon: "laPlaya", label: "La Playa mark", tone: "ember" },
  { icon: "lerma", label: "Lerma mark", tone: "vermillion" },
  { icon: "sello", label: "Sello mark", tone: "coral" },
  { icon: "agave", label: "Agave mark", tone: "ember" },
  { icon: "lavado", label: "Lavado mark", tone: "vermillion" },
] as const;

function BrandIcon({ icon, label, size = 22, muted = false, tone = "cacao", decorative = false }: { icon: keyof typeof BRAND_ICONS; label: string; size?: number; muted?: boolean; tone?: keyof typeof BRAND_ICON_TONES; decorative?: boolean }) {
  return <img src={BRAND_ICONS[icon]} alt={decorative ? "" : label} aria-hidden={decorative || undefined} style={{ width: size, height: size, objectFit: "contain", opacity: muted ? 0.58 : 1, flex: "0 0 auto", filter: BRAND_ICON_TONES[tone] }} />;
}

function Header() {
  const [, setLocation] = useLocation();
  const [searching, setSearching] = useState(false);
  const [term, setTerm] = useState("");
  const { itemCount, openCart } = useCart();

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = term.trim();
    setSearching(false);
    setLocation(query ? `/collections/all?q=${encodeURIComponent(query)}` : "/collections/all");
  }

  return (
    <header className="site-header on-bone stable-header">
      <div className="announcement">NEXT DROP — SEPTEMBER 18, 10:00 AM PT</div>
      <div className="nav-frame">
        <Link href="/" className="wordmark" aria-label="Dos Caminos home" style={{ display: "inline-flex", alignItems: "center", width: "clamp(126px, 11vw, 158px)" }}><img src={PRIMARY_WORDMARK_URL} alt="Dos Caminos" /></Link>
        <nav className="main-nav" aria-label="Primary navigation">
          <Link href="/collections/blanks">BLANKS</Link>
          <Link href="/collections/archivo">ARCHIVO</Link>
          <Link href="/pages/fit">FIT</Link>
          <Link href="/pages/about">ABOUT</Link>
        </nav>
        <div className="nav-actions">
          <button className="icon-button" onClick={() => setSearching(value => !value)} aria-label="Search products" aria-expanded={searching}>
            {searching ? <X size={17} strokeWidth={1.7} /> : <Search size={17} strokeWidth={1.7} />}
          </button>
          <button className="cart-trigger" onClick={openCart} aria-label={`Open cart, ${itemCount} items`}>
            <ShoppingBag size={17} strokeWidth={1.7} />
            <span>({itemCount})</span>
          </button>
        </div>
      </div>
      {searching && (
        <form className="search-tray" onSubmit={onSearch} role="search">
          <label className="sr-only" htmlFor="site-search">Search product names</label>
          <input id="site-search" value={term} onChange={event => setTerm(event.target.value)} placeholder="SEARCH PRODUCT NAMES" autoFocus />
          <button type="submit" aria-label="Submit search"><ArrowRight size={18} strokeWidth={1.6} /></button>
        </form>
      )}
    </header>
  );
}

function Newsletter({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }
  return (
    <form className={`newsletter ${compact ? "newsletter-compact" : ""}`} onSubmit={submit}>
      {submitted ? <p className="newsletter-confirm">YOU’RE ON THE LIST.</p> : <>
        <label className="sr-only" htmlFor={compact ? "footer-email" : "drop-email"}>Email address</label>
        <input id={compact ? "footer-email" : "drop-email"} required type="email" placeholder="EMAIL ADDRESS" />
        <button type="submit" aria-label="Submit email"><ArrowRight size={18} strokeWidth={1.5} /></button>
      </>}
    </form>
  );
}

function FooterMarkRail() {
  return <div className="footer-mark-rail" aria-label="Dos Caminos brand marks">{FOOTER_BRAND_MARKS.map(mark => <BrandIcon key={mark.icon} icon={mark.icon} label={mark.label} size={37} tone={mark.tone} />)}</div>;
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-news"><p className="eyebrow">DROP NOTES</p><h2>IN THE KNOW, ONLY WHEN IT MATTERS</h2><Newsletter compact /></div>
    <div className="footer-links">
      <div><p className="footer-label">SHOP</p><Link href="/collections/blanks">Blanks</Link><Link href="/collections/archivo">Archivo</Link><Link href="/collections/all">Shop All</Link></div>
      <div><p className="footer-label">INFO</p><Link href="/pages/fit">Fit Guide</Link><a href="#care">Care</a><a href="#shipping">Shipping &amp; Returns</a></div>
      <div><p className="footer-label">COMPANY</p><Link href="/pages/about">About</Link><a href="mailto:hello@doscaminos.example">Contact</a><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></div>
    </div>
    <FooterMarkRail />
    <div className="footer-bottom"><span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><BrandIcon icon="dosCaminos" label="Dos Caminos mark" size={15} muted />© 2026 DOS CAMINOS</span><span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><BrandIcon icon="lavado" label="Care mark" size={15} muted />Ecuandureo, Michoacán · Est. 1562</span></div>
  </footer>;
}

function CartDrawer() {
  const { cart, isOpen, closeCart, loading, updateQuantity, removeItem, proceedToCheckout } = useCart();
  const items = cart?.items ?? [];
  return <>
    <div className={`cart-scrim ${isOpen ? "show" : ""}`} onClick={closeCart} aria-hidden="true" />
    <aside className={`cart-drawer ${isOpen ? "open" : ""}`} aria-label="Shopping cart" aria-hidden={!isOpen}>
      <div className="cart-drawer-head"><p className="eyebrow">YOUR CART</p><button className="icon-button" onClick={closeCart} aria-label="Close cart"><X size={19} strokeWidth={1.5} /></button></div>
      <div className="cart-items">
        {items.length === 0 ? <div className="empty-cart"><p>Your cart is empty.</p><Link href="/collections/all" onClick={closeCart}>SHOP THE DROP <ArrowUpRight size={15} /></Link></div> : items.map(item => <CartLine key={item.lineId} item={item} loading={loading} onUpdate={updateQuantity} onRemove={removeItem} />)}
      </div>
      <div className="cart-summary"><div><span>SUBTOTAL</span><strong>{formatMoney(cart?.subtotal)}</strong></div><button className="primary-button" onClick={proceedToCheckout} disabled={!items.length || loading}>CHECKOUT <ArrowUpRight size={16} /></button><p>Taxes and shipping calculated at checkout.</p></div>
    </aside>
  </>;
}

function CartLine({ item, loading, onUpdate, onRemove }: { item: CartItem; loading: boolean; onUpdate: (id: string, q: number) => Promise<void>; onRemove: (id: string) => Promise<void> }) {
  return <article className="cart-line"><img src={item.image?.url ?? getProductImage(item.productHandle)} alt="" /><div className="cart-line-detail"><div><h3>{item.productTitle}</h3>{item.variantTitle !== "Default Title" && <p>{item.variantTitle}</p>}<strong>{formatMoney(item.lineTotal)}</strong></div><div className="cart-line-actions"><div className="quantity-control"><button disabled={loading} onClick={() => onUpdate(item.lineId, item.quantity - 1)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.quantity}</span><button disabled={loading} onClick={() => onUpdate(item.lineId, item.quantity + 1)} aria-label="Increase quantity"><Plus size={13} /></button></div><button disabled={loading} className="text-button" onClick={() => onRemove(item.lineId)} aria-label={`Remove ${item.productTitle}`}><Trash2 size={15} /></button></div></div></article>;
}

function ProductCard({ product, archive = false }: { product: Product; archive?: boolean }) {
  const detail = getProductDetail(product.handle);
  const image = getProductImage(product.handle);
  return <Link href={`/products/${product.handle}`} className={`product-card ${archive ? "archivo-card" : ""}`}>
    <div className="product-image"><img src={image} alt={product.images[0]?.altText ?? product.title} loading="lazy" /></div>
    <div className="product-caption"><div><p className="product-line">{detail?.line ?? product.productType}</p><h3>{product.title}</h3></div><span>{formatMoney(product.priceRange.min)}</span></div>
  </Link>;
}

function ProductGrid({ products, archive = false }: { products: Product[]; archive?: boolean }) {
  if (!products.length) return <p className="collection-empty">Nothing is currently in this section.</p>;
  return <div className={`product-grid ${archive ? "tight-grid" : ""}`}>{products.map(product => <ProductCard key={product.id} product={product} archive={archive} />)}</div>;
}

export const CATALOG_UNAVAILABLE_COPY = "The catalog is temporarily unavailable. Please refresh the page or return shortly.";

function CatalogUnavailable() {
  return <div className="catalog-unavailable" role="status"><p className="eyebrow">CATALOG UPDATE</p><p>{CATALOG_UNAVAILABLE_COPY}</p><button type="button" className="inline-link" onClick={() => window.location.reload()}>REFRESH PAGE <ArrowRight size={15} /></button></div>;
}

function SectionHeading({ overline, title, href }: { overline: string; title: string; href: string }) {
  const icon = overline.includes("ARCHIVO") ? "sello" : "agave";
  const label = icon === "sello" ? "Archivo seal" : "Natural fiber mark";
  return <div className="section-heading"><div><div style={{ display: "flex", alignItems: "center", gap: 8 }}><BrandIcon icon={icon} label={label} size={20} muted={overline.includes("ARCHIVO")} /><p className="eyebrow">{overline}</p></div><h2>{title}</h2></div><Link href={href} className="inline-link">VIEW ALL <ArrowUpRight size={15} /></Link></div>;
}

export function ComingSoonBlock({ targetDatetime = DROP_01_TARGET_DATETIME_AMERICA_LOS_ANGELES }: { targetDatetime?: string }) {
  const [now, setNow] = useState(() => Date.now());
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSms, setShowSms] = useState(false);
  const countdown = getDropCountdown(targetDatetime, now);
  const launchState = getDropLaunchState(countdown);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(interval);
  }, []);

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submission = getEmailSubmissionState(email);
    setErrorMessage(submission.message);
    setFormStatus(submission.status);
    if (submission.status === "error") return;
    window.setTimeout(() => setFormStatus("success"), 650);
  }

  const units = [{ label: "DAYS", value: countdown.days }, { label: "HOURS", value: countdown.hours }, { label: "MINS", value: countdown.minutes }, { label: "SECS", value: countdown.seconds }];
  return <section className="coming-soon-block" aria-labelledby="drop-01-heading"><div className="coming-soon-inner"><p className="coming-soon-label">COMING SOON</p><h2 id="drop-01-heading" className="coming-soon-headline"><span>DROP</span><span>01</span></h2>{launchState ? <p className="coming-soon-live">{launchState.title}</p> : <div className="coming-soon-countdown" aria-label={`Drop 01 begins in ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, and ${countdown.seconds} seconds`}>{units.map(unit => <div className="coming-soon-unit" key={unit.label}><span className="coming-soon-number">{unit.value}</span><span className="coming-soon-unit-label">{unit.label}</span></div>)}</div>}<p className="coming-soon-details"><span>SEPTEMBER 18 · 10:00 AM PT</span><span>FADED CROP TEE — ARCHIVO NO. 01</span></p><div className="coming-soon-signup">{launchState ? <Link href={launchState.actionPath} className="primary-button">{launchState.actionLabel} <ArrowUpRight size={16} /></Link> : formStatus === "success" ? <p className="coming-soon-signup-success">You’re on the list.</p> : showSms ? <><div className="coming-soon-phone"><label className="sr-only" htmlFor="drop-phone">Phone number</label><input id="drop-phone" type="tel" placeholder="Phone number" disabled /></div><p className="coming-soon-sms-note">Text alerts coming soon — use email for now</p>{/* TCPA: wire to compliant SMS provider (Klaviyo SMS / Postscript / Attentive) before enabling. Do not collect numbers without express written consent. */}<label className="coming-soon-consent"><input type="checkbox" disabled /><span>Yes, text me about drops. Msg &amp; data rates may apply.<small>Msg frequency varies. Reply STOP to cancel, HELP for help.</small></span></label><button type="button" className="coming-soon-sms-toggle" onClick={() => setShowSms(false)}>Use email instead</button></> : <><form className="coming-soon-email-form" noValidate onSubmit={submitEmail}><label className="sr-only" htmlFor="drop-01-email">Email address</label><input id="drop-01-email" type="email" value={email} onChange={event => { setEmail(event.target.value); if (formStatus === "error") { setFormStatus("idle"); setErrorMessage(""); } }} placeholder="Email address" /><button className="coming-soon-notify-button" type="submit" disabled={formStatus === "loading"}>{formStatus === "loading" ? "..." : "NOTIFY ME"}</button></form><p className="coming-soon-form-message" role="status">{formStatus === "error" ? errorMessage : ""}</p><button type="button" className="coming-soon-sms-toggle" onClick={() => setShowSms(true)}>Get a text instead</button></>}</div><div className="coming-soon-icon-row" aria-hidden="true"><BrandIcon icon="tresCerros" label="" size={20} muted decorative /><BrandIcon icon="laPlaya" label="" size={20} muted decorative /><BrandIcon icon="lerma" label="" size={20} muted decorative /></div></div></section>;
}

export function HomePage() {
  const { data: products = [], isLoading, isError } = trpc.commerce.products.list.useQuery({ first: 12 });
  const blanks = products.filter(product => matchesCollection(product.productType, product.handle, "blanks"));
  const archivo = products.filter(product => matchesCollection(product.productType, product.handle, "archivo"));
  return <>
    <section className="hero campaign-hero"><picture><source media="(max-width: 699px)" srcSet={MOBILE_CAMPAIGN_HERO_IMAGE} /><img className="campaign-hero-media" src={CAMPAIGN_HERO_IMAGE} alt="Dos Caminos campaign at a shuttered storefront" /></picture><div className="hero-copy"><Link href="/collections/blanks" className="primary-button hero-cta">SHOP BLANKS <ArrowUpRight size={16} /></Link></div></section>
    <main>
      <ComingSoonBlock />
      <section className="catalog-section"><SectionHeading overline="01 / BLANKS" title="THE EVERYDAY TEE" href="/collections/blanks" />{isLoading ? <GridSkeleton /> : isError ? <CatalogUnavailable /> : <ProductGrid products={blanks} />}</section>
      <section className="catalog-section archivo-section"><SectionHeading overline="02 / ARCHIVO" title="ARCHIVO — ORIGINAL GRAPHICS" href="/collections/archivo" />{isLoading ? <GridSkeleton /> : isError ? <CatalogUnavailable /> : <ProductGrid products={archivo} archive />}</section>
      <FitStrip />
      <section className="email-block"><p className="eyebrow">DROP NOTIFICATIONS</p><h2>THE NEXT ONE,<br />IN YOUR INBOX</h2><p>New pieces and release time. Nothing else.</p><Newsletter /></section>
    </main>
  </>;
}

function GridSkeleton() { return <div className="product-grid" aria-label="Loading products"><div className="skeleton-card" /><div className="skeleton-card" /><div className="skeleton-card" /></div>; }

function FitStrip() { return <section className="fit-strip"><div className="fit-strip-title"><p className="eyebrow">FIT, IN NUMBERS</p><h2>CROPPED. FITTED.<br />MEASURED OPENLY</h2><Link href="/pages/fit" className="inline-link">VIEW FIT GUIDE <ArrowUpRight size={15} /></Link></div><div className="mini-measurements"><div className="measure-row measure-head"><span>SIZE</span><span>BODY</span><span>CHEST</span><span>SHOULDER</span></div>{FIT_MEASURES.map(row => <div className="measure-row" key={row.size}><span>{row.size}</span><span>{row.body}</span><span>{row.chest}</span><span>{row.shoulder}</span></div>)}</div></section>; }

export function CollectionPage({ collection }: { collection: "blanks" | "archivo" | "all" }) {
  const [location] = useLocation();
  const { data: products = [], isLoading, isError } = trpc.commerce.products.list.useQuery({ first: 50 });
  const query = new URLSearchParams(location.split("?")[1] ?? "").get("q")?.toLowerCase().trim() ?? "";
  const filtered = products.filter(product => matchesCollection(product.productType, product.handle, collection) && (!query || `${product.title} ${product.productType}`.toLowerCase().includes(query)));
  const heading = collection === "all" ? "ALL PIECES" : collection === "blanks" ? "BLANKS" : "ARCHIVO";
  const description = collection === "blanks" ? "Cropped, fitted blanks in washed color." : collection === "archivo" ? "Graphic studies, printed in ink." : "The current release.";
  return <main className={`inner-page collection-page ${collection === "archivo" ? "collection-archivo" : ""}`}><header className="page-intro"><p className="eyebrow">{collection === "archivo" ? "THE GRAPHIC LINE" : collection === "blanks" ? "THE CORE LINE" : "DOS CAMINOS"}</p><h1>{query ? `RESULTS FOR “${query.toUpperCase()}”` : heading}</h1><p>{description}</p></header>{isLoading ? <GridSkeleton /> : isError ? <CatalogUnavailable /> : <ProductGrid products={filtered} archive={collection === "archivo"} />}</main>;
}

function getSelectedVariant(product: Product, size: string | null): ProductVariant | undefined { return product.variants.find(variant => variant.selectedOptions.some(option => option.name.toLowerCase() === "size" && option.value === size)) ?? product.variants[0]; }

function PdpSectionAnchors() {
  const [active, setActive] = useState<(typeof PDP_ANCHORS)[number]["id"]>("description");
  useEffect(() => {
    const sections = PDP_ANCHORS.map(anchor => document.getElementById(anchor.id)).filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(entries => {
      const activeId = getActivePdpAnchorId(entries.map(entry => ({ id: entry.target.id, isIntersecting: entry.isIntersecting, top: entry.boundingClientRect.top })));
      if (activeId) setActive(activeId);
    }, { rootMargin: "-22% 0px -62% 0px", threshold: .05 });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <nav className="pdp-section-anchors" aria-label="Product page sections">{PDP_ANCHORS.map(anchor => <a key={anchor.id} href={`#${anchor.id}`} onClick={() => setActive(anchor.id)} className={active === anchor.id ? "active" : ""}>{anchor.label}</a>)}</nav>;
}

function PdpShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const shareData = { title, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); return; } catch { /* share sheet dismissal needs no fallback */ }
    }
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return <button type="button" className="pdp-share" onClick={share}>{copied ? "COPIED" : "SHARE"}</button>;
}

function PdpActionBar({ title, price, variant, quantity, onQuantityChange, loading, onAdd }: { title: string; price?: Money | null; variant?: ProductVariant; quantity: number; onQuantityChange: (quantity: number) => void; loading: boolean; onAdd: () => void }) {
  return <aside className="pdp-action-bar" aria-label="Add product to cart"><PdpShareButton title={title} /><div className="pdp-quantity-stepper" aria-label="Quantity"><button type="button" disabled={quantity <= 1} onClick={() => onQuantityChange(clampPdpQuantity(quantity - 1))} aria-label="Decrease quantity"><Minus size={14} /></button><span aria-live="polite">{quantity}</span><button type="button" disabled={quantity >= 99} onClick={() => onQuantityChange(clampPdpQuantity(quantity + 1))} aria-label="Increase quantity"><Plus size={14} /></button></div><button type="button" className="primary-button pdp-add-button" disabled={!variant?.availableForSale || loading} onClick={onAdd}>{!variant?.availableForSale ? "SOLD OUT" : loading ? "ADDING" : "ADD TO CART"}</button><strong className="pdp-action-price">{formatMoney(price)}</strong></aside>;
}

function PdpSizeTable() {
  return <div className="size-table-wrap"><table><caption className="sr-only">Crop Tee measurements</caption><thead><tr>{PDP_SIZE_HEADERS.map(header => <th key={header}>{header}</th>)}</tr></thead><tbody>{FIT_MEASURES.map(row => <tr key={row.size}><th>{row.size}</th><td>{row.body}</td><td>{row.chest}</td><td>{row.shoulder}</td><td>{row.sleeve}</td><td>{row.hem}</td></tr>)}</tbody></table></div>;
}

export function ProductPage() {
  const [, params] = useRoute("/products/:handle");
  const handle = params?.handle ?? "";
  const { data: product, isLoading, isError } = trpc.commerce.products.byHandle.useQuery({ handle }, { enabled: Boolean(handle) });
  const { addItem, loading } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => { if (product) setSize(product.options.find(option => option.name.toLowerCase() === "size")?.values[0] ?? null); }, [product]);
  if (isLoading) return <main className="inner-page product-page loading-page"><p className="eyebrow">LOADING PRODUCT</p></main>;
  if (isError || !product) return <NotFoundPage />;
  const detail = getProductDetail(product.handle);
  const variant = getSelectedVariant(product, size);
  const suppliedGallery = getProductGallery(product.handle);
  const gallery = (suppliedGallery.length ? suppliedGallery : [getProductImage(product.handle)]).map(url => ({ url, altText: product.title }));
  const sizes = product.options.find(option => option.name.toLowerCase() === "size")?.values ?? [];
  const specFields = getPdpSpecFields(detail?.location, detail?.fabric);
  const price = variant?.price ?? product.priceRange.min;
  return <main className="product-page pdp-page"><div className="pdp-gallery-shell"><PdpSectionAnchors /><div className="product-gallery">{gallery.slice(0, 6).map((image, index) => <div className={`gallery-image gallery-${index + 1}`} key={`${image.url}-${index}`}><img src={image.url} alt={index === 0 ? image.altText ?? product.title : ""} /></div>)}</div></div><section className="product-info pdp-info"><p className="eyebrow">{detail?.line ?? product.productType}</p><h1 className="pdp-title">{product.title}</h1><div className="pdp-spec-fields">{specFields.map(field => <div key={field.label}><span>{field.label}</span><p>{field.value}</p></div>)}</div><section id="description" className="pdp-content-section"><p className="pdp-section-label">DESCRIPTION</p><p className="pdp-description">{detail?.note ?? product.description}</p>{sizes.length > 0 && <fieldset className="pdp-size-selector"><legend>SELECT SIZE</legend><div>{sizes.map(value => <button key={value} type="button" onClick={() => setSize(value)} className={size === value ? "selected" : ""} aria-pressed={size === value}>{value}</button>)}</div></fieldset>}</section><section id="product-details" className="pdp-content-section"><p className="pdp-section-label">PRODUCT DETAILS</p><div className="pdp-product-specs"><div><span>FABRIC</span><p>{detail?.fabric ?? "100% Cotton"}</p></div><div><span>MAKE</span><p>{detail?.location ?? "Los Angeles, CA"}</p></div><div><span>CARE</span><p>{detail?.care ?? "Cold wash, inside out. Hang dry."}</p></div><div><span>MODEL</span><p>{detail?.model ?? "Model is 5'6\" and wears a size S."}</p></div></div></section><section id="size-chart" className="pdp-content-section pdp-size-chart"><p className="pdp-section-label">SIZE CHART</p><PdpSizeTable /><p className="pdp-chart-note">Garment measured flat, in inches.</p><p className="pdp-chart-note">Each garment is washed individually. Expect natural variation in color and finish between pieces.</p></section></section><PdpActionBar title={product.title} price={price} variant={variant} quantity={quantity} onQuantityChange={setQuantity} loading={loading} onAdd={() => variant && addItem(variant.id, quantity)} /></main>;
}

export function FitPage() { return <main className="inner-page fit-page"><header className="page-intro"><p className="eyebrow">THE CUT</p><h1>FIT GUIDE</h1><p>Measurements are taken flat. Double chest and hem width for the full circumference.</p></header><div className="fit-layout"><aside><p className="eyebrow">CROP TEE</p><p>Short in body. Easy through the chest. A clean shoulder line.</p><p>Take your usual size for the intended fit. Size up for more room.</p></aside><SizeTable /><div className="measure-notes"><p className="eyebrow">HOW WE MEASURE</p><div><span>01</span><p>Body length is from high point shoulder to hem.</p></div><div><span>02</span><p>Chest is measured 1 in below the armhole, flat.</p></div><div><span>03</span><p>Shoulder is seam to seam, across the back.</p></div></div></div></main>; }

function SizeTable({ compact = false }: { compact?: boolean }) { return <div className={`size-table-wrap ${compact ? "compact-size-table" : ""}`}><table><caption className="sr-only">Crop Tee measurements</caption><thead><tr><th>SIZE</th><th>BODY</th><th>CHEST</th><th>SHOULDER</th>{!compact && <><th>SLEEVE</th><th>HEM</th></>}</tr></thead><tbody>{FIT_MEASURES.map(row => <tr key={row.size}><th>{row.size}</th><td>{row.body}</td><td>{row.chest}</td><td>{row.shoulder}</td>{!compact && <><td>{row.sleeve}</td><td>{row.hem}</td></>}</tr>)}</tbody></table></div>; }

export function AboutPage() { return <main className="inner-page about-page"><header className="page-intro"><p className="eyebrow">DOS CAMINOS</p><h1>MADE FOR<br />THE REPEAT</h1></header><div className="about-grid"><div className="about-photo"><img src={HERO_IMAGE} alt="A faded blue-gray tee in a quiet sunlit studio" /></div><div className="about-copy"><p>Dos Caminos makes pieces for the parts of a wardrobe that get lived in. The starting point is a cropped, fitted tee in washed cotton: simple enough to reach for without thinking, specific enough to keep.</p><p>Blanks keep the form quiet. Archivo gives it a different surface—small graphic studies with the same worn-in hand. Everything is made to be worn often, washed cold, and kept close.</p><p>No more than needed.</p></div></div></main>; }

export function CartPage() { const { cart, loading, updateQuantity, removeItem, proceedToCheckout } = useCart(); const items = cart?.items ?? []; return <main className="inner-page cart-page"><header className="page-intro"><p className="eyebrow">YOUR SELECTION</p><h1>CART</h1></header>{items.length === 0 ? <div className="cart-page-empty"><p>Your cart is empty.</p><Link href="/collections/all" className="inline-link">SHOP THE DROP <ArrowUpRight size={15} /></Link></div> : <div className="cart-page-grid"><section>{items.map(item => <CartLine key={item.lineId} item={item} loading={loading} onUpdate={updateQuantity} onRemove={removeItem} />)}</section><aside className="cart-page-summary"><div><span>SUBTOTAL</span><strong>{formatMoney(cart?.subtotal)}</strong></div><button onClick={proceedToCheckout} disabled={loading} className="primary-button">CHECKOUT <ArrowUpRight size={16} /></button><p>Taxes and shipping calculated at checkout.</p></aside></div>}</main>; }

export function NotFoundPage() { return <main className="inner-page not-found"><p className="eyebrow">404</p><h1>NOT FOUND</h1><Link href="/" className="primary-button">BACK HOME <ArrowRight size={16} /></Link></main>; }

export function scrollToPageTop(target: Pick<Window, "scrollTo"> | undefined = typeof window === "undefined" ? undefined : window) {
  target?.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { scrollToPageTop(); }, [location]);
  return null;
}

export function StorefrontLayout({ children }: { children: React.ReactNode }) { return <div className="site-shell"><ScrollToTop /><Header />{children}<Footer /><CartDrawer /></div>; }
