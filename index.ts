import Application from "./src/Application.js";
import ConfigManager from "./src/ConfigManager.js";
import "./src/private/logger.js";

new ConfigManager();
new Application().connect();
