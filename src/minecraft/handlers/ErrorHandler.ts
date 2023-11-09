import { EventHandler } from '../../contracts/EventHandler';
import { errorMessage, warnMessage } from '../../Logger';

export class ErrorHandler extends EventHandler {
  bot: any;
  constructor(minecraft: any) {
    super();

    this.minecraft = minecraft;
  }

  registerEvents(bot: any) {
    this.bot = bot;

    this.bot.on('error', (error: any) => this.onError(error));
  }

  onError(error: any) {
    if (this.isConnectionResetError(error)) return;

    if (this.isConnectionRefusedError(error)) {
      return errorMessage('Connection refused while attempting to login via the Minecraft client');
    }

    warnMessage(error);
  }

  isConnectionResetError(error: any) {
    return error.code && error.code == 'ECONNRESET';
  }

  isConnectionRefusedError(error: any) {
    return error.code && error.code == 'ECONNREFUSED';
  }
}
