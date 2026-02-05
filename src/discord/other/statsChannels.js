import UpdateCommand from "../commands/updateCommand.js";
import config from "../../../config.json" with { type: "json" };
import cron from "node-cron";

if (config.statsChannels.enabled) {
  cron.schedule(`*/${config.statsChannels.autoUpdaterInterval} * * * *`, () => new UpdateCommand().onCommand(null, { hidden: true }));
  console.discord(`StatsChannels ready, executing every ${config.statsChannels.autoUpdaterInterval} minutes.`);
}
