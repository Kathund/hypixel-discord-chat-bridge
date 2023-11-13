import { capitalize, formatNumber } from '../../contracts/helperFunctions';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { hypixel } from '../../contracts/API/HypixelRebornAPI';
import { Player, BedWars } from 'hypixel-api-reborn';

export default class BedwarsCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'bedwars';
    this.aliases = ['bw', 'bws'];
    this.description = 'BedWars stats of specified user.';
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
      const msg = this.getArgs(message).map((arg: { replaceAll: (arg0: string, arg1: string) => any }) =>
        arg.replaceAll('/', '')
      );
      const modes = ['solo', 'doubles', 'threes', 'fours', '4v4'];

      const mode = modes.includes(msg[0]) ? msg[0] : 'overall';
      username = modes.includes(msg[0]) ? msg[1] : msg[0] || username;

      const player = (await hypixel.getPlayer(username)) as Player;

      if (['overall', 'all'].includes(mode)) {
        const { level, finalKills, finalKDRatio, wins, WLRatio, winstreak } = player.stats?.bedwars as BedWars;
        const { broken, BLRatio } = (player.stats?.bedwars as BedWars).beds;

        this.send(
          `/gc [${level}✫] ${
            player.nickname
          } FK: ${formatNumber(finalKills)} FKDR: ${finalKDRatio} W: ${formatNumber(wins)} WLR: ${WLRatio} BB: ${formatNumber(broken)} BLR: ${BLRatio} WS: ${winstreak}`
        );
      } else if (mode !== undefined) {
        const { level } = player.stats?.bedwars as BedWars;
        const { finalKills, finalKDRatio, wins, WLRatio, winstreak } = (player.stats?.bedwars as any)[mode];
        const { broken, BLRatio } = (player.stats?.bedwars as BedWars as any)[mode].beds;

        this.send(
          `/gc [${level}✫] ${player.nickname} ${capitalize(
            mode
          )} FK: ${formatNumber(finalKills)} FKDR: ${finalKDRatio} Wins: ${formatNumber(wins)} WLR: ${WLRatio} BB: ${formatNumber(broken)} BLR: ${BLRatio} WS: ${winstreak}`
        );
      } else {
        this.send('/gc Invalid mode. Valid modes: overall, solo, doubles, threes, fours, 4v4');
      }
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
