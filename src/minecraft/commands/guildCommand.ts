import { capitalize, formatNumber } from '../../contracts/helperFunctions';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { hypixel } from '../../contracts/API/HypixelRebornAPI';

export class GuildInformationCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'guild';
    this.aliases = ['g'];
    this.description = 'View information of a guild';
    this.options = [
      {
        name: 'guild',
        description: 'Guild name',
        required: true,
      },
    ];
  }

  async onCommand(username: any, message: any) {
    try {
      const guildName = this.getArgs(message)
        .map((arg: any) => capitalize(arg))
        .join(' ');

      const guild = await hypixel.getGuild('name', guildName, {});

      this.send(
        `/gc Guild ${guildName} | Tag: [${guild.tag}] | Members: ${guild.members.length} | Level: ${
          guild.level
        } | Weekly GEXP: ${formatNumber(guild.totalWeeklyGexp)}`
      );
    } catch (error: any) {
      this.send(
        `/gc ${error
          .toString()
          .replace('[hypixel-api-reborn] ', '')
          .replace('For help join our Discord Server https://discord.gg/NSEBNMM', '')
          .replace('Error:', '[ERROR]')}`
      );
    }
  }
}
