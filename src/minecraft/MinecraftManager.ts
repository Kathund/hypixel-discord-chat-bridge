import CommandHandler from "./handlers/CommandHandler.js";
import CommunicationBridge from "../private/CommunicationBridge.js";
import MessageHandler from "./handlers/MessageHandler.js";
import StateHandler from "./handlers/StateHandler.js";
import { type Client, createClient } from "minecraft-protocol";
import { replaceVariables } from "../utils/stringUtils.js";
import type Application from "../Application.js";
import type { BroadcastEvent } from "../types/bridge.js";
import type { ChatMessage } from "prismarine-chat";
import type { MinecraftManagerWithBot } from "../types/minecraft.js";

class MinecraftManager extends CommunicationBridge {
  readonly supportedVersions: string[] = ["1.8.9"];
  readonly unsupportedVersions: Record<string, { reason: string; disable: boolean }> = {
    "1.21.11": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true },
    "1.21.10": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true },
    "1.21.9": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true },
    "1.21.8": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true },
    "1.21.7": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true },
    "1.21.6": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true },
    "1.21.5": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true },
    "1.21.4": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true },
    "1.21.3": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true },
    "1.21.2": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true },
    "1.21.1": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true },
    "1.21": { reason: "Has known issues and cannot connect to hypixel. See https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/issues/360", disable: true }
  };
  readonly stateHandler: StateHandler;
  readonly commandHandler: CommandHandler;
  readonly messageHandler: MessageHandler;
  bot?: Client;
  constructor(readonly application: Application) {
    super();
    this.stateHandler = new StateHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.messageHandler = new MessageHandler(this);
  }

  async connect() {
    this.bot = this.createBotConnection();

    this.stateHandler.registerEvents();
    await this.commandHandler.deployCommands();
    this.messageHandler.registerEvents();
  }

  private createBotConnection() {
    const version = this.unsupportedVersions[this.application.config.minecraft.bot.version];
    if (version) {
      console.warn(`[minecraft.bot.version] You currently have an unsupported version selected (${this.application.config.minecraft.bot.version})`);
      console.warn(`[minecraft.bot.version] ${version.reason}`);
      console.warn(`[minecraft.bot.version] The currently supported versions are ${this.supportedVersions.join(", ")}`);
      if (version.disable) process.exit(1);
    }

    if (!this.supportedVersions.includes(this.application.config.minecraft.bot.version)) {
      console.warn(`[minecraft.bot.version] You currently have an unsupported version selected (${this.application.config.minecraft.bot.version})`);
      console.warn("[minecraft.bot.version] While it may work we cannot guarantee it to work");
      console.warn(`[minecraft.bot.version] The currently supported versions are ${this.supportedVersions.join(", ")}`);
    }

    return createClient({
      host: this.application.config.minecraft.bot.server,
      port: this.application.config.minecraft.bot.port,
      username: "DuckySoLucky",
      auth: "microsoft",
      version: this.application.config.minecraft.bot.version,
      profilesFolder: this.application.config.minecraft.bot.accountsLocation
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
