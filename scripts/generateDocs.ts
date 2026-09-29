import { initMarkdownFile, saveMarkdownFile } from "./utils.ts";
import { readdir } from "node:fs/promises";
import "../src/private/logger.ts";

process.env.UNIX_TIMESTAMP ||= Date.now().toString();
const scripts = await readdir("./scripts/docs", { recursive: true, encoding: "utf-8" }).then((files) => files.filter((file) => file.endsWith(".ts")));
console.other(`Found ${scripts.length} script(s). Running them all`);

for (const file of scripts) {
  console.other(`Running ${file}`);
  await import(`./docs/${file}`);
}

await saveMarkdownFile("scripts/README.md", await initMarkdownFile("scripts/README.md", "ScriptsReadme"), "ScriptsReadme", false);

process.env.UNIX_TIMESTAMP = "";
process.exit(0);
