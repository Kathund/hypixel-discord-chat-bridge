import { minecraftCommand } from '../../contracts/minecraftCommand';
import { hypixel } from '../../contracts/API/HypixelRebornAPI';
import { UHC } from 'hypixel-api-reborn';

export class UHCStatsCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'UHC';
    this.aliases = ['uhc'];
    this.description = 'UHC Stats of specified user.';
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

      const player = await hypixel.getPlayer(username);

      const { starLevel, kills, deaths, wins, headsEaten } = player.stats?.uhc as UHC;

      this.send(`/gc [${starLevel}✫] ${player.nickname} | KDR: ${kills / deaths} | W: ${wins} | Heads: ${headsEaten}`);
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
