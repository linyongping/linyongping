import { getDataUsageDetails } from "@/lib/dataFetcher";

export async function GET() {
  const result = await getDataUsageDetails();

  return new Response(JSON.stringify(result));
}
