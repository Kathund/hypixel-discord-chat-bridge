import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import { getPlayer } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class EightBallCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('megawalls')
      .setDescription('View the Megawalls stats of a player')
      .setAliases(['mw'])
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { selectedClass, finalKills, FKDR, wins, WLR, kills, KDR, assists } = hypixelPlayer.stats.MegaWalls;
    this.send(
      `${player}'s Megawalls: Class: ${selectedClass} | FK: ${finalKills} | FKDR: ${FKDR} | W: ${wins} | WLR: ${WLR} | K: ${kills} | KDR: ${KDR} | A: ${assists}`
    );
  }
}

export default EightBallCommand;
