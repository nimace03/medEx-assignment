"use client";

import { useEffect, useMemo, useState } from "react";
import bookingData from "@/data/task3-booking.json";

type Specialist = { id: string; name: string; speciality: string; consultation: { startTime: string; endTime: string; durationInMinutes: number; bufferInMinutes: number } };
type Provider = { id: number; name: string; country: string; timezone: string; daySchedules: Record<string, { startTime: string; endTime: string }>; specialists: Specialist[] };
type BookedSlot = { providerId: number; specialistId: string; dayOffset: number; startTime: string };
const data = bookingData as unknown as { providers: Provider[]; bookedSlots: BookedSlot[]; closures: { providerId: number; dayOffset: number; reason: string }[] };
const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const minute = (time: string) => { const [hour, min] = time.split(":").map(Number); return hour * 60 + min; };
const clock = (time: string) => new Date(`2000-01-01T${time}:00`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const countryTime = (provider: Provider) => provider.country === "TH" ? "Bangkok time (UTC+7)" : provider.country === "IN" ? "India time (UTC+5:30)" : "Nepal time (UTC+5:45)";

export default function BookingTimeZones() {
  const [providerId, setProviderId] = useState(46);
  const provider = data.providers.find((item) => item.id === providerId) ?? data.providers[0];
  const [specialistId, setSpecialistId] = useState(provider.specialists[0].id);
  const specialist = provider.specialists.find((item) => item.id === specialistId) ?? provider.specialists[0];
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showProviderTime, setShowProviderTime] = useState(true);
  const [today, setToday] = useState(0);


  const dates = useMemo(() => Array.from({ length: 7 }, (_, offset) => { const date = new Date(today); date.setDate(date.getDate() + offset); return { offset, date }; }), [today]);
  const slots = useMemo(() => {
    const date = dates[selectedDay].date; const weekday = days[date.getDay()]; const schedule = provider.daySchedules[weekday];
    const closed = data.closures.find((closure) => closure.providerId === provider.id && closure.dayOffset === selectedDay);
    if (!schedule || closed) return { options: [] as string[], reason: closed?.reason ?? "This provider is closed" };
    const start = Math.max(minute(schedule.startTime), minute(specialist.consultation.startTime));
    const end = Math.min(minute(schedule.endTime), minute(specialist.consultation.endTime));
    const step = specialist.consultation.durationInMinutes + specialist.consultation.bufferInMinutes;
    const booked = new Set(data.bookedSlots.filter((slot) => slot.providerId === provider.id && slot.specialistId === specialist.id && slot.dayOffset === selectedDay).map((slot) => slot.startTime));
    const options: string[] = []; for (let value = start; value + specialist.consultation.durationInMinutes <= end; value += step) { const time = `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`; if (!booked.has(time)) options.push(time); }
    return { options, reason: "" };
  }, [dates, provider, selectedDay, specialist]);

  const displayTime = (time: string) => {
    if (showProviderTime || provider.country === "NP") return clock(time);
    const delta = provider.country === "TH" ? -75 : provider.country === "IN" ? 15 : 0;
    const value = (minute(time) + delta + 1440) % 1440; return clock(`${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`);
  };

  const selectProvider = (id: number) => {
    const next = data.providers.find((item) => item.id === id)!;
    setProviderId(id);
    setSpecialistId(next.specialists[0].id); setSelectedDay(0);
    setSelectedTime(null);
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => setToday(Date.now()));
    return () => cancelAnimationFrame(frame);
  }, []);

  return <main className="booking-page"><header className="booking-header"><a href="#top" className="booking-brand"><span>✚</span>medex</a><span>Secure appointment booking</span><button>Need help?</button></header>
    <div id="top" className="booking-container"><div className="booking-heading"><span className="booking-eyebrow">BOOK AN APPOINTMENT</span><h1>Choose a time that works for you.</h1><p>All availability is shown in the time zone you choose.</p></div>
      <div className="booking-layout"><section className="booking-form"><div className="booking-section"><label>Healthcare provider<select value={provider.id} onChange={(event) => selectProvider(Number(event.target.value))}>{data.providers.map((item) => <option key={item.id} value={item.id}>{item.name} · {countryTime(item)}</option>)}</select></label><label>Specialist<select value={specialist.id} onChange={(event) => { setSpecialistId(event.target.value); setSelectedTime(null); }}>{provider.specialists.map((item) => <option key={item.id} value={item.id}>{item.name} — {item.speciality}</option>)}</select></label></div>
        <div className="timezone-card"><div><span>◷</span><div><strong>Viewing times in {showProviderTime ? countryTime(provider) : "your local time (Nepal)"}</strong><p>{showProviderTime ? "Appointment availability follows the provider's local schedule." : "Converted from the provider's local schedule."}</p></div></div><button onClick={() => setShowProviderTime((value) => !value)}>Show {showProviderTime ? "my time" : "provider time"}</button></div>
        <div className="booking-section date-section"><div className="section-title"><div><h2>Select a date</h2><p>Next available appointments</p></div><button aria-label="Next week">›</button></div><div className="date-row">{dates.map(({ offset, date }) => <button key={offset} className={`date-button ${selectedDay === offset ? "is-selected" : ""}`} onClick={() => { setSelectedDay(offset); setSelectedTime(null); }}><span>{offset === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" })}</span><strong>{date.getDate()}</strong><small>{date.toLocaleDateString("en-US", { month: "short" })}</small></button>)}</div></div>
        <div className="booking-section"><div className="section-title"><div><h2>Available times</h2><p>{specialist.consultation.durationInMinutes}-minute consultation {specialist.consultation.bufferInMinutes > 0 && `· ${specialist.consultation.bufferInMinutes}-minute buffer`}</p></div><span className="timezone-label">{showProviderTime ? countryTime(provider) : "Your local time"}</span></div>{slots.reason ? <div className="no-slots"><span>◷</span><strong>{slots.reason}</strong><p>Please select another date to see availability.</p></div> : <div className="time-grid">{slots.options.map((time) => <button key={time} className={selectedTime === time ? "is-selected" : ""} onClick={() => setSelectedTime(time)}>{displayTime(time)}</button>)}</div>}</div>
      </section><aside className="appointment-summary"><span className="booking-eyebrow">YOUR APPOINTMENT</span><div className="doctor-avatar">{specialist.name.split(" ").slice(1).map((part) => part[0]).join("")}</div><h2>{specialist.name}</h2><p>{specialist.speciality}</p><div className="summary-divider" /><div className="summary-detail"><span>Provider</span><strong>{provider.name}</strong></div><div className="summary-detail"><span>Selected time</span><strong>{selectedTime ? `${dates[selectedDay].date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} · ${displayTime(selectedTime)}` : "Choose a time slot"}</strong></div><div className="summary-detail"><span>Time zone</span><strong>{showProviderTime ? countryTime(provider) : "Nepal time (UTC+5:45)"}</strong></div><p className="summary-footnote">Select a time slot to view the appointment in your preferred time zone.</p></aside></div>
    </div></main>;
}
