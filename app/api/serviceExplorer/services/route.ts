import catalog from "@/data/task1-service-explorer.json";

export async function GET() {
  return Response.json(catalog.services);
}
