import BasicScript from "../private/BasicScript.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import type ScriptManager from "../ScriptsManager.js";

class UpdateLinkedUsersScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, {
      id: "updateLinkedUsers",
      enabled: scripts.application.config.verification.roles.autoUpdater.enabled,
      interval: scripts.application.config.verification.roles.autoUpdater.interval
    });
  }

  override async execute() {
    const linkedUsers = await this.scripts.application.linked.getLinkedUsers();
    for (const linkedUser of linkedUsers) {
      const response = await linkedUser.updateRoles();
      if (response === null) throw new HypixelDiscordChatBridgeError("Something wen't wrong with updating");
      console.scripts(`Updated roles for ${linkedUser.discordId} (${linkedUser.uuid})`);
    }
  }
}

export default UpdateLinkedUsersScript;
