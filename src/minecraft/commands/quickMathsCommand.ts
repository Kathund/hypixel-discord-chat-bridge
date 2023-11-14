const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { minecraft as minecraftConfig } from '../../../config.json';
import { MinecraftManager } from '../MinecraftManager';

const getAnswer = (message: string) => {
  if (message.includes(minecraftConfig.bot.messageFormat)) {
    return message.split(minecraftConfig.bot.messageFormat)[1].trim();
  }

  return message.split(': ')[1];
};

export default class QuickMathsCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: never[];
  constructor(minecraft: MinecraftManager) {
    super(minecraft);

    this.name = 'quickmaths';
    this.aliases = ['qm'];
    this.description = 'Solve the equation in less than 10 seconds! Test your math skills!';
    this.options = [];
  }

  async onCommand(username: string) {
    try {
      const userUsername = username;
      const operands = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
      const operators = ['+', '-', '*'];
      const operator = operators[Math.floor(Math.random() * operators.length)];

      const equation = `${operands[0]} ${operator} ${operands[1]}`;
      const answer = eval(operands.join(operator));
      const headStart = 250;

      this.send(`/gc ${username} What is ${equation}? (You have ${headStart}ms headstart)`);
      await delay(headStart);

      const startTime = Date.now();
      let answered = false;

      const listener = (username: string, message: string) => {
        if (getAnswer(message) !== answer.toString()) {
          return;
        }

        answered = true;
        this.send(`/gc ${userUsername} Correct! It took you ${(Date.now() - startTime).toLocaleString()}ms`);
        global.bot.removeListener('chat', listener);
      };

      global.bot.on('chat', listener);

      setTimeout(() => {
        global.bot.removeListener('chat', listener);

        if (!answered) {
          this.send(`/gc ${userUsername} Time's up! The answer was ${answer}`);
        }
      }, 10000);
    } catch (error) {
      this.send(`/gc ${username} [ERROR] ${error || 'Something went wrong..'}`);
    }
  }
}
