import {LocalItem} from "./types";

export const groupNames: Record<string, string> = {
    lab_test: "Laboratory tests",
    wellness: "Wellness appointments",
    package: "Health packages",
    service: "Medical services",
    unknown: "Needs attention"
};

export const icons: Record<string, string> = {lab_test: "⌁", wellness: "✦", package: "♡", service: "✚", unknown: "!"};

export const format = (amount: number, currency: string) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
}).format(amount);

export const itemPrice = (item: LocalItem) => {
    if (typeof item.product.price === "number") return item.product.price;
    return item.product.wellnessPricing?.find((price) => price.id === item.selectedPricingId)?.amount_after_service_charge ?? null;
};