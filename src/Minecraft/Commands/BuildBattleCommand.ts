import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import { FormatNumber } from '../../Utils/StringUtils.js';
import { getPlayer } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

// CREDITS: by @Kathund (https://github.com/Kathund)
class BuildBattleCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('buildbattle')
      .setDescription('Build Battle Stats of specified user.')
      .setAliases(['bb'])
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { title, tokens, score, wins, winsSpeedBuilders, winsGuessTheBuild } = hypixelPlayer.stats.BuildBattle;
    this.send(
      `${title} ${hypixelPlayer.nickname}'s Build Battle Wins: ${FormatNumber(wins)} Speed Builders Wins: ${FormatNumber(
        winsSpeedBuilders
      )} GTB Wins: ${FormatNumber(winsGuessTheBuild)} | Score: ${FormatNumber(score)} | Tokens: ${FormatNumber(tokens)}`
    );
  }
}

export default BuildBattleCommand;
