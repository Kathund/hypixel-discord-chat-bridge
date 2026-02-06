import config from "../config.json" with { type: "json" };
import cron from "node-cron";
import { exec } from "node:child_process";
import { updateMessage } from "./Logger.js";

function updateCode() {
  if (config.other.autoUpdater === false) {
    return;
  }

  exec("git pull", (error, stdout) => {
    if (error) {
      console.error(error);
      return;
    }

    // console.log(`Git pull output: ${stdout}`);

    if (stdout === "Already up to date.\n") {
      return;
    }

    updateMessage();
  });
}

cron.schedule(`0 */${config.other.autoUpdaterInterval} * * *`, () => updateCode());
updateCode();
