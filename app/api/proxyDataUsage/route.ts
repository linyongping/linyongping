const dateUsageUrl =
  "https://justmysocks6.net/members/getbwcounter.php?service=1005699&id=60886f48-f5d7-4787-87af-5f172b056cfe";

export async function POST() {
  const result = await fetch(dateUsageUrl).then((res) => res.json());

  return new Response(JSON.stringify(result));
}

export const runtime = 'edge'