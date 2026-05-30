import Script from "../private/script.js";
import { displayBigMessage } from "../../private/logger.js";
import { exec } from "node:child_process";
import type ScriptManager from "../ScriptsManager.js";

class UpdateCodeScript extends Script {
  constructor(scripts: ScriptManager) {
    super(scripts, {
      enabled: scripts.application.config.codeUpdater.enabled,
      id: "updateCode",
      interval: scripts.application.config.codeUpdater.interval * 60 * 60 * 1000
    });
    if (this.enabled) this.execute();
  }

  override execute(): void {
    exec("git pull", (error, stdout, stderr) => {
      if (error) return console.error(error);

      // console.log(`Git pull output: ${stdout}`);

      if (stdout === "Already up to date.\n") return;

      displayBigMessage("Bot has been updated, please restart the bot to apply changes!");
    });
  }
}

export default UpdateCodeScript;
