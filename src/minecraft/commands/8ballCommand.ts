import { minecraftCommand } from '../../contracts/minecraftCommand';
import axios from 'axios';

export class EightBallCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = '8ball';
    this.aliases = ['8b'];
    this.description = 'Ask an 8ball a question.';
    this.options = [
      {
        name: 'question',
        description: 'The question you want to ask the 8ball',
        required: true,
      },
    ];
  }

  async onCommand(username: any, message: any) {
    try {
      if (this.getArgs(message).length === 0) {
        // eslint-disable-next-line no-throw-literal
        throw 'You must provide a question.';
      }

      const { data } = await axios.get(`https://www.eightballapi.com/api`);

      this.send(`/gc ${data.reading}`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
