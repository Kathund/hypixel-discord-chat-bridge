import { minecraftCommand } from '../../contracts/minecraftCommand';

export class HelpCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: never[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'help';
    this.aliases = ['info'];
    this.description = 'Shows help menu';
    this.options = [];
  }

  onCommand(username: any, message: any) {
    try {
      this.send(`/gc https://imgur.com/jUX06BC.png`);
    } catch (error) {
      this.send('/gc [ERROR] Something went wrong..');
    }
  }
}
