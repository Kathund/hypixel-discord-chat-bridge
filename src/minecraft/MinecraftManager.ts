import CommandHandler from "./handlers/CommandHandler.js";
import CommunicationBridge from "../private/CommunicationBridge.js";
import MessageHandler from "./handlers/MessageHandler.js";
import StateHandler from "./handlers/StateHandler.js";
import { type Bot, createBot } from "mineflayer";
import { replaceVariables } from "../utils/stringUtils.js";
import type Application from "../Application.js";
import type { BroadcastEvent } from "../types/bridge.js";
import type { ChatMessage } from "prismarine-chat";
import type { MinecraftManagerWithBot } from "../types/minecraft.js";

class MinecraftManager extends CommunicationBridge {
  readonly stateHandler: StateHandler;
  readonly commandHandler: CommandHandler;
  readonly messageHandler: MessageHandler;
  bot?: Bot;
  constructor(readonly application: Application) {
    super();
    this.stateHandler = new StateHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.messageHandler = new MessageHandler(this);
  }

  connect() {
    this.bot = this.createBotConnection();

    this.stateHandler.registerEvents();
    this.commandHandler.deployCommands();
    this.messageHandler.registerEvents();
  }

  private createBotConnection() {
    return createBot({
      host: "mc.hypixel.net",
      port: 25565,
      username: "DuckySoLucky",
      auth: "microsoft",
      version: "1.8.9",
      viewDistance: "tiny",
      chatLengthLimit: 256,
      profilesFolder: "./auth-cache"
    });
  }

  isBotOnline(): this is MinecraftManagerWithBot {
    return this.bot !== undefined;
  }

  override onBroadcast(event: BroadcastEvent) {
    if (!this.isBotOnline()) return;
    let { channelId, username, message, replyingTo, discordMessage } = event;
    if (channelId === undefined || username === undefined || message === undefined || replyingTo === undefined || discordMessage === undefined) return;
    console.broadcast(`${username}: ${message}`, "Minecraft");
    if (this.bot.player === undefined) return;

    if (channelId === this.application.config.bridge.channels.debug.channel && this.application.config.bridge.channels.debug.enabled === true) {
      return this.bot.chat(message);
    }

    if (this.application.config.bridge.filter.enabled) {
      try {
        message = this.application.filter.clean(message);
        username = this.application.filter.clean(username);
      } catch {
        // Do nothing
      }
    }

    if (this.application.config.bridge.stripEmojisFromUsernames) {
      try {
        username = username.replace(/:[\w\-_]+:/g, "");
      } catch {
        // Do nothing
      }
    }

    message = replaceVariables(this.application.config.bridge.minecraft.format, { username, message });
    const chat = channelId === this.application.config.bridge.channels.officer.channel ? "/oc" : "/gc";
    if (replyingTo) message = message.replace(username, `${username} replying to ${replyingTo}`);

    let successfullySent = false;
    const messageListener = (rawMessage: ChatMessage) => {
      const message = rawMessage.toString();

      if (message.trim().includes(message.trim()) && (this.messageHandler.isGuildMessage(message) || this.messageHandler.isOfficerMessage(message))) {
        this.bot.removeListener("message", messageListener);
        successfullySent = true;
      }
    };

    this.bot.on("message", messageListener);
    this.bot.chat(`${chat} ${message}`);

    setTimeout(() => {
      this.bot.removeListener("message", messageListener);
      if (successfullySent === true) return;
      discordMessage.react("❌");
    }, 500);
  }
}

export default MinecraftManager;
