import { getDataUsageDetails } from "@/lib/dataFetcher";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  console.log("proxyDataUsage", req);
  const result = await getDataUsageDetails();

  // return NextResponse.json(result);
}
