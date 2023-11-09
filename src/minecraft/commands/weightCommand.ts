import { formatUsername, formatNumber } from '../../contracts/helperFunctions';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { getLatestProfile } from '../../../API/functions/getLatestProfile';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { getWeight } from '../../../API/stats/weight';

export class StatsCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'weight';
    this.aliases = ['w'];
    this.description = 'Skyblock Weight of specified user.';
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

      username = formatUsername(data.profileData?.displayname || username, null);

      const profile = getWeight(data.profile) as any;

      const lilyW = `Lily Weight: ${formatNumber(profile.lily.total)} | Skills: ${formatNumber(
        profile.lily.skills.total
      )} | Slayer: ${formatNumber(profile.lily.slayer.total)} | Dungeons: ${formatNumber(
        profile.lily.catacombs.total
      )}`;
      const senitherW = `Senither Weight: ${formatNumber(profile.senither.total)} | Skills: ${formatNumber(
        Object.keys(profile.senither.skills)
          .map((skill) => profile.senither.skills[skill].total)
          .reduce((a, b) => a + b, 0)
      )} | Dungeons: ${formatNumber(profile.senither.dungeons.total)}`;
      this.send(`/gc ${username}'s ${senitherW}`);
      await delay(690);
      this.send(`/gc ${username}'s ${lilyW}`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
