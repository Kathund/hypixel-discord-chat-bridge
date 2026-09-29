import BasicScript from "../../BasicScript.ts";
import { emptySchedule } from "../../../types/scripts.ts";
import type ScriptManager from "../../ScriptsManager.ts";

class ResetAllLinkedUsersScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, { id: "resetAllLinkedUsers", enabled: true, schedule: emptySchedule() });
  }

  override async execute() {
    const linkedUsers = await this.scripts.application.data.linked.getFullData();
    for (const linkedUser of linkedUsers) {
      await linkedUser.reset();
      await this.log(`Reset link for <@${linkedUser.discordId}> (${linkedUser.discordId} - ${linkedUser.uuid})`);
    }
  }
}

export default ResetAllLinkedUsersScript;
