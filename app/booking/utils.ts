import {Provider} from "./types";

export const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export const minute = (time: string) => {
    const [hour, min] = time.split(":").map(Number);
    return hour * 60 + min;
};

export const clock = (time: string) => new Date(`2000-01-01T${time}:00`).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
});

export const countryTime = (provider: Provider) => provider.country === "TH" ? "Bangkok time (UTC+7)" : provider.country === "IN" ? "India time (UTC+5:30)" : "Nepal time (UTC+5:45)";
