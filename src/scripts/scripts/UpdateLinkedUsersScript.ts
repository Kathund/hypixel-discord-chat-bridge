import BasicScript from "../private/BasicScript.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import type ScriptManager from "../ScriptsManager.js";

class UpdateLinkedUsersScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, {
      id: "updateLinkedUsers",
      enabled: scripts.application.config.verification.autoRoleUpdater.enabled,
      interval: scripts.application.config.verification.autoRoleUpdater.interval * 60 * 60 * 1000
    });
  }

  override async execute(): Promise<void> {
    for (const linkedUser of this.scripts.application.linked.getLinkedUsers()) {
      const response = await linkedUser.updateRoles();
      if (response === null) throw new HypixelDiscordChatBridgeError("Something wen't wrong with updating");
      console.scripts(`Updated roles for ${linkedUser.discordId} (${linkedUser.uuid})`);
    }
  }
}

export default UpdateLinkedUsersScript;
