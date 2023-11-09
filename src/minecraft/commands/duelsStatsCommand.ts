import { minecraftCommand } from '../../contracts/minecraftCommand';
import { hypixel } from '../../contracts/API/HypixelRebornAPI';
import { formatNumber } from '../../contracts/helperFunctions';
import { Duels, Player } from 'hypixel-api-reborn';

export default class DuelsStatsCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'duels';
    this.aliases = ['duel'];
    this.description = 'Duel stats of specified user.';
    this.options = [
      {
        name: 'username',
        description: 'Minecraft username',
        required: false,
      },
      {
        name: 'duel',
        description: 'Type of duel',
        required: false,
      },
    ];
  }

  async onCommand(username: any, message: any) {
    try {
      const duelTypes = [
        'blitz',
        'uhc',
        'parkour',
        'boxing',
        'bowspleef',
        'spleef',
        'arena',
        'megawalls',
        'op',
        'sumo',
        'classic',
        'combo',
        'bridge',
        'nodebuff',
        'bow',
      ];
      const arg = this.getArgs(message) ?? [username];
      let duel;

      if (!arg[0] || arg[0].includes('/')) {
        arg[0] = username;
      }

      if (duelTypes.includes(arg[0].toLowerCase())) {
        duel = arg[0].toLowerCase();
        if (arg[1] && !arg[1].includes('/')) {
          username = arg[1];
        }
      } else {
        username = arg[0];

        if (arg[1] && duelTypes.includes(arg[1].toLowerCase())) {
          duel = arg[1].toLowerCase();
        }
      }

      const player = (await hypixel.getPlayer(username)) as Player;

      if (!duel) {
        this.send(
          `/gc [Duels] [${(player.stats?.duels as Duels).division}] ${username} Wins: ${formatNumber(
            (player.stats?.duels as Duels).wins
          )} | CWS: ${(player.stats?.duels as Duels).winstreak} | BWS: ${
            (player.stats?.duels as Duels).bestWinstreak
          } | WLR: ${(player.stats?.duels as Duels).WLRatio}`
        );
      } else {
        const duelData = (player.stats?.duels as any)[duel]?.[Object.keys((player.stats?.duels as any)[duel])[0]];
        const division = duelData?.division ?? (player.stats?.duels as any)[duel]?.division ?? 'Unknown';
        const wins = duelData?.wins ?? 0;
        const winstreak = duelData?.winstreak ?? 0;
        const bestWinstreak = duelData?.bestWinstreak ?? 0;
        const WLRatio = duelData?.WLRatio ?? 0;

        this.send(
          `/gc [${duel.toUpperCase() ?? 'Unknown'}] [${division}] ${
            username ?? 0
          } Wins: ${wins} | CWS: ${winstreak} | BWS: ${bestWinstreak} | WLR: ${WLRatio}`
        );
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
