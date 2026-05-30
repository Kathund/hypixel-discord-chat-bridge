import ConfigManager from "./src/ConfigManager.js";
import "./src/private/logger.js";

new ConfigManager();

const { default: Application } = await import("./src/Application.js");
new Application().connect();
