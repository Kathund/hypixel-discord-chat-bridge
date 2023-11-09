import { minecraftCommand } from '../../contracts/minecraftCommand';
import { getFetchur } from '../../../API/functions/getFetchur';

export default class FetchurCommand extends minecraftCommand {
  name: string;
  aliases: never[];
  description: string;
  options: never[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'fetchur';
    this.aliases = [];
    this.description = 'Information about an item for Fetchur.';
    this.options = [];
  }

  async onCommand(username: any, message: any) {
    try {
      const { text, description } = getFetchur();

      this.send(`/gc Fetchur Requests: ${text} | Description: ${description}`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error || 'Something went wrong..'}`);
    }
  }
}
