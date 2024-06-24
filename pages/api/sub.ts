// import path from "path";
// import fse from "fs-extra";
// import yaml from "js-yaml";
// import { NextApiRequest, NextApiResponse } from "next";

// export const config = {
//   runtime: "edge",
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const currentTime = new Date().toISOString();
//   const filePath = path.join(process.cwd(), "public", "clashTemp.yaml");

//   try {
//     const tempFile = await fse.readFile(filePath, "utf8");
//     const json = JSON.stringify(yaml.load(tempFile));
//     res.setHeader("Content-Type", "text/plain");
//     res.setHeader("x-timestamp", currentTime);
//     res.status(200).send(json);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Failed to read file" });
//   }
// }

export const runtime = "edge";
