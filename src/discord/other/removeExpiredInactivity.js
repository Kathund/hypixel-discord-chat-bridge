import config from "../../../config.json" with { type: "json" };
import cron from "node-cron";
import { removeExpiredInactivity } from "../commands/inactivityCommand.js";

if (config.verification.inactivity.enabled) cron.schedule(`*/2 * * * *`, () => removeExpiredInactivity());
