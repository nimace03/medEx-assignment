"use client";

import { useMemo, useState } from "react";
import catalog from "@/data/task1-service-explorer.json";

type Category = { id: string; title: string; type: string; status: boolean };
type Provider = { id: number; name: string; status: string; providerInformation: { city: { name: string }; currency: string; rating: number | null } };
type Service = { id: string; title: string; type: string; userId: number; categoryId: string; price: string | null; discount: string | null; discountType: "amount" | "percent" | null; status: boolean; testAtHome: boolean; wellnessPricing: { durationInMinutes: number; price: string; discount: string; discountType: "amount" | "percent" }[] };

const data = catalog as unknown as { categories: Category[]; providers: Provider[]; services: Service[] };

const label: Record<string, string> = { package: "Health package", lab_test: "Lab test", service: "Treatment", wellness: "Wellness", insurance: "Insurance" };
const priceOf = (service: Service) => Number(service.price ?? service.wellnessPricing[0]?.price ?? 0);
const salePrice = (service: Service) => {
  const price = priceOf(service);
  const discount = Number(service.discount ?? service.wellnessPricing[0]?.discount ?? 0);
  const type = service.discountType ?? service.wellnessPricing[0]?.discountType;
  return type === "percent" ? price * (1 - discount / 100) : Math.max(0, price - discount);
};
const money = (value: number, currency: string) => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

export default function ServiceExplorer() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [location, setLocation] = useState("all");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [homeOnly, setHomeOnly] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const providers = useMemo(() => new Map(data.providers.filter((item) => item.status === "active").map((item) => [item.id, item])), []);
  const categories = useMemo(() => data.categories.filter((item) => item.status), []);
  const locations = useMemo(() => Array.from(new Set([...providers.values()].map((item) => item.providerInformation.city.name))).sort(), [providers]);
  const results = useMemo(() => {
    const term = query.toLowerCase().trim();
    return data.services.map((service) => ({ service, provider: providers.get(service.userId), category: categories.find((item) => item.id === service.categoryId) }))
      .filter((item) => item.service.status && item.provider && item.category)
      .filter(({ service, provider, category }) => (!term || [service.title, provider!.name, category!.title].some((value) => value.toLowerCase().includes(term))) && (categoryId === "all" || service.categoryId === categoryId) && (location === "all" || provider!.providerInformation.city.name === location) && priceOf(service) <= maxPrice && (!homeOnly || service.testAtHome))
      .sort((a, b) => sort === "price-low" ? salePrice(a.service) - salePrice(b.service) : sort === "price-high" ? salePrice(b.service) - salePrice(a.service) : (b.provider!.providerInformation.rating ?? 0) - (a.provider!.providerInformation.rating ?? 0));
  }, [categories, categoryId, homeOnly, location, maxPrice, providers, query, sort]);

  const reset = () => { setQuery(""); setCategoryId("all"); setLocation("all"); setMaxPrice(50000); setHomeOnly(false); setSort("recommended"); };
  const activeFilters = Number(categoryId !== "all") + Number(location !== "all") + Number(maxPrice !== 50000) + Number(homeOnly);

  return <main className="explorer-shell">
    <section className="explorer-hero"><div className="explorer-container hero-copy">
      <span className="eyebrow">MEDICAL SERVICES, MADE SIMPLE</span><h1>Find care that fits your life.</h1><p>Compare trusted providers, prices, and appointment options in one place.</p>
      <label className="search-box"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" /></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services, providers, or specialties" /><kbd>⌘ K</kbd></label>
      <div className="popular-searches"><span>Popular:</span>{["Health check-up", "Blood test", "Dental care"].map((term) => <button key={term} onClick={() => setQuery(term)}>{term}</button>)}</div>
    </div></section>
    <section className="explorer-container explorer-content">
      <div className="section-heading"><div><span className="eyebrow">EXPLORE BY CATEGORY</span><h2>What are you looking for?</h2></div><button className="text-button" onClick={() => setCategoryId("all")}>View all categories →</button></div>
      <div className="category-row"><button className={`category-card ${categoryId === "all" ? "is-selected" : ""}`} onClick={() => setCategoryId("all")}><span className="category-icon">✦</span>All services</button>{categories.slice(0, 7).map((category, index) => <button key={category.id} className={`category-card category-${index} ${categoryId === category.id ? "is-selected" : ""}`} onClick={() => setCategoryId(category.id)}><span className="category-icon">{["♡", "⌁", "⌖", "☼", "◌", "◈", "✣"][index]}</span>{category.title}</button>)}</div>
      <div className="results-layout">
        <aside className={`filters ${filtersOpen ? "is-open" : ""}`}><div className="filter-heading"><h3>Filters</h3><button onClick={reset}>Clear all</button></div>
          <label className="filter-label">Location<select value={location} onChange={(event) => setLocation(event.target.value)}><option value="all">All locations</option>{locations.map((city) => <option key={city}>{city}</option>)}</select></label>
          <label className="filter-label">Service category<select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="all">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
          <div className="filter-label"><span>Maximum price <strong>THB {maxPrice.toLocaleString()}</strong></span><input className="price-range" type="range" min="1000" max="50000" step="1000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /><div className="range-labels"><span>THB 1,000</span><span>THB 50,000+</span></div></div>
          <label className="switch-row"><span><strong>At-home service</strong><small>Available at your location</small></span><input type="checkbox" checked={homeOnly} onChange={(event) => setHomeOnly(event.target.checked)} /><i /></label>
        </aside>
        <div className="results-panel"><div className="results-toolbar"><div><p><strong>{results.length}</strong> services found</p>{activeFilters > 0 && <button className="active-filter" onClick={reset}>Filters applied ×</button>}</div><div className="toolbar-actions"><button className="filter-toggle" onClick={() => setFiltersOpen((value) => !value)}>☷ Filters {activeFilters > 0 && <b>{activeFilters}</b>}</button><label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div></div>
          <div className="service-grid">{results.slice(0, 12).map(({ service, provider, category }) => { const original = priceOf(service); const current = salePrice(service); return <article className="service-card" key={service.id}><div className="service-art"><span>{label[service.type] ?? "Care"}</span><div className={`art-shape art-${service.type}`} /><span className="heart">♡</span></div><div className="service-details"><div className="provider-line"><span>{provider!.name}</span>{provider!.providerInformation.rating && <span className="rating">★ {provider!.providerInformation.rating}</span>}</div><h3>{service.title}</h3><p className="service-meta">{category!.title} · {provider!.providerInformation.city.name}</p>{service.testAtHome && <span className="home-badge">⌂ At-home available</span>}<div className="price-line"><div>{current < original && <s>{money(original, provider!.providerInformation.currency)}</s>}<strong>{money(current, provider!.providerInformation.currency)}</strong>{service.wellnessPricing.length > 1 && <small>from</small>}</div><button aria-label={`View ${service.title}`}>→</button></div></div></article>; })}</div>
          {!results.length && <div className="empty-state"><span>⌕</span><h3>No services match these filters</h3><p>Try increasing your price range or clearing a filter.</p><button onClick={reset}>Reset filters</button></div>}
        </div>
      </div>
    </section>
  </main>;
}
