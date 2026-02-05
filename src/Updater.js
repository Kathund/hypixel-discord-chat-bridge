import { updateMessage } from "./Logger.js";
import { exec } from "child_process";
import config from "../config.json" with { type: "json" };
import cron from "node-cron";

function updateCode() {
  if (config.other.autoUpdater === false) {
    return;
  }

  exec("git pull", (error, stdout, stderr) => {
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
