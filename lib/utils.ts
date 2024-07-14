import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { decode } from "base-64";
export interface VmessConfig {
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
  serverType: "vmess";
}

export interface SsConfig {
  cipher?: string;
  password?: string;
  server?: string;
  port?: string;
  serverType: "ss";
  name?: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertSubStringToJson(
  vmessSubString: string
): (VmessConfig | SsConfig)[] {
  try {
    const decodedData = decode(vmessSubString);
    const encodedConfigs = decodedData.split("\n");

    const configs: (VmessConfig | SsConfig)[] = encodedConfigs.map(
      (encoded: string) => {
        if (encoded.startsWith("ss://")) {
          const [suffix, name] = encoded.split("#");
          const [_, encodedConfig] = suffix.split("ss://");
          const decoded = decode(encodedConfig);
          const [cipher, passwordAndServer, port] = decoded.split(":");
          const [password, server] = passwordAndServer.split("@");

          return {
            serverType: "ss",
            cipher,
            password,
            server,
            port,
            name,
          };
        }

        const decoded = decode(encoded.replace("vmess://", ""));
        const vmessConfig = JSON.parse(decoded) as VmessConfig;
        return {
          ...vmessConfig,
          serverType: "vmess",
        };
      }
    );

    console.log("configs:", configs);

    return configs;
  } catch (error) {
    console.error("Failed to convert json:", error);
    throw error;
  }
}
