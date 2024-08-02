import { convertSubStringToJson, SsConfig, VmessConfig } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import yaml from "js-yaml";
import { ClashConfig } from "./convertv2";

export const runtime = "edge";

const seanSubUrl =
  "https://jmssub.net/members/getsub.php?service=1005699&id=60886f48-f5d7-4787-87af-5f172b056cfe";
const cabbageSubUrl =
  "https://jmssub.net/members/getsub.php?service=1034881&id=be6eee5e-4512-4a89-8563-cae37a3be8a8";

export default async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const { searchParams } = url;
  const secret = searchParams.get("secret");
  const subType = searchParams.get("subType");
  if (secret !== "kfcv50") {
    return new NextResponse("Invalid secret", { status: 401 });
  }

  const subUrl = subType === "xbc" ? cabbageSubUrl : seanSubUrl;

  try {
    const justVmessRes = await fetch(subUrl);
    const vmessSub = await justVmessRes.text();
    const subJson = convertSubStringToJson(vmessSub);

    const yamlConfigRes = await fetch(
      "https://sean-blog.pages.dev/clashTemp.yaml"
    );

    const yamlConfigText = await yamlConfigRes.text();
    let yamlJson = yaml.load(yamlConfigText) as ClashConfig;

    yamlJson.proxies = yamlJson.proxies.map((proxy) => {
      if (proxy.type === "vmess") {
        const matchedConfig = subJson.find((config) => {
          return (config as VmessConfig).name === proxy.name;
        }); // find matched config

        if (matchedConfig && matchedConfig.type === "vmess") {
          // remove serverType from matchedConfig
          return {
            name: proxy.name,
            server: matchedConfig.server,
            port: matchedConfig.port,
            type: "vmess" as const,
            uuid: matchedConfig.uuid,
            alterId: matchedConfig.alterId,
            cipher: "auto",
            tls: false,
            "skip-cert-verify": true,
            udp: true,
          };
        }
      }

      if (proxy.type === "ss") {
        const matchedConfig = subJson.find((config) => {
          return (config as SsConfig).name === proxy.name;
        });

        if (matchedConfig && matchedConfig.type === "ss") {
          console.log("matchedConfig", matchedConfig);
          return {
            name: proxy.name,
            server: matchedConfig.server,
            port: matchedConfig.port ?? "",
            type: "ss" as const,
            cipher: matchedConfig.cipher,
            password: matchedConfig.password,
            udp: true,
          };
        }
      }
      return proxy;
    });

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
