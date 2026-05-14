import CommunicationBridge from "../Private/CommunicationBridge.js";
import type Application from "../Application.js";
import type { Bot } from "mineflayer";
import type { MinecraftManagerWithBot } from "../Types/Minecraft.js";

class MinecraftManager extends CommunicationBridge {
  readonly app: Application;
  bot?: Bot;
  constructor(app: Application) {
    super(app.discord);
    this.app = app;
  }

  isBotOnline(): this is MinecraftManagerWithBot {
    // eslint-disable-next-line no-underscore-dangle
    return this.bot?._client?.chat !== undefined;
  }
}

export default MinecraftManager;
