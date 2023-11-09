import { errorMessage, warnMessage } from "../.././Logger.js";
import { EventHandler } from "../../contracts/EventHandler.js";

export class ErrorHandler extends EventHandler {
  constructor(minecraft) {
    super();

    this.minecraft = minecraft;
  }

  registerEvents(bot) {
    this.bot = bot;

    this.bot.on("error", (...args) => this.onError(...args));
  }

  onError(error) {
    if (this.isConnectionResetError(error)) return;

    if (this.isConnectionRefusedError(error)) {
      return errorMessage("Connection refused while attempting to login via the Minecraft client");
    }

    warnMessage(error);
  }

  isConnectionResetError(error) {
    return error.code && error.code == "ECONNRESET";
  }

  isConnectionRefusedError(error) {
    return error.code && error.code == "ECONNREFUSED";
  }
}
