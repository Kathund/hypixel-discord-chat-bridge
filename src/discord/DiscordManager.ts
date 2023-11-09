import { broadcast, broadcastCleanEmbed, broadcastHeadedEmbed, playerToggle } from '../types/global';
import { Client, Collection, AttachmentBuilder, GatewayIntentBits } from 'discord.js';
import { CommunicationBridge } from '../contracts/CommunicationBridge';
import { generateMessageImage } from '../contracts/messageToImage';
import { replaceVariables } from '../contracts/helperFunctions';
import { discord as discordConfig } from '../../config.json';
import { MessageHandler } from './handlers/MessageHandler';
import { errorMessage, broadcastMessage } from '../Logger';
import { StateHandler } from './handlers/StateHandler';
import { CommandHandler } from './CommandHandler';
import { join } from 'node:path';
import { readdirSync } from 'fs';

export class DiscordManager extends CommunicationBridge {
  app: any;
  stateHandler: any;
  messageHandler: any;
  commandHandler: any;
  client: any;
  constructor(app: any) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.messageHandler = new MessageHandler(this, null);
    this.commandHandler = new CommandHandler();
  }

  async connect() {
    client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });

    this.client = client;

    this.client.on('ready', () => this.stateHandler.onReady());
    this.client.on('messageCreate', (message: any) => this.messageHandler.onMessage(message));

    this.client.login(discordConfig.bot.token).catch((error: any) => {
      errorMessage(error);
    });

    const eventsPath = join(__dirname, 'events');
    const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = join(eventsPath, file);
      const event = await import(filePath);
      event.once
        ? client.once(event.name, (...args: any) => event.execute(...args))
        : client.on(event.name, (...args: any) => event.execute(...args));
    }

    process.on('SIGINT', async () => {
      await this.stateHandler.onClose();

      process.kill(process.pid, 'SIGTERM');
    });
  }

  async getWebhook(discord: any, type: any) {
    const channel = await this.stateHandler.getChannel(type);
    const webhooks = await channel.fetchWebhooks();

    if (webhooks.size === 0) {
      channel.createWebhook({
        name: 'Hypixel Chat Bridge',
        avatar: 'https://imgur.com/tgwQJTX.png',
      });

      await this.getWebhook(discord, type);
    }

    return webhooks.first();
  }

  async onBroadcast({ fullMessage, chat, chatType, username, rank, guildRank, message, color = 1752220 }: broadcast) {
    if (
      (chat === undefined && chatType !== 'debugChannel') ||
      ((username === undefined || message === undefined) && chat !== 'debugChannel')
    ) {
      return;
    }

    const mode = chat === 'debugChannel' ? 'minecraft' : discordConfig.other.messageMode.toLowerCase();
    message = chat === 'debugChannel' ? fullMessage : message;
    if (message !== undefined && chat !== 'debugChannel') {
      broadcastMessage(
        `${username} [${guildRank.replace(/§[0-9a-fk-or]/g, '').replace(/^\[|\]$/g, '')}]: ${message}`,
        `Discord`
      );
    }

    // ? custom message format (config.discord.other.messageFormat)
    if (discordConfig.other.messageMode === 'minecraft' && chat !== 'debugChannel') {
      message = replaceVariables(discordConfig.other.messageFormat, { chatType, username, rank, guildRank, message });
    }

    const channel = await this.stateHandler.getChannel(chat || 'Guild');
    if (channel === undefined) {
      errorMessage(`Channel ${chat} not found!`);
      return;
    }

    switch (mode) {
      case 'bot':
        await channel.send({
          embeds: [
            {
              description: message,
              color: this.hexToDec(color),
              timestamp: new Date(),
              footer: {
                text: guildRank,
              },
              author: {
                name: username,
                icon_url: `https://www.mc-heads.net/avatar/${username}`,
              },
            },
          ],
        });

        if (message.includes('https://')) {
          const links = message.match(/https?:\/\/[^\s]+/g).join('\n');

          channel.send(links);
        }

        break;

      case 'webhook':
        message = this.cleanMessage(message);
        if (message.length === 0) {
          return;
        }

        this.app.discord.webhook = await this.getWebhook(this.app.discord, chatType);
        this.app.discord.webhook.send({
          content: message,
          username: username,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`,
        });
        break;

      case 'minecraft':
        if (fullMessage.length === 0) {
          return;
        }

        await channel.send({
          files: [
            new AttachmentBuilder(await generateMessageImage(message, username), {
              name: `${username}.png`,
            }),
          ],
        });

        if (message.includes('https://')) {
          const links = message.match(/https?:\/\/[^\s]+/g).join('\n');

          channel.send(links);
        }
        break;

      default:
        throw new Error('Invalid message mode: must be bot, webhook or minecraft');
    }
  }

  async onBroadcastCleanEmbed({ message, color, channel }: broadcastCleanEmbed) {
    broadcastMessage(message, 'Event');

    channel = await this.stateHandler.getChannel(channel);
    channel.send({
      embeds: [
        {
          color: color,
          description: message,
        },
      ],
    });
  }

  async onBroadcastHeadedEmbed({ message, title, icon, color, channel }: broadcastHeadedEmbed) {
    broadcastMessage(message, 'Event');

    channel = await this.stateHandler.getChannel(channel);
    channel.send({
      embeds: [
        {
          color: color,
          author: {
            name: title,
            icon_url: icon,
          },
          description: message,
        },
      ],
    });
  }

  async onPlayerToggle({ fullMessage, username, message, color, channel }: playerToggle) {
    broadcastMessage(message, 'Event');
    channel = await this.stateHandler.getChannel(channel);
    switch (discordConfig.other.messageMode.toLowerCase()) {
      case 'bot':
        channel.send({
          embeds: [
            {
              color: color,
              timestamp: new Date(),
              author: {
                name: `${message}`,
                icon_url: `https://www.mc-heads.net/avatar/${username}`,
              },
            },
          ],
        });
        break;
      case 'webhook':
        message = this.cleanMessage(message);
        if (message.length === 0) {
          return;
        }

        this.app.discord.webhook = await this.getWebhook(this.app.discord, channel);
        this.app.discord.webhook.send({
          username: username,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`,
          embeds: [
            {
              color: color,
              description: `${message}`,
            },
          ],
        });

        break;
      case 'minecraft':
        await channel.send({
          files: [
            new AttachmentBuilder(await generateMessageImage(fullMessage, null), {
              name: `${username}.png`,
            }),
          ],
        });
        break;
      default:
        throw new Error('Invalid message mode: must be bot or webhook');
    }
  }

  hexToDec(hex: any) {
    if (hex === undefined) {
      return 1752220;
    }

    if (typeof hex === 'number') {
      return hex;
    }

    return parseInt(hex.replace('#', ''), 16);
  }

  cleanMessage(message: any) {
    if (message === undefined) {
      return '';
    }

    return message
      .split('\n')
      .map((part: any) => {
        part = part.trim();
        return part.length === 0 ? '' : part.replace(/@(everyone|here)/gi, '').trim() + ' ';
      })
      .join('');
  }

  formatMessage(message: any, data: any) {
    return replaceVariables(message, data);
  }
}
