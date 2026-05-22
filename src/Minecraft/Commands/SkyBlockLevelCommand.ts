import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class SkyBlockLevelCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('level')
      .setDescription('Skyblock Level of specified user.')
      .setAliases(['lvl'])
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    const args = this.getArgs(message);
    player = args[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    this.send(`${username}'s Skyblock Level: ${profile.me.leveling.level}`);
  }
}

export default SkyBlockLevelCommand;
