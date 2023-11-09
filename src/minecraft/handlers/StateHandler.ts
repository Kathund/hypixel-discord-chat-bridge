import { minecraftMessage, warnMessage } from '../../Logger';
import { EventHandler } from '../../contracts/EventHandler';

export class StateHandler extends EventHandler {
  loginAttempts: number;
  exactDelay: number;
  bot: any;
  constructor(minecraft: any) {
    super();

    this.minecraft = minecraft;
    this.loginAttempts = 0;
    this.exactDelay = 0;
  }

  registerEvents(bot: any) {
    this.bot = bot;

    this.bot.on('login', () => this.onLogin());
    this.bot.on('end', (msg: any) => this.onEnd(msg));
    this.bot.on('kicked', (msg: any) => this.onKicked(msg));
  }

  onLogin() {
    minecraftMessage('Client ready, logged in as ' + this.bot.username);

    this.loginAttempts = 0;
    this.exactDelay = 0;
  }

  onEnd(reason: any) {
    if (reason === 'restart') {
      return;
    }

    const loginDelay = this.exactDelay > 60000 ? 60000 : (this.loginAttempts + 1) * 5000;
    warnMessage(`Minecraft bot has disconnected! Attempting reconnect in ${loginDelay / 1000} seconds`);

    setTimeout(() => this.minecraft.connect(), loginDelay);
  }

  onKicked(reason: any) {
    warnMessage(`Minecraft bot has been kicked from the server for "${reason}"`);

    this.loginAttempts++;
  }
}
