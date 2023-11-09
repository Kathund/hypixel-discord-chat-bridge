import { discord as discordConfig, minecraft } from "../../config.json";
import CommunicationBridge from "../contracts/CommunicationBridge.js";
import { replaceVariables } from "../contracts/helperFunctions.js";
import { StateHandler } from "./handlers/StateHandler.js";
import { ErrorHandler } from "./handlers/ErrorHandler.js";
import { ChatHandler } from "./handlers/ChatHandler.js";
import { CommandHandler } from "./CommandHandler.js";
import { broadcastMessage } from "../Logger.js";
import { createBot } from "mineflayer";
import Filter from "bad-words";

const filter = new Filter();

export class MinecraftManager extends CommunicationBridge {
  constructor(app) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.errorHandler = new ErrorHandler(this);
    this.chatHandler = new ChatHandler(this, new CommandHandler(this));
  }

  connect() {
    global.bot = this.createBotConnection();
    this.bot = bot;

    this.errorHandler.registerEvents(this.bot);
    this.stateHandler.registerEvents(this.bot);
    this.chatHandler.registerEvents(this.bot);

    import("./other/eventNotifier.js");
    import("./other/skyblockNotifier.js");
  }

  createBotConnection() {
    return createBot({
      host: "mc.hypixel.net",
      port: 25565,
      auth: "microsoft",
      version: "1.8.9",
      viewDistance: "tiny",
      chatLengthLimit: 256,
      profilesFolder: "./auth-cache",
    });
  }

  async onBroadcast({ channel, username, message, replyingTo, discord }) {
    broadcastMessage(`${username}: ${message}`, "Minecraft");
    if (this.bot.player === undefined) {
      return;
    }

    if (channel === discordConfig.channels.debugChannel && discordConfig.channels.debugMode === true) {
      return this.bot.chat(message);
    }

    if (discordConfig.other.filterMessages) {
      message = filter.clean(message);
    }

    message = replaceVariables(minecraft.bot.messageFormat, { username, message });

    const chat = channel === discordConfig.channels.officerChannel ? "/oc" : "/gc";

    if (replyingTo) {
      message = message.replace(username, `${username} replying to ${replyingTo}`);
    }

    let successfullySent = false;
    const messageListener = (receivedMessage) => {
      receivedMessage = receivedMessage.toString();

      if (
        receivedMessage.includes(message) &&
        (this.chatHandler.isGuildMessage(receivedMessage) || this.chatHandler.isOfficerMessage(receivedMessage))
      ) {
        bot.removeListener("message", messageListener);
        successfullySent = true;
      }
    };

    bot.on("message", messageListener);
    this.bot.chat(`${chat} ${message}`);

    setTimeout(() => {
      bot.removeListener("message", messageListener);
      if (successfullySent === true) {
        return;
      }

      discord.react("❌");
    }, 500);
  }
}
