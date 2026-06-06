import ConfigManager from "./src/ConfigManager.js";
import "./src/private/logger.js";

const configManager = new ConfigManager();
const config = await configManager.init();

const { default: Application } = await import("./src/Application.js");
const application = new Application(config);
await application.connect();
