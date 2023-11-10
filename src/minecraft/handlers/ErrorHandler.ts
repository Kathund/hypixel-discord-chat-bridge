import { EventHandler } from '../../contracts/EventHandler';
import { errorMessage, warnMessage } from '../../Logger';

export class ErrorHandler extends EventHandler {
  bot: any;
  constructor(minecraft: any) {
    super();

    this.minecraft = minecraft;
  }

  registerEvents() {
    this.bot = global.bot;
    this.bot.on('error', (error: Error) => this.onError(error));
  }

  onError(error: Error) {
    if (this.isConnectionResetError(error)) return;

    if (this.isConnectionRefusedError(error)) {
      return errorMessage('Connection refused while attempting to login via the Minecraft client');
    }

    warnMessage(error);
  }

  isConnectionResetError(error: Error) {
    return error.code && error.code == 'ECONNRESET';
  }

  isConnectionRefusedError(error: Error) {
    return error.code && error.code == 'ECONNREFUSED';
  }
}
