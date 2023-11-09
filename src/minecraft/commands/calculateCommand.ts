import { minecraftCommand } from '../../contracts/minecraftCommand';
import { formatNumber } from '../../contracts/helperFunctions';

export class CalculateCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'calculate';
    this.aliases = ['calc', 'math'];
    this.description = 'Calculate.';
    this.options = [
      {
        name: 'calculation',
        description: 'Any kind of math equation',
        required: true,
      },
    ];
  }

  onCommand(username: any, message: any) {
    try {
      const calculation = message.replace(/[^-()\d/*+.]/g, '');
      const answer = eval(calculation);

      if (answer === Infinity) {
        return this.send(`/gc Something went wrong.. Somehow you broke it (the answer was infinity)`);
      }

      this.send(`/gc ${calculation} = ${formatNumber(answer)} (${answer.toLocaleString()})`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
