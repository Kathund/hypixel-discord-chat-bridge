import ConfigManager from "./src/ConfigManager.js";
import { mkdir } from "node:fs/promises";
import "./src/private/logger.js";

console.warn("LINKED USERS HAS BEEN CHANGED. PLEASE MANUALLY FIX");
console.warn('Instead of "UUID": "DISCORD_ID"');
console.warn('It\'s now { "uuid": "UUID", "discordId": "DISCORD_ID" }');

(async () => {
  await mkdir("./data/", { recursive: true });

  const configManager = new ConfigManager();
  const config = await configManager.init();

  const { default: Application } = await import("./src/Application.js");
  const application = new Application(config);
  await application.connect();
})();
