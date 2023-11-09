//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
import { buildSkyblockCalendar } from '../constants/calendar.js';
export const getSkyblockCalendar = () => {
  try {
    const calendar = buildSkyblockCalendar(null, Date.now(), Date.now() + 10710000000, 1, false);

    return { status: 200, data: calendar };
  } catch (error) {
    return { status: 404, reason: error };
  }
};
