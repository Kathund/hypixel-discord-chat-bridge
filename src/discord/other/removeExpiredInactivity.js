import { removeExpiredInactivity } from "../commands/inactivityCommand.js";
import config from "../../../config.json" with { type: "json" };
import cron from "node-cron";

if (config.verification.inactivity.enabled) cron.schedule(`*/2 * * * *`, () => removeExpiredInactivity());
