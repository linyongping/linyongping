import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
  try {
    const yamlConfig = await fetch(
      "https://sean-blog.pages.dev/clashTemp.yaml"
    );

    if (!yamlConfig.ok) {
      throw new Error(`Error fetching data: ${yamlConfig.statusText}`);
    }
    const data = await yamlConfig.text();
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Error fetching data", { status: 500 });
  }
}
