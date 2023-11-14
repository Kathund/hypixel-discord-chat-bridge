import { minecraftMessage, warnMessage } from '../../Logger';
import { EventHandler } from '../../contracts/EventHandler';
import { MinecraftManager } from '../MinecraftManager';

export class StateHandler extends EventHandler {
  loginAttempts: number;
  exactDelay: number;
  minecraft: MinecraftManager;
  constructor(minecraft: MinecraftManager) {
    super();

    this.minecraft = minecraft;
    this.loginAttempts = 0;
    this.exactDelay = 0;
  }

  registerEvents() {
    global.bot.on('login', () => this.onLogin());
    global.bot.on('end', (msg: string) => this.onEnd(msg));
    global.bot.on('kicked', (msg: string) => this.onKicked(msg));
  }

  onLogin() {
    minecraftMessage('Client ready, logged in as ' + global.bot.username);

    this.loginAttempts = 0;
    this.exactDelay = 0;
  }

  onEnd(reason: string) {
    if (reason === 'restart') {
      return;
    }

    const loginDelay = this.exactDelay > 60000 ? 60000 : (this.loginAttempts + 1) * 5000;
    warnMessage(`Minecraft bot has disconnected! Attempting reconnect in ${loginDelay / 1000} seconds`);

    setTimeout(() => this.minecraft.connect(), loginDelay);
  }

  onKicked(reason: string) {
    warnMessage(`Minecraft bot has been kicked from the server for "${reason}"`);

    this.loginAttempts++;
  }
}
