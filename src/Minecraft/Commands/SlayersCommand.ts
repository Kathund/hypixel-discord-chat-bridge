import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import { FormatNumber, TitleCase } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';
import type { SkyBlockMemberSlayer } from 'hypixel-api-reborn';

class SlayersCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('slayer')
      .setDescription('Slayer of specified user.')
      .setAliases(['slayers'])
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    const args = this.getArgs(message);
    player = args[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const slayers = profile.me.slayers;

    const slayer = Object.keys(slayers)
      .filter((slayer) => !['activeSlayer'].includes(slayer))
      .filter((key) => key !== 'activeSlayer')
      .map((slayer) => {
        const data: SkyBlockMemberSlayer = slayers[slayer as keyof typeof slayers] as SkyBlockMemberSlayer;
        return `${TitleCase(slayer)}: ${data.level.level} (${FormatNumber(data.level.xp)})`;
      });
    this.send(`${username}'s Slayer: ${slayer.join(' | ')}`);
  }
}

export default SlayersCommand;
