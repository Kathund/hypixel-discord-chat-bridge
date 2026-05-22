import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import { FormatNumber } from '../../Utils/StringUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class CalculateCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('calculate')
      .setDescription('Calculate.')
      .setAliases(['math', 'calc'])
      .setOptions([new CommandDataOption().setName('calculation').setRequired(true)]);
  }

  override execute(player: string, message: string) {
    const calculation = message.replace(/[^-()\d/*+.]/g, '');
    if (calculation.trim() === '9+10') return this.send('9 + 10 = 21');
    const answer = eval(calculation);
    if (answer === Infinity) return this.send('Something went wrong.. Somehow you broke it (the answer was infinity)');
    if (answer > 1000000) return this.send(`${calculation} = ${FormatNumber(answer)} (${answer.toLocaleString()})`);
    return this.send(`${calculation} = ${FormatNumber(answer)}`);
  }
}

export default CalculateCommand;
