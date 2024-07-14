import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { decode } from "base-64";
interface VmessConfig {
  v: string;
  ps: string;
  add: string;
  port: string;
  id: string;
  aid: string;
  net: string;
  type: string;
  host: string;
  path: string;
  tls: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertSubStringToJson(vmessSubString: string): VmessConfig[] {
  try {
    const decodedData = decode(vmessSubString); 
    const encodedConfigs = decodedData
      .split("\n")
      .filter((line: string) => line.startsWith("vmess://"));

    const vmessConfigs: VmessConfig[] = encodedConfigs.map(
      (encoded: string) => {
        const decoded = decode(encoded.replace("vmess://", ""));
        return JSON.parse(decoded) as VmessConfig;
      }
    );

    return vmessConfigs;
  } catch (error) {
    console.error("Failed to convert json:", error);
    throw error;
  }
}
