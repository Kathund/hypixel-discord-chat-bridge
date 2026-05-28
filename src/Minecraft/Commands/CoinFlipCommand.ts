import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

// CREDITS: by @CarsonCodes (https://github.com/CarsonCodess)
class CoinFlipCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData().setName('coinflip').setDescription('Flips a coin.').setAliases(['coin']);
  }

  override execute(player: string, message: string) {
    const randNum = Math.random();
    if (randNum <= 0.5) this.send('Heads!');
    else this.send('Tails!');
  }
}

export default CoinFlipCommand;
