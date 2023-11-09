import { getLatestProfile } from '../../../API/functions/getLatestProfile';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { formatUsername } from '../../contracts/helperFunctions';

export class CatacombsCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'level';
    this.aliases = ['lvl'];
    this.description = 'Skyblock Level of specified user.';
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

      const experience = data.profile.leveling?.experience ?? 0;
      this.send(`/gc ${username}'s Skyblock Level: ${experience ? experience / 100 : 0}`);
    } catch (error) {
      console.log(error);

      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
