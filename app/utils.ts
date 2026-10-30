import {Service} from "./types";

export const label: Record<string, string> = {
    package: "Health package",
    lab_test: "Lab test",
    service: "Treatment",
    wellness: "Wellness",
    insurance: "Insurance"
};

export const priceOf = (service: Service) => Number(service.price ?? service.wellnessPricing[0]?.price ?? 0);

export const salePrice = (service: Service) => {
    const price = priceOf(service);
    const discount = Number(service.discount ?? service.wellnessPricing[0]?.discount ?? 0);
    const type = service.discountType ?? service.wellnessPricing[0]?.discountType;
    return type === "percent" ? price * (1 - discount / 100) : Math.max(0, price - discount);
};

export const money = (value: number, currency: string) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
}).format(value);
