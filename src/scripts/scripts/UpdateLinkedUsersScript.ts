import HypixelDiscordChatBridgeError from "../../private/error.js";
import Script from "../private/script.js";
import type ScriptManager from "../ScriptsManager.js";

class UpdateLinkedUsersScript extends Script {
  constructor(scripts: ScriptManager) {
    super(scripts, {
      enabled: scripts.application.config.verification.autoRoleUpdater.enabled,
      id: "updateLinkedUsers",
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
