import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import { FormatNumber } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

// CREDITS: by @Kathund (https://github.com/Kathund)
class KuudraCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('kuudra')
      .setDescription('Kuudra Stats of specified user.')
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { basicCompletions, hotCompletions, burningCompletions, fieryCompletions, infernalCompletions } = profile.me.crimsonIsle.kuudra;
    this.send(
      `${username}'s Basic: ${FormatNumber(basicCompletions)} | Hot: ${FormatNumber(hotCompletions)} | Burning: ${FormatNumber(
        burningCompletions
      )} | Fiery: ${FormatNumber(fieryCompletions)} | Infernal: ${FormatNumber(infernalCompletions)}`
    );
  }
}

export default KuudraCommand;
