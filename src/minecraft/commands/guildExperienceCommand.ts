import { minecraftCommand } from '../../contracts/minecraftCommand';
import { hypixel } from '../../contracts/API/HypixelRebornAPI';
import { getUUID } from '../../contracts/API/PlayerDBAPI';
import { MinecraftManager } from '../MinecraftManager';

export default class GuildExperienceCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: MinecraftManager) {
    super(minecraft);

    this.name = 'guildexp';
    this.aliases = ['gexp'];
    this.description = 'Guilds experience of specified user.';
    this.options = [
      {
        name: 'username',
        description: 'Minecraft username',
        required: false,
      },
    ];
  }

  async onCommand(username: string, message: string) {
    username = this.getArgs(message)[0] || username;

    try {
      const [uuid, guild] = await Promise.all([getUUID(username), hypixel.getGuild('player', username, {})]);

      const player = guild.members.find((member) => member.uuid == uuid);

      if (player === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw 'Player is not in the Guild.';
      }

      this.send(`/gc ${username}'s Weekly Guild Experience: ${player.weeklyExperience.toLocaleString()}.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.send(
          `/gc ${error
            .toString()
            .replace('[hypixel-api-reborn] ', '')
            .replace('For help join our Discord Server https://discord.gg/NSEBNMM', '')
            .replace('Error:', '[ERROR]')}`
        );
      } else {
        this.send('/gc Something went wrong');
        console.log(error);
      }
    }
  }
}
