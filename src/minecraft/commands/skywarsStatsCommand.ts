import { minecraftCommand } from '../../contracts/minecraftCommand';
import { hypixel } from '../../contracts/API/HypixelRebornAPI';
import { Player, SkyWars } from 'hypixel-api-reborn';
export default class SkywarsCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'skywars';
    this.aliases = ['sw'];
    this.description = 'Skywars stats of specified user.';
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

      const player = (await hypixel.getPlayer(username)) as Player;

      const { level, KDRatio, WLRatio, winstreak } = player.stats?.skywars as SkyWars;

      this.send(`/gc [${level}✫] ${player.nickname} | KDR: ${KDRatio} | WLR: ${WLRatio} | WS: ${winstreak}`);
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
