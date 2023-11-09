import { minecraftMessage, warnMessage } from "../../Logger.js";
import { EventHandler } from "../../contracts/EventHandler.js";

export class StateHandler extends EventHandler {
  constructor(minecraft) {
    super();

    this.minecraft = minecraft;
    this.loginAttempts = 0;
    this.exactDelay = 0;
  }

  registerEvents(bot) {
    this.bot = bot;

    this.bot.on("login", (...args) => this.onLogin(...args));
    this.bot.on("end", (...args) => this.onEnd(...args));
    this.bot.on("kicked", (...args) => this.onKicked(...args));
  }

  onLogin() {
    minecraftMessage("Client ready, logged in as " + this.bot.username);

    this.loginAttempts = 0;
    this.exactDelay = 0;
  }

  onEnd(reason) {
    if (reason === "restart") {
      return;
    }

    const loginDelay = this.exactDelay > 60000 ? 60000 : (this.loginAttempts + 1) * 5000;
    warnMessage(`Minecraft bot has disconnected! Attempting reconnect in ${loginDelay / 1000} seconds`);

    setTimeout(() => this.minecraft.connect(), loginDelay);
  }

  onKicked(reason) {
    warnMessage(`Minecraft bot has been kicked from the server for "${reason}"`);

    this.loginAttempts++;
  }
}
