import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { decode } from "base-64";
export interface VmessConfig {
  name: string;
  server: string;
  port: string;
  uuid: string;
  alterId: string;
  tls?: boolean;
  cipher?: string;
  "skip-cert-verify"?: boolean;
  udp?: boolean;
  type: "vmess";
}

export interface SsConfig {
  cipher?: string;
  password?: string;
  server?: string;
  port?: string;
  type: "ss";
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
    console.log("endcoded:", encodedConfigs);

    const configs: (VmessConfig | SsConfig)[] = encodedConfigs.map(
      (encoded: string) => {
        if (encoded.startsWith("ss://")) {
          const [suffix, name] = encoded.split("#");
          const [_, encodedConfig] = suffix.split("ss://");
          const decoded = decode(encodedConfig);
          const [cipher, passwordAndServer, port] = decoded.split(":");
          const [password, server] = passwordAndServer.split("@");

          return {
            type: "ss",
            cipher,
            password,
            server,
            port,
            name,
          };
        }

        const decoded = decode(encoded.replace("vmess://", ""));
        const vmessConfig = JSON.parse(decoded);
        return {
          server: vmessConfig.add,
          port: vmessConfig.port,
          uuid: vmessConfig.id,
          alterId: vmessConfig.aid,
          name: vmessConfig.ps,
          type: "vmess",
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
