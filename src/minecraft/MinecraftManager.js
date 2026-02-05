import CommunicationBridge from "../contracts/CommunicationBridge.js";
import { replaceVariables } from "../contracts/helperFunctions.js";
import StateHandler from "./handlers/StateHandler.js";
import ErrorHandler from "./handlers/ErrorHandler.js";
import ChatHandler from "./handlers/ChatHandler.js";
import CommandHandler from "./CommandHandler.js";
import { createBot } from "mineflayer";
import config from "../../config.json" with { type: "json" };
import Filter from "bad-words";

import "./other/alphaPlayerCountTracker.js"
import "./other/skyblockNotifier.js"
import "./other/eventNotifier.js"

const filter = new Filter();
const fileredWords = config.discord.other.filterWords ?? "";
filter.addWords(...fileredWords);

class MinecraftManager extends CommunicationBridge {
  constructor(app) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.errorHandler = new ErrorHandler(this);
    this.chatHandler = new ChatHandler(this);
    this.commandHandler = new CommandHandler(this)
  }

  connect() {
    global.bot = this.createBotConnection();
    this.bot = bot;

    this.errorHandler.registerEvents(this.bot);
    this.stateHandler.registerEvents(this.bot);
    this.chatHandler.registerEvents(this.bot);
    this.commandHandler.loadCommands();

    this.bot.on("login", () => {
      console.log("Minecraft bot is ready!");
    });
  }

  createBotConnection() {
    return createBot({
      host: "mc.hypixel.net",
      port: 25565,
      auth: "microsoft",
      version: "1.8.9",
      viewDistance: "tiny",
      chatLengthLimit: 256,
      profilesFolder: "./auth-cache"
    });
  }

  async onBroadcast({ channel, username, message, replyingTo, discord }) {
    console.broadcast(`${username}: ${message}`, "Minecraft");
    if (this.bot.player === undefined) {
      return;
    }

    if (channel === config.discord.channels.debugChannel && config.discord.channels.debugMode === true) {
      return this.bot.chat(message);
    }

    if (config.discord.other.filterMessages) {
      try {
        message = filter.clean(message);
        username = filter.clean(username);
      } catch (error) {
        // Do nothing
      }
    }

    if (config.discord.other.stripEmojisFromUsernames) {
      try {
        username = username.replace(/:[\w\-_]+:/g, "");
      } catch (error) {
        // Do nothing
      }
    }

    message = replaceVariables(config.minecraft.bot.messageFormat, { username, message });

    const chat = channel === config.discord.channels.officerChannel ? "/oc" : "/gc";

    if (replyingTo) {
      message = message.replace(username, `${username} replying to ${replyingTo}`);
    }

    let successfullySent = false;
    const messageListener = (receivedMessage) => {
      receivedMessage = receivedMessage.toString();

      if (receivedMessage.trim().includes(message.trim()) && (this.chatHandler.isGuildMessage(receivedMessage) || this.chatHandler.isOfficerMessage(receivedMessage))) {
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

export default MinecraftManager;
