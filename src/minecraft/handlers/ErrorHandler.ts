import { EventHandler } from '../../contracts/EventHandler';
import { errorMessage, warnMessage } from '../../Logger';
import { MinecraftManager } from '../MinecraftManager';

export class ErrorHandler extends EventHandler {
  constructor(minecraft: MinecraftManager) {
    super();

    this.minecraft = minecraft;
  }

  registerEvents() {
    global.bot.on('error', (error: any) => this.onError(error));
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
