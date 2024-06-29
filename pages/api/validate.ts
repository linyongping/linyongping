import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // @ts-ignore
    const code = searchParams.get("code");
    console.log("code", code);
    if (code === "156287") {
      const randomTime = Math.floor(Math.random() * 1000);
      setTimeout(() => {
        return new NextResponse("Data fetched", { status: 200 });
      }, randomTime);
    }
    return new NextResponse("Invalid code", { status: 500 });
  } catch (err) {
    return new NextResponse("server error", { status: 500 });
  }
}
