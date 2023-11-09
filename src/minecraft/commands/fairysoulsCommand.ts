import { getLatestProfile } from '../../../API/functions/getLatestProfile';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { formatUsername } from '../../contracts/helperFunctions';

export default class FairySoulsCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'fairysouls';
    this.aliases = ['fs'];
    this.description = 'Fairy Souls of specified user.';
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
      username = formatUsername(username, data.profileData.game_mode);

      const total = data.profileData.game_mode === 'island' ? 5 : 242;

      const { fairy_souls_collected } = data.profile;

      this.send(
        `/gc ${username}'s Fairy Souls: ${fairy_souls_collected}/${total} | Progress: ${(
          (fairy_souls_collected / total) *
          100
        ).toFixed(2)}%`
      );
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
