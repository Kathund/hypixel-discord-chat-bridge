import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import { FormatNumber } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

// CREDITS: by @Kathund (https://github.com/Kathund)
class HotmCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('hotm')
      .setDescription('Skyblock Hotm Stats of specified user.')
      .setAliases(['mining'])
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { level } = profile.me.skillTrees.mining;
    const { powder, pickaxeAbility } = profile.me.mining;
    this.send(
      `${username}'s Hotm: ${level.level} | Gemstone Powder: ${FormatNumber(powder.gemstone.total)} | Mithril Powder: ${FormatNumber(
        powder.mithril.total
      )} | Glacite Powder: ${FormatNumber(powder.glacite.total)} | Selected Ability: ${pickaxeAbility}`
    );
  }
}

export default HotmCommand;
