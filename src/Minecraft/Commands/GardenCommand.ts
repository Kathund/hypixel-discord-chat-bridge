import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import { FormatNumber, TitleCaseCamel } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

// CREDITS: by @Kathund (https://github.com/Kathund)
class GardenCommand extends Command {
  private readonly keyRemap: Record<string, string>;
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('garden')
      .setDescription('Skyblock Garden Stats of specified user.')
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
    // prettier-ignore
    this.keyRemap = { 'Nether Wart': 'Wart', 'Sugar Cane': 'Cane', 'Sun Flower': 'SF', 'Wild Rose': 'WR', 'Cocoa Beans': 'Cocoa', Average: 'Avg' };
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player, { garden: true });
    if (profile.garden === null) throw new HypixelDiscordChatBridgeError(`${username} does not have a garden.`);

    const milestoneString = Object.entries(profile.garden.cropMilestones)
      .filter(([key]) => key !== 'toString')
      .sort(([a], [b]) => {
        if (a === 'average') return -1;
        if (b === 'average') return 1;
        return a.localeCompare(b);
      })
      .map(([key, value]) => {
        const rawName = TitleCaseCamel(key);
        const name = this.keyRemap[rawName] !== undefined ? this.keyRemap[rawName] : rawName;
        return `${name}: ${key === 'average' ? FormatNumber(value, 2) : value.level}`;
      })
      .join(' | ');

    this.send(`${username}'s Garden ${profile.garden.level.level} | Milestones: ${milestoneString}`);
  }
}

export default GardenCommand;
