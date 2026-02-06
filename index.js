import "./src/Logger.js";

import Application from "./src/Application.js";
import "./src/Configuration.js";
import "./src/Updater.js";

process.on("uncaughtException", (error) => console.log(error));

("use strict");

const app = new Application();
app.register();

app.connect().catch((error) => {
  console.log(error);
});
