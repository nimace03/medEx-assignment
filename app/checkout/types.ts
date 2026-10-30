export type Pricing = { id: string; durationInMinutes: number; amount_after_service_charge: number };
export type Product = { id?: string; title?: string; type?: string; currency?: string; providerName?: string; price?: number | null; priceUnknown?: boolean; wellnessPricing?: Pricing[] };
export type Item = { id: string; quantity: number; product: Product };
export type Group = { type: string; items: Item[] };
export type LocalItem = Item & { selectedPricingId?: string };
