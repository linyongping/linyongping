import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // @ts-ignore
    const otp = searchParams.get("otp");
    console.log("code", otp);
    if (otp === "156287") {
      const randomTime = Math.floor(Math.random() * 1000);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(new NextResponse("ok", { status: 200 }));
        }, randomTime);
      });
    } else {
      return new NextResponse("Invalid code", { status: 500 });
    }
  } catch (err) {
    return new NextResponse("server error", { status: 500 });
  }
}
