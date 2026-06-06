import BasicScript from "../private/BasicScript.js";
import { displayBigMessage } from "../../private/logger.js";
import { exec } from "node:child_process";
import type ScriptManager from "../ScriptsManager.js";

class UpdateCodeScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, { id: "updateCode", enabled: scripts.application.config.codeUpdater.enabled, interval: scripts.application.config.codeUpdater.interval });
    if (this.enabled) this.execute();
  }

  override execute() {
    exec("git pull", (error, stdout, stderr) => {
      if (error) return console.error(error);

      // console.log(`Git pull output: ${stdout}`);

      if (stdout === "Already up to date.\n") return;

      displayBigMessage("Bot has been updated, please restart the bot to apply changes!");
    });
  }
}

export default UpdateCodeScript;
