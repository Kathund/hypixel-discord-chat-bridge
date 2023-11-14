import { minecraftCommand } from '../../contracts/minecraftCommand';
import { MinecraftManager } from '../MinecraftManager';

export default class HelpCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: never[];
  constructor(minecraft: MinecraftManager) {
    super(minecraft);

    this.name = 'help';
    this.aliases = ['info'];
    this.description = 'Shows help menu';
    this.options = [];
  }

  onCommand() {
    try {
      this.send(`/gc https://imgur.com/jUX06BC.png`);
    } catch (error) {
      this.send('/gc [ERROR] Something went wrong..');
    }
  }
}
