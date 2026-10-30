import cartData from "@/data/task2-cart.json";

export async function GET() {
  return Response.json(cartData.catalog);
}
