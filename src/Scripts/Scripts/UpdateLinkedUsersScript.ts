import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import Script from '../Private/Script.js';
import type ScriptManager from '../ScriptsManager.js';

class UpdateLinkedUsersScript extends Script {
  constructor(scripts: ScriptManager) {
    super(scripts, {
      enabled: scripts.Application.config.verification.autoRoleUpdater.enabled,
      id: 'updateLinkedUsers',
      interval: scripts.Application.config.verification.autoRoleUpdater.interval * 60 * 60 * 1000
    });
  }

  override async execute(): Promise<void> {
    for (const linkedUser of this.scripts.Application.linked.getLinkedUsers()) {
      const response = await linkedUser.updateRoles();
      if (response === null) throw new HypixelDiscordChatBridgeError("Something wen't wrong with updating");
      console.scripts(`Updated roles for ${linkedUser.discordId} (${linkedUser.uuid})`);
    }
  }
}

export default UpdateLinkedUsersScript;
