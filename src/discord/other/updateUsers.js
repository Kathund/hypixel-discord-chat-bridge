import ForceUpdateCommand from "../commands/forceUpdateCommand.js";
import config from "../../../config.json" with { type: "json" };
import cron from "node-cron";

if (config.verification.autoRoleUpdater.enabled) {
  console.discord(`RoleSync ready, executing every ${config.verification.autoRoleUpdater.interval} hours.`);
  cron.schedule(`0 */${config.verification.autoRoleUpdater.interval} * * *`, async () => {
    try {
      await new ForceUpdateCommand().onCommand(null, { everyone: true, hidden: true });
    } catch (error) {
      console.error(error);
    }
  });
}
