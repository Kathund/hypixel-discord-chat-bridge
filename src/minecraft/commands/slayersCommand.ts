import { formatNumber, formatUsername } from '../../contracts/helperFunctions';
import { getLatestProfile } from '../../../API/functions/getLatestProfile';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { getSlayers } from '../../../API/stats/slayer';
import { capitalize } from 'lodash';

export default class SlayersCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'slayer';
    this.aliases = ['slayers'];
    this.description = 'Slayer of specified user.';
    this.options = [
      {
        name: 'username',
        description: 'Minecraft username',
        required: false,
      },
      {
        name: 'slayer',
        description: 'Slayer type',
        required: false,
      },
    ];
  }

  async onCommand(username: any, message: any) {
    try {
      const args = this.getArgs(message);
      const slayer = [
        'zombie',
        'rev',
        'spider',
        'tara',
        'wolf',
        'sven',
        'eman',
        'enderman',
        'blaze',
        'demonlord',
        'vamp',
        'vampire',
      ];

      const slayerType = slayer.includes(args[1]) ? args[1] : null;
      username = args[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData.cute_name);

      const profile = getSlayers(data.profile);

      if (slayerType) {
        this.send(
          `/gc ${username}'s ${capitalize(slayerType)} - ${
            (profile as any)[slayerType].level
          } Levels | Experience: ${formatNumber((profile as any)[slayerType].xp)}`
        );
      } else {
        const slayer = Object.keys(profile).reduce(
          (acc, slayer) =>
            `${acc} | ${capitalize(slayer)}: ${(profile as any)[slayer].level} (${formatNumber(
              (profile as any)[slayer].xp
            )})`,
          ''
        );
        this.send(`/gc ${username}'s Slayer: ${slayer.slice(3)}`);
      }
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
