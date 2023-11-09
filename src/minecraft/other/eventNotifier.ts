const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { getSkyblockCalendar } from '../../../API/functions/getCalendar';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { minecraft } from '../../../config.json';
import axios from 'axios';

if (minecraft.skyblockEventsNotifications.enabled) {
  const { notifiers, customTime } = minecraft.skyblockEventsNotifications;

  setInterval(async () => {
    try {
      const eventBOT = new minecraftCommand(bot);
      const EVENTS = getSkyblockCalendar();
      for (const event in (EVENTS.data as any).events) {
        const eventData = ((EVENTS.data as any).events as any)[event];
        if ((notifiers as any)[event] === false) {
          continue;
        }

        if (eventData.events[0].start_timestamp < Date.now()) {
          continue;
        }

        const minutes = Math.floor((eventData.events[0].start_timestamp - Date.now()) / 1000 / 60);

        let extraInfo = '';
        if (event == 'JACOBS_CONTEST') {
          const { data: jacobResponse } = await axios.get('https://dawjaw.net/jacobs');
          const jacobCrops = jacobResponse.find(
            (crop: any) => crop.time >= Math.floor(eventData.events[0].start_timestamp / 1000)
          );

          if (jacobCrops?.crops !== undefined) {
            extraInfo = ` (${jacobCrops.crops.join(', ')})`;
          }
        }

        const cTime = getCustomTime(customTime, event);
        if ((cTime as any).length !== 0 && (cTime as any).includes(minutes.toString())) {
          eventBOT.send(`/gc [EVENT] ${eventData.name}${extraInfo}: ${minutes}m`);
          await delay(1500);
        }

        if (minutes == 0) {
          eventBOT.send(`/gc [EVENT] ${eventData.name}${extraInfo}: NOW`);
          await delay(1500);
        }
      }
    } catch (e) {
      console.log(e);
      /* empty */
    }
  }, 60000);
}

function getCustomTime(events: any, value: any) {
  if (events === undefined || value === undefined) {
    return false;
  }

  return Object.keys(events).filter((key) => events[key].includes(value));
}
