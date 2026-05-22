import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import { FormatNumber } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

// CREDITS: by @Kathund (https://github.com/Kathund)
class EssenceCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('essence')
      .setDescription('Skyblock Dungeons Stats of specified user.')
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    const args = this.getArgs(message);
    player = args[0] || player;

    const { username, profile } = await getSelectedProfile(player);
    const { crimsonEssence, diamondEssence, dragonEssence, goldEssence, iceEssence, spiderEssence, witherEssence, undeadEssence } = profile.me.currencies;

    this.send(
      `${username}'s Essence: Crimson: ${FormatNumber(crimsonEssence)}, Diamond: ${FormatNumber(diamondEssence)}, Dragon: ${FormatNumber(
        dragonEssence
      )}, Gold: ${FormatNumber(goldEssence)}, Ice: ${FormatNumber(iceEssence)}, Spider: ${FormatNumber(spiderEssence)}, Wither: ${FormatNumber(
        witherEssence
      )}, Undead: ${FormatNumber(undeadEssence)}`
    );
  }
}

export default EssenceCommand;
