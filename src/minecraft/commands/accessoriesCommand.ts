import { getLatestProfile } from '../../../API/functions/getLatestProfile';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { formatUsername } from '../../contracts/helperFunctions';
import { getTalismans } from '../../../API/stats/talismans';

export default class AccessoriesCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'accessories';
    this.aliases = ['acc', 'talismans', 'talisman'];
    this.description = 'Accessories of specified user.';
    this.options = [
      {
        name: 'username',
        description: 'Minecraft username',
        required: false,
      },
    ];
  }

  async onCommand(username: any, message: any) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const talismans = (await getTalismans(data.profile)) as any;
      const rarities = Object.keys(talismans)
        .map((key) => {
          if (['recombed', 'enriched', 'total'].includes(key)) return;

          return [`${talismans[key]}${key[0].toUpperCase()}`];
        })
        .filter((x) => x)
        .join(', ');

      this.send(
        `/gc ${username}'s Accessories: ${talismans?.total ?? 0} (${rarities}), Recombed: ${
          talismans?.recombed ?? 0
        }, Enriched: ${talismans?.enriched ?? 0}`
      );
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
