import { discord as discordConfig } from '../../../config.json';
import { discordMessage, errorMessage } from '../../Logger';
import { ClientUser, TextChannel } from 'discord.js';
import { DiscordManager } from '../DiscordManager';

export class StateHandler {
  discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async onReady() {
    discordMessage(
      `Client ready, logged in as ${(global.client.user as ClientUser).tag} (${(global.client.user as ClientUser).id})`
    );
    (global.client.user as ClientUser).setPresence({
      activities: [{ name: `/help | by @duckysolucky` }],
    });

    const channel = await this.getChannel('Guild');
    if (channel === undefined) {
      return errorMessage(`Channel "Guild" not found!`);
    }

    channel.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Online` },
          color: 2067276,
        },
      ],
    });
  }

  async onClose() {
    const channel = await this.getChannel('Guild');
    if (channel === undefined) {
      return errorMessage(`Channel "Guild" not found!`);
    }

    await channel.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Offline` },
          color: 15548997,
        },
      ],
    });
  }

  async getChannel(type: string) {
    switch (type.replace(/§[0-9a-fk-or]/g, '').trim()) {
      case 'Guild':
        return global.client.channels.cache.get(discordConfig.channels.guildChatChannel) as TextChannel;
      case 'Officer':
        return global.client.channels.cache.get(discordConfig.channels.officerChannel) as TextChannel;
      case 'Logger':
        return global.client.channels.cache.get(discordConfig.channels.loggingChannel) as TextChannel;
      default:
        return global.client.channels.cache.get(discordConfig.channels.debugChannel) as TextChannel;
    }
  }
}
