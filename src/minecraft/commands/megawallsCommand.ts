import { minecraftCommand } from '../../contracts/minecraftCommand';
import { hypixel } from '../../contracts/API/HypixelRebornAPI';
import { MegaWalls } from 'hypixel-api-reborn';

export class MegaWallsCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'megawalls';
    this.aliases = ['mw'];
    this.description = 'View the Megawalls stats of a player';
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

      const { stats } = await hypixel.getPlayer(username);

      const {
        selectedClass = 'None',
        finalKills,
        finalKDRatio,
        wins,
        WLRatio,
        kills,
        KDRatio,
        assists,
      } = stats?.megawalls as MegaWalls;

      this.send(
        `/gc ${username}'s Megawalls: Class: ${
          selectedClass ?? 'None'
        } | FK: ${finalKills} | FKDR: ${finalKDRatio} | W: ${wins} | WLR: ${WLRatio} | K: ${kills} | KDR: ${KDRatio} | A: ${assists}`
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
