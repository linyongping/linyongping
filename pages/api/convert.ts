import { convertSubStringToJson, SsConfig, VmessConfig } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import yaml from "js-yaml";

export const runtime = "edge";

type ClashConfig = {
  port: number;
  "socks-port": number;
  "allow-lan": boolean;
  mode: "Rule";
  "log-level": "info";
  "external-controller": string;
  proxies: {
    name: string;
    server?: string;
    port: number;
    type: "ss" | "vmess";
    cipher?: string;
    password?: string;
    uuid?: string;
    alterId?: number;
    tls?: boolean;
    "skip-cert-verify"?: boolean;
    udp: boolean;
  }[];
  "proxy-groups": {
    name: string;
    type: "select" | "url-test";
    proxies: string[];
  }[];
  rules: string[];
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
          return (config as VmessConfig).ps === proxy.name;
        }); // find matched config

        if (matchedConfig && matchedConfig.serverType === "vmess") {
          // remove serverType from matchedConfig
          return {
            name: proxy.name,
            server: matchedConfig.add,
            port: parseInt(matchedConfig.port),
            type: "vmess",
            uuid: matchedConfig.id,
            alterId: parseInt(matchedConfig.aid),
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

        if (matchedConfig && matchedConfig.serverType === "ss") {
          console.log("matchedConfig", matchedConfig);
          return {
            name: proxy.name,
            server: matchedConfig.server,
            port: parseInt(matchedConfig.port ?? ""),
            type: "ss",
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

/**
 * port: 7890
socks-port: 7891
allow-lan: true
mode: Rule
log-level: info
external-controller: :9090
proxies:
  - {name: JMS-1005699@c11s1.portablesubmarines.com:9358, server: c11s1.portablesubmarines.com, port: 9358, type: ss, cipher: aes-256-gcm, password: LJPhrwCzMG8BcUjE, udp: true}
  - {name: JMS-1005699@c11s2.portablesubmarines.com:9358, server: c11s2.portablesubmarines.com, port: 9358, type: ss, cipher: aes-256-gcm, password: LJPhrwCzMG8BcUjE, udp: true}
  - {name: JMS-1005699@c11s3.portablesubmarines.com:9358, server: c11s3.portablesubmarines.com, port: 9358, type: vmess, uuid: 60886f48-f5d7-4787-87af-5f172b056cfe, alterId: 0, cipher: auto, tls: false, skip-cert-verify: true, udp: true}
  - {name: JMS-1005699@c11s4.portablesubmarines.com:9358, server: c11s4.portablesubmarines.com, port: 9358, type: vmess, uuid: 60886f48-f5d7-4787-87af-5f172b056cfe, alterId: 0, cipher: auto, tls: false, skip-cert-verify: true, udp: true}
  - {name: JMS-1005699@c11s5.portablesubmarines.com:9358, server: c11s5.portablesubmarines.com, port: 9358, type: vmess, uuid: 60886f48-f5d7-4787-87af-5f172b056cfe, alterId: 0, cipher: auto, tls: false, skip-cert-verify: true, udp: true}
  - {name: JMS-1005699@c11s801.portablesubmarines.com:9358, server: c11s801.portablesubmarines.com, port: 9358, type: vmess, uuid: 60886f48-f5d7-4787-87af-5f172b056cfe, alterId: 0, cipher: auto, tls: false, skip-cert-verify: true, udp: true}
proxy-groups:
  - name: 🔰 节点选择
    type: select
    proxies:
      - ♻️ 自动选择
      - 🎯 全球直连
      - JMS-1005699@c11s1.portablesubmarines.com:9358
      - JMS-1005699@c11s2.portablesubmarines.com:9358
      - JMS-1005699@c11s3.portablesubmarines.com:9358
      - JMS-1005699@c11s4.portablesubmarines.com:9358
      - JMS-1005699@c11s5.portablesubmarines.com:9358
      - JMS-1005699@c11s801.portablesubmarines.com:9358
  - name: ♻️ 自动选择
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
  - name: 🎥 NETFLIX
    type: select
    proxies:
      - 🔰 节点选择
      - ♻️ 自动选择
      - 🎯 全球直连
      - JMS-1005699@c11s1.portablesubmarines.com:9358
      - JMS-1005699@c11s2.portablesubmarines.com:9358
      - JMS-1005699@c11s3.portablesubmarines.com:9358
      - JMS-1005699@c11s4.portablesubmarines.com:9358
      - JMS-1005699@c11s5.portablesubmarines.com:9358
      - JMS-1005699@c11s801.portablesubmarines.com:9358
  - name: ⛔️ 广告拦截
    type: select
    proxies:
      - 🛑 全球拦截
      - 🎯 全球直连
      - 🔰 节点选择
  - name: 🚫 运营劫持
    type: select
    proxies:
      - 🛑 全球拦截
      - 🎯 全球直连
      - 🔰 节点选择
  - name: 🌍 国外媒体
    type: select
    proxies:
      - 🔰 节点选择
      - ♻️ 自动选择
      - 🎯 全球直连
      - JMS-1005699@c11s1.portablesubmarines.com:9358
      - JMS-1005699@c11s2.portablesubmarines.com:9358
      - JMS-1005699@c11s3.portablesubmarines.com:9358
      - JMS-1005699@c11s4.portablesubmarines.com:9358
      - JMS-1005699@c11s5.portablesubmarines.com:9358
      - JMS-1005699@c11s801.portablesubmarines.com:9358
  - name: 🌏 国内媒体
    type: select
    proxies:
      - 🎯 全球直连
      - 🔰 节点选择
  - name: Ⓜ️ 微软服务
    type: select
    proxies:
      - 🎯 全球直连
      - 🔰 节点选择
      - JMS-1005699@c11s1.portablesubmarines.com:9358
      - JMS-1005699@c11s2.portablesubmarines.com:9358
      - JMS-1005699@c11s3.portablesubmarines.com:9358
      - JMS-1005699@c11s4.portablesubmarines.com:9358
      - JMS-1005699@c11s5.portablesubmarines.com:9358
      - JMS-1005699@c11s801.portablesubmarines.com:9358
  - name: 📲 电报信息
    type: select
    proxies:
      - 🔰 节点选择
      - 🎯 全球直连
      - JMS-1005699@c11s1.portablesubmarines.com:9358
      - JMS-1005699@c11s2.portablesubmarines.com:9358
      - JMS-1005699@c11s3.portablesubmarines.com:9358
      - JMS-1005699@c11s4.portablesubmarines.com:9358
      - JMS-1005699@c11s5.portablesubmarines.com:9358
      - JMS-1005699@c11s801.portablesubmarines.com:9358
  - name: 🍎 苹果服务
    type: select
    proxies:
      - 🔰 节点选择
      - 🎯 全球直连
      - ♻️ 自动选择
      - JMS-1005699@c11s1.portablesubmarines.com:9358
      - JMS-1005699@c11s2.portablesubmarines.com:9358
      - JMS-1005699@c11s3.portablesubmarines.com:9358
      - JMS-1005699@c11s4.portablesubmarines.com:9358
      - JMS-1005699@c11s5.portablesubmarines.com:9358
      - JMS-1005699@c11s801.portablesubmarines.com:9358
  - name: 🎯 全球直连
    type: select
    proxies:
      - DIRECT
  - name: 🛑 全球拦截
    type: select
    proxies:
      - REJECT
      - DIRECT
  - name: 🐟 漏网之鱼
    type: select
    proxies:
      - 🔰 节点选择
      - 🎯 全球直连
      - ♻️ 自动选择
      - JMS-1005699@c11s1.portablesubmarines.com:9358
      - JMS-1005699@c11s2.portablesubmarines.com:9358
      - JMS-1005699@c11s3.portablesubmarines.com:9358
      - JMS-1005699@c11s4.portablesubmarines.com:9358
      - JMS-1005699@c11s5.portablesubmarines.com:9358
      - JMS-1005699@c11s801.portablesubmarines.com:9358
rules:
  - DOMAIN-SUFFIX,local,🎯 全球直连
  - IP-CIDR,192.168.0.0/16,🎯 全球直连,no-resolve
  - IP-CIDR,10.0.0.0/8,🎯 全球直连,no-resolve
  - IP-CIDR,172.16.0.0/12,🎯 全球直连,no-resolve
  - IP-CIDR,127.0.0.0/8,🎯 全球直连,no-resolve
  - IP-CIDR,100.64.0.0/10,🎯 全球直连,no-resolve
  - IP-CIDR6,::1/128,🎯 全球直连,no-resolve
  - IP-CIDR6,fc00::/7,🎯 全球直连,no-resolve
  - IP-CIDR6,fe80::/10,🎯 全球直连,no-resolve
  - IP-CIDR6,fd00::/8,🎯 全球直连,no-resolve
  - DOMAIN-KEYWORD,1drv,Ⓜ️ 微软服务
  - DOMAIN-KEYWORD,microsoft,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,aadrm.com,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,acompli.com,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,acompli.net,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,aka.ms,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,akadns.net,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,aspnetcdn.com,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,assets-yammer.com,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,azure.com,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,azure.net,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,azureedge.net,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,azurerms.com,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,bing.com,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,cloudapp.net,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,cloudappsecurity.com,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,edgesuite.net,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,gfx.ms,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,hotmail.com,Ⓜ️ 微软服务
  - DOMAIN-SUFFIX,live.com,Ⓜ️ 微软服务
**/
