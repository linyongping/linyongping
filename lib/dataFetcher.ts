export type DataUsageDetails = {
  monthly_bw_limit_b: number;
  bw_counter_b: number;
  bw_reset_day_of_month: number;
};

const dateUsageUrl =
  "https://justmysocks6.net/members/getbwcounter.php?service=1005699&id=60886f48-f5d7-4787-87af-5f172b056cfe";

export async function getDataUsageDetails(): Promise<DataUsageDetails> {
  const res = await fetch(dateUsageUrl);
  return res.json();
}
