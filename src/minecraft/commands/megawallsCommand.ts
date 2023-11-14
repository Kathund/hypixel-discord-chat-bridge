import { minecraftCommand } from '../../contracts/minecraftCommand';
import { hypixel } from '../../contracts/API/HypixelRebornAPI';
import { MinecraftManager } from '../MinecraftManager';
import { MegaWalls } from 'hypixel-api-reborn';

export default class MegaWallsCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: MinecraftManager) {
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

  async onCommand(username: string, message: string) {
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
