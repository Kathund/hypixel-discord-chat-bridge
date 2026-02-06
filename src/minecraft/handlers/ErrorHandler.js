import EventHandler from "../../contracts/EventHandler.js";

class StateHandler extends EventHandler {
  /** @param {import("minecraft-protocol").Client} minecraft */
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
      return console.error("Connection refused while attempting to login via the Minecraft client");
    }

    console.warn(error);
  }

  isConnectionResetError(error) {
    return error.code && error.code === "ECONNRESET";
  }

  isConnectionRefusedError(error) {
    return error.code && error.code === "ECONNREFUSED";
  }
}

export default StateHandler;
