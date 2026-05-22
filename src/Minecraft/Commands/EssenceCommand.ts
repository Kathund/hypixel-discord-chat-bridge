import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import { FormatNumber, TitleCase } from '../../Utils/StringUtils.js';
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
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const essenceString = Object.entries(profile.me.currencies)
      .filter(([key]) => key.endsWith('Essence'))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        const name = key.replace('Essence', '');
        return `${TitleCase(name)}: ${FormatNumber(value as number)}`;
      })
      .join(', ');

    this.send(`${username}'s Essence: ${essenceString}`);
  }
}

export default EssenceCommand;
