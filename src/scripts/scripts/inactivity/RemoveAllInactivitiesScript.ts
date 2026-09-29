import BasicScript from "../../BasicScript.ts";
import { emptySchedule } from "../../../types/scripts.ts";
import type ScriptManager from "../../ScriptsManager.ts";

class RemoveAllInactivitiesScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, { id: "removeAllInactivities", enabled: true, schedule: emptySchedule() });
  }

  override async execute() {
    const users = await this.scripts.application.data.inactivity.getFullData();
    for (const user of users) await user.delete();
  }
}

export default RemoveAllInactivitiesScript;
