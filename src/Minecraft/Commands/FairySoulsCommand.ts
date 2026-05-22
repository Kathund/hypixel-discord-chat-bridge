import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class FairySoulsCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('fairysouls')
      .setDescription('Fairy Souls of specified user.')
      .setAliases(['fs', 'fairysoul'])
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { collected } = profile.me.fairySouls;
    const total = profile.gameMode === 'island' ? 5 : 266;

    this.send(`${username}'s Fairy Souls: ${collected} / ${total} | Progress: ${((collected / total) * 100).toFixed(2)}%`);
  }
}

export default FairySoulsCommand;
