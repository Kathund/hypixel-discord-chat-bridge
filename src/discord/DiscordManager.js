import CommandHandler from "./CommandHandler.js";
import CommunicationBridge from "../contracts/CommunicationBridge.js";
import MessageHandler from "./handlers/MessageHandler.js";
import StateHandler from "./handlers/StateHandler.js";
import config from "../../config.json" with { type: "json" };
import messageToImage from "../contracts/messageToImage.js";
import { AttachmentBuilder, Client, EmbedBuilder, Events, GatewayIntentBits } from "discord.js";
import { ErrorEmbed } from "../contracts/embedHandler.js";
import { readdirSync } from "node:fs";
import { replaceVariables } from "../contracts/helperFunctions.js";

class DiscordManager extends CommunicationBridge {
  constructor(app) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.commandHandler = new CommandHandler(this);
  }

  async connect() {
    global.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
    });

    this.client = client;
    await this.commandHandler.loadCommands();

    this.client.on(Events.ClientReady, () => this.stateHandler.onReady());
    this.client.on(Events.MessageCreate, (message) => this.messageHandler.onMessage(message));

    this.client.login(config.discord.bot.token).catch((error) => {
      console.error(error);
    });

    const eventFiles = readdirSync("src/discord/events").filter((file) => file.endsWith(".js"));
    for (const file of eventFiles) {
      const event = new (await import(`./events/${file}`)).default(this.discord);
      event.once ? client.once(event.event, (...args) => event.onEvent(...args)) : client.on(event.event, (...args) => event.onEvent(...args));
    }

    process.on("SIGINT", async () => {
      await this.stateHandler.onClose();

      process.kill(process.pid, "SIGTERM");
    });
  }

  async getWebhook(discord, type) {
    const channel = await this.stateHandler.getChannel(type);
    try {
      const webhooks = await channel.fetchWebhooks();

      if (webhooks.size === 0) {
        channel.createWebhook({
          name: "Hypixel Chat Bridge",
          avatar: "https://imgur.com/tgwQJTX.png"
        });

        await this.getWebhook(discord, type);
      }

      return webhooks.first();
    } catch (error) {
      console.log(error);
      channel.send({
        embeds: [new ErrorEmbed("An error occurred while trying to fetch the webhooks. Please make sure the bot has the `MANAGE_WEBHOOKS` permission.")]
      });
    }
  }

  async onBroadcast({ fullMessage, chat, chatType, username, rank, guildRank, message, color = 1752220 }) {
    if ((chat === undefined && chatType !== "debugChannel") || ((username === undefined || message === undefined) && chat !== "debugChannel")) {
      return;
    }

    const mode = chat === "debugChannel" ? config.discord.channels.debugChannelMessageMode.toLowerCase() : config.discord.other.messageMode.toLowerCase();
    message = ["text"].includes(mode) ? fullMessage : message;
    if (message !== undefined && chat !== "debugChannel") {
      console.broadcast(`${username} [${guildRank.replace(/§[0-9a-fk-or]/g, "").replace(/^\[|\]$/g, "")}]: ${message}`, `Discord`);
    }

    if (mode === "minecraft") {
      message = replaceVariables(config.discord.other.messageFormat, { chatType, username, rank, guildRank, message });
    }

    const channel = await this.stateHandler.getChannel(chat || "Guild");
    if (channel === undefined) {
      console.error(`Channel ${chat.replace(/§[0-9a-fk-or]/g, "").trim()} not found!`);
      return;
    }

    switch (mode) {
      case "bot":
        await channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(message)
              .setColor(this.hexToDec(color))
              .setFooter({ text: guildRank })
              .setAuthor({ name: username, iconURL: `https://www.mc-heads.net/avatar/${username}` })
          ]
        });

        if (message.includes("https://")) {
          const links = message.match(/https?:\/\/[^\s]+/g).join("\n");

          channel.send(links);
        }

        break;

      case "webhook":
        message = this.cleanMessage(message);
        if (message.length === 0) {
          return;
        }

        this.app.discord.webhook = await this.getWebhook(this.app.discord, chatType);
        if (this.app.discord.webhook === undefined) {
          return;
        }

        this.app.discord.webhook.send({
          content: message,
          username: username,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`
        });
        break;

      case "minecraft":
        if (fullMessage.length === 0) {
          return;
        }

        await channel.send({
          files: [
            new AttachmentBuilder(await messageToImage(message, username), {
              name: `${username}.png`
            })
          ]
        });

        if (message.includes("https://")) {
          const links = message.match(/https?:\/\/[^\s]+/g).join("\n");

          channel.send(links);
        }
        break;

      case "text":
        if (message.trim().length === 0) {
          return;
        }

        await channel.send({
          content: message
        });
        break;

      default:
        throw new Error("Invalid message mode: must be bot, webhook or minecraft");
    }
  }

  async onBroadcastCleanEmbed({ message, color, channel }) {
    console.broadcast(message, "Event");

    channel = await this.stateHandler.getChannel(channel);
    if (channel === undefined) {
      console.log(`Channel ${channel.replace(/§[0-9a-fk-or]/g, "").trim()} not found!`);
    }

    channel.send({
      embeds: [new EmbedBuilder().setColor(color).setDescription(message)]
    });
  }

  async onBroadcastHeadedEmbed({ message, title, icon, color, channel }) {
    console.broadcast(message, "Event");

    channel = await this.stateHandler.getChannel(channel);
    if (channel === undefined) {
      console.log(`Channel ${channel.replace(/§[0-9a-fk-or]/g, "").trim()} not found!`);
      return;
    }

    channel.send({
      embeds: [new EmbedBuilder().setDescription(message).setColor(color).setAuthor({ name: title, iconURL: icon })]
    });
  }

  async onPlayerToggle({ fullMessage, username, message, color, channel }) {
    console.broadcast(message, "Event");

    channel = await this.stateHandler.getChannel(channel);
    if (channel === undefined) {
      console.log(`Channel ${channel.replace(/§[0-9a-fk-or]/g, "").trim()} not found!`);
      return;
    }

    switch (config.discord.other.messageMode.toLowerCase()) {
      case "bot":
        channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(color)
              .setTimestamp()
              .setAuthor({ name: `${message}`, iconURL: `https://www.mc-heads.net/avatar/${username}` })
          ]
        });
        break;
      case "webhook":
        message = this.cleanMessage(message);
        if (message.length === 0) {
          return;
        }

        this.app.discord.webhook = await this.getWebhook(this.app.discord, "Guild");
        if (this.app.discord.webhook === undefined) {
          return;
        }

        this.app.discord.webhook.send({
          username: username,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`,
          embeds: [new EmbedBuilder().setColor(color).setDescription(`${message}`)]
        });

        break;
      case "minecraft":
        await channel.send({
          files: [
            new AttachmentBuilder(await messageToImage(fullMessage), {
              name: `${username}.png`
            })
          ]
        });
        break;
      default:
        throw new Error("Invalid message mode: must be bot or webhook");
    }
  }

  hexToDec(hex) {
    if (hex === undefined) {
      return 1752220;
    }

    if (typeof hex === "number") {
      return hex;
    }

    return parseInt(hex.replace("#", ""), 16);
  }

  cleanMessage(message) {
    if (message === undefined) {
      return "";
    }

    return message
      .split("\n")
      .map((part) => {
        part = part.trim();
        return part.length === 0 ? "" : part.replace(/@(everyone|here)/gi, "").trim() + " ";
      })
      .join("");
  }

  formatMessage(message, data) {
    return replaceVariables(message, data);
  }
}

export default DiscordManager;
