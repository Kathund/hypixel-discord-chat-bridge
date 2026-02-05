import "./src/Configuration.js";
import "./src/Updater.js";
import "./src/Logger.js";

/* eslint-disable no-console */
process.on("uncaughtException", (error) => console.log(error));
import Application from "./src/Application.js";

("use strict");

const app = new Application();
app
  .register()
  .then(() => {
    app.connect();
  })
  .catch((error) => {
    console.log(error);
  });
