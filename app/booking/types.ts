export type Specialist = { id: string; name: string; speciality: string; consultation: { startTime: string; endTime: string; durationInMinutes: number; bufferInMinutes: number } };
export type Provider = { id: number; name: string; country: string; timezone: string; daySchedules: Record<string, { startTime: string; endTime: string }>; specialists: Specialist[] };
export type BookedSlot = { providerId: number; specialistId: string; dayOffset: number; startTime: string };
export type Closure = { providerId: number; dayOffset: number; reason: string };
export type BookingData = { providers: Provider[]; bookedSlots: BookedSlot[]; closures: Closure[] };
