import BasicScript from "../../BasicScript.ts";
import { emptySchedule } from "../../../types/scripts.ts";
import type ScriptManager from "../../ScriptsManager.ts";

class DeleteAllLinkedUsersScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, { id: "deleteAllLinkedUsers", enabled: true, schedule: emptySchedule() });
  }

  override async execute() {
    const linkedUsers = await this.scripts.application.data.linked.getFullData();
    for (const linkedUser of linkedUsers) {
      await linkedUser.delete();
      await this.log(`Deleted link for <@${linkedUser.discordId}> (${linkedUser.discordId} - ${linkedUser.uuid})`);
    }
  }
}

export default DeleteAllLinkedUsersScript;
