import bookingData from "@/data/task3-booking.json";

export async function GET() {
  return Response.json(bookingData.providers);
}
