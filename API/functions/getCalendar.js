//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
import { buildSkyblockCalendar } from "../constants/calendar.js";

export function getSkyblockCalendar() {
  try {
    const calendar = buildSkyblockCalendar(null, Date.now(), Date.now() + 10710000000, 1, false);

    return calendar;
  } catch (error) {
    return null;
  }
}
