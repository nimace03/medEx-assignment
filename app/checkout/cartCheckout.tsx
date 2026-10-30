"use client";

import { useMemo, useState, useEffect } from "react";
import { urls } from "@/utils/urls";
import { Group, LocalItem } from "./types";

const groupNames: Record<string, string> = { lab_test: "Laboratory tests", wellness: "Wellness appointments", package: "Health packages", service: "Medical services", unknown: "Needs attention" };
const icons: Record<string, string> = { lab_test: "⌁", wellness: "✦", package: "♡", service: "✚", unknown: "!" };

const format = (amount: number, currency: string) => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
const itemPrice = (item: LocalItem) => {
  if (typeof item.product.price === "number") return item.product.price;
  return item.product.wellnessPricing?.find((price) => price.id === item.selectedPricingId)?.amount_after_service_charge ?? null;
};

export default function CartCheckout() {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState(false);

  const resolvedGroups = useMemo(() => groups && groups.map((group) => ({ ...group, items: group.items.map((item) => ({ ...item, selectedPricingId: selectedPricing[item.id] })) })) || [], [groups, selectedPricing]);
  const totalItems = resolvedGroups?.reduce((sum, group) => sum + group.items.reduce((count, item) => count + item.quantity, 0), 0);
  const pricedItems = resolvedGroups?.flatMap((group) => group.items).filter((item) => itemPrice(item) !== null);
  const totals = pricedItems.reduce<Record<string, number>>((sum, item) => {
    const currency = item.product.currency ?? "THB";
    sum[currency] = (sum[currency] ?? 0) + itemPrice(item)! * item.quantity;
    return sum;
  }, {});
  const unresolved = resolvedGroups?.flatMap((group) => group.items).filter((item) => !item.product.title || itemPrice(item) === null).length;

  const updateQuantity = (itemId: string, change: number) => setGroups((current) => current && current.map((group) => ({ ...group, items: group.items.flatMap((item) => item.id === itemId ? (item.quantity + change < 1 ? [] : [{ ...item, quantity: item.quantity + change }]) : [item]) })).filter((group) => group.items.length));
  const remove = (itemId: string) => setGroups((current) => current && current.map((group) => ({ ...group, items: group.items.filter((item) => item.id !== itemId) })).filter((group) => group.items.length));
  const checkout = (group: Group) => {
    const unpriced = group.items.some((item) => !item.product.title || itemPrice({ ...item, selectedPricingId: selectedPricing[item.id] }) === null);
    setMessage(unpriced ? "Choose a price option or remove unavailable items before checkout." : `${groupNames[group.type] ?? "This group"} is ready for checkout.`);
  };

  useEffect(() => {
    let isCurrent = true;
    Promise.all(["catalog", "guestCart", "serverCart"].map(async (resource) => {
      const response = await fetch(`${urls.checkout}/${resource}`);
      if (!response.ok) throw new Error(`Unable to load ${resource}`);
      return response.json();
    }))
      .then(([catalog, guestCart, serverCart]) => {
        if (isCurrent) setGroups([...serverCart?.groups]);
      })
      .catch(() => {
        if (isCurrent) setLoadError(true);
      });
    return () => { isCurrent = false; };
  }, []);

  if (!groups && !loadError) return <main className="explorer-shell"><section className="explorer-hero"><div className="explorer-container hero-copy"><span className="eyebrow">MEDICAL SERVICES, MADE SIMPLE</span><h1>Finding the right care for you…</h1></div></section></main>;
  if (loadError) return <main className="explorer-shell"><section className="explorer-hero"><div className="explorer-container hero-copy"><span className="eyebrow">SERVICE EXPLORER</span><h1>We couldn&apos;t load the service catalog.</h1><button className="popular-searches" onClick={() => window.location.reload()}>Try again</button></div></section></main>;

  return <main className="cart-page">
    <header className="cart-header"><a className="brand" href="#top"><span>✚</span> medex</a><nav><a href="#top">Explore services</a><a href="#cart">Help center</a><button aria-label="Account">JD</button></nav></header>
    <div id="top" className="cart-container">
      <div className="breadcrumbs">Home <span>/</span> Your cart</div>
      <div className="cart-title"><div><span className="cart-eyebrow">YOUR SELECTIONS</span><h1>Your care cart</h1><p>{totalItems} {totalItems === 1 ? "item" : "items"} selected across {resolvedGroups.length} care categories.</p></div><a href="#cart">Continue browsing <span>→</span></a></div>
      {message && <div className="cart-notice"><span>i</span>{message}<button onClick={() => setMessage("")} aria-label="Dismiss">×</button></div>}
      <div id="cart" className="cart-layout">
        <section className="cart-groups">
          {resolvedGroups.map((group) => <section className="cart-group" key={group.type}>
            <div className="group-heading"><div><span className={`group-icon group-${group.type}`}>{icons[group.type] ?? "·"}</span><div><h2>{groupNames[group.type] ?? "Other items"}</h2><p>These items are checked out together.</p></div></div><span>{group.items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>
            <div className="cart-items">{group.items.map((item) => {
              const price = itemPrice(item); const pricing = item.product.wellnessPricing;
              return <article className={`cart-item ${!item.product.title ? "is-unavailable" : ""}`} key={item.id}>
                <div className={`item-art art-${item.product.type ?? "unknown"}`}><span>{icons[item.product.type ?? "unknown"] ?? "?"}</span></div>
                <div className="item-info"><span className="type-label">{item.product.type?.replace("_", " ") ?? "Unavailable service"}</span><h3>{item.product.title ?? "This service is no longer available"}</h3>{item.product.providerName && <p>{item.product.providerName}</p>}
                  {pricing && <label className="duration-select">Choose duration<select value={item.selectedPricingId ?? ""} onChange={(event) => setSelectedPricing((current) => ({ ...current, [item.id]: event.target.value }))}><option value="">Select an option</option>{pricing.map((option) => <option key={option.id} value={option.id}>{option.durationInMinutes} min · {format(option.amount_after_service_charge, item.product.currency ?? "THB")}</option>)}</select></label>}
                  {!item.product.title && <span className="unavailable">Unavailable</span>}
                </div>
                <div className="item-controls"><button className="remove-item" onClick={() => remove(item.id)}>Remove</button>{price !== null && <strong>{format(price * item.quantity, item.product.currency ?? "THB")}</strong>}<div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => updateQuantity(item.id, -1)}>−</button><span>{item.quantity}</span><button aria-label="Increase quantity" onClick={() => updateQuantity(item.id, 1)}>+</button></div></div>
              </article>;
            })}</div>
            <div className="group-footer"><div><span>Group subtotal</span><strong>{Object.entries(group.items.reduce<Record<string, number>>((sum, item) => { const price = itemPrice(item); if (price !== null) sum[item.product.currency ?? "THB"] = (sum[item.product.currency ?? "THB"] ?? 0) + price * item.quantity; return sum; }, {})).map(([currency, amount]) => format(amount, currency)).join(" · ") || "Price selection required"}</strong></div><button onClick={() => checkout(group)}>Checkout this group <span>→</span></button></div>
          </section>)}
          {!resolvedGroups.length && <div className="cart-empty"><span>♧</span><h2>Your cart is empty</h2><p>Add a service to start planning your care.</p></div>}
        </section>
        <aside className="order-summary"><span className="cart-eyebrow">ORDER SUMMARY</span><h2>Today&apos;s total</h2><div className="summary-rows">{Object.entries(totals).map(([currency, amount]) => <div key={currency}><span>Services ({currency})</span><strong>{format(amount, currency)}</strong></div>)}{!Object.keys(totals).length && <div><span>Services</span><strong>—</strong></div>}</div><div className="summary-total"><span>Due today</span><div>{Object.entries(totals).map(([currency, amount]) => <strong key={currency}>{format(amount, currency)}</strong>)}</div></div>{unresolved > 0 && <p className="summary-warning">{unresolved} item{unresolved > 1 ? "s need" : " needs"} a price selection before checkout.</p>}<button className="summary-checkout" disabled={!totalItems || unresolved > 0} onClick={() => setMessage("Choose an individual care category to continue to its secure checkout.")}>Proceed to checkout <span>→</span></button><p className="secure-note">⌁ Secure checkout · Your payment details are protected</p></aside>
      </div>
      <div className="guest-note"><span>⌁</span><div><strong>Shopping as a guest?</strong><p>Your selected services will be saved for this session. Sign in during checkout to access bookings later.</p></div><button onClick={() => setMessage("Sign-in is available during checkout.")}>Sign in <span>→</span></button></div>
    </div>
  </main>;
}
