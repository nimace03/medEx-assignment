export type Category = { id: string; title: string; type: string; status: boolean };

export type Provider = {
    id: number;
    name: string;
    status: string;
    providerInformation: { city: { name: string }; currency: string; rating: number | null }
};

export type Service = {
    id: string;
    title: string;
    type: string;
    userId: number;
    categoryId: string;
    price: string | null;
    discount: string | null;
    discountType: "amount" | "percent" | null;
    status: boolean;
    testAtHome: boolean;
    wellnessPricing: {
        durationInMinutes: number;
        price: string;
        discount: string;
        discountType: "amount" | "percent"
    }[]
};

export type CatalogData = { categories: Category[]; providers: Provider[]; services: Service[] };
