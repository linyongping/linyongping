import { convertSubStringToJson, SsConfig, VmessConfig } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import yaml from "js-yaml";

export const runtime = "edge";

export type ClashConfig = {
  port: number;
  "socks-port": number;
  "allow-lan": boolean;
  mode: "Rule";
  "log-level": "info";
  "external-controller": string;
  proxies: (VmessConfig | SsConfig)[];
  "proxy-groups": {
    name: string;
    type: "select" | "url-test";
    proxies: string[];
    url?: string;
    interval?: number;
  }[];
  rules: string[];
};

type IpApiResponse = {
  countryCode: string;
  city: string;
};

const seanSubUrl =
  "https://jmssub.net/members/getsub.php?service=1005699&id=60886f48-f5d7-4787-87af-5f172b056cfe";
const cabbageSubUrl =
  "https://jmssub.net/members/getsub.php?service=1034881&id=be6eee5e-4512-4a89-8563-cae37a3be8a8";

export default async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const { searchParams } = url;
  const secret = searchParams.get("secret");
  const subType = searchParams.get("subType");
  const useDomain = searchParams.get("usedomains") === "1";
  if (secret !== "kfcv50") {
    return new NextResponse("Invalid secret", { status: 401 });
  }

  const subUrl = subType === "xbc" ? cabbageSubUrl : seanSubUrl;

  const finalUrl = useDomain ? subUrl + "&usedomains=1" : subUrl;

  try {
    const justVmessRes = await fetch(finalUrl);
    const justSockVmessSub = await justVmessRes.text();
    const JustSockSubJson = convertSubStringToJson(justSockVmessSub);

    const yamlConfigRes = await fetch(
      "https://sean-blog.pages.dev/ruleSets.yaml"
    );

    const yamlConfigText = await yamlConfigRes.text();
    let yamlJson = yaml.load(yamlConfigText) as ClashConfig;

    const proxies = await JustSockSubJson.map(async (proxy, index) => {
      const { countryCode, city } = await fetch(
        `http://ip-api.com/json/${proxy.server}`
      ).then((res) => res.json() as Promise<IpApiResponse>);

      // "JMS-1005699@c11s1.portablesubmarines.com:9358" get c11s1
      const serverName = proxy.name?.split("@")[1].split(".")[0];
      const name = `${serverName}-[${countryCode}/${city}]`;

      if (proxy.type === "vmess") {
        // remove serverType from matchedConfig
        return {
          type: "vmess" as const,
          name,
          server: proxy.server,
          port: proxy.port,
          uuid: proxy.uuid,
          alterId: proxy.alterId,
          cipher: "auto",
          tls: false,
          "skip-cert-verify": true,
          udp: true,
        };
      }

      if (proxy.type === "ss") {
        return {
          name,
          server: proxy.server,
          port: proxy.port,
          type: "ss" as const,
          cipher: proxy.cipher,
          password: proxy.password,
          udp: true,
        };
      }
      return proxy;
    });

    yamlJson.proxies = await Promise.all(proxies);
    yamlJson["proxy-groups"] = [
      {
        name: "AUTO-SELECT-PROXY",
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        interval: 1000 * 60 * 5,
        proxies: yamlJson.proxies.map((proxy) => proxy.name!),
      },
      {
        name: "USA-PROXY",
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        interval: 1000 * 60 * 5,
        proxies: yamlJson.proxies
          .filter((proxy) => {
            return proxy.name?.includes("US");
          })
          .map((proxy) => proxy.name!),
      },
      {
        name: "Select",
        type: "select",
        proxies: yamlJson.proxies.map((proxy) => proxy.name!),
      },
    ];

    const newYamlContent = yaml.dump(yamlJson);

    // add comment to yaml
    const comment = `# Updated at ${new Date().toLocaleString()} with ${
      subType ? "xbc" : "sean"
    } sub`;
    const newYamlContentWithComment = `${comment}\n${newYamlContent}`;

    return new NextResponse(newYamlContentWithComment, {
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

/**
 * 
 * proxy-groups:
  - name: AUTO-SELECT-PROXY
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    proxies:
      - JMS-1005699@c11s1.portablesubmarines.com:9358
      - JMS-1005699@c11s2.portablesubmarines.com:9358
      - JMS-1005699@c11s3.portablesubmarines.com:9358
      - JMS-1005699@c11s4.portablesubmarines.com:9358
      - JMS-1005699@c11s5.portablesubmarines.com:9358
      - JMS-1005699@c11s801.portablesubmarines.com:9358
 */

/**
  * {
  "query": "206.190.233.163",
  "status": "success",
  "country": "Japan",
  "countryCode": "JP",
  "region": "27",
  "regionName": "Osaka",
  "city": "Osaka",
  "zip": "543-0062",
  "lat": 34.6946,
  "lon": 135.5021,
  "timezone": "Asia/Tokyo",
  "isp": "DOT COM SOLUTIONS",
  "org": "Micro Dynamic Solutions, Inc.",
  "as": "AS25820 IT7 Networks Inc"
}
  * 
  *  */
