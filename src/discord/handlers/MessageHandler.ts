import { Guild, GuildMember, Message, TextChannel, User } from 'discord.js';
import { discord as discordConfig } from '../../../config.json';
import { uploadImage } from '../../contracts/API/imgurAPI';
import { demojify } from 'discord-emoji-converter';
import { DiscordManager } from '../DiscordManager';
import { CommandHandler } from '../CommandHandler';

export class MessageHandler {
  discord: DiscordManager;
  command: CommandHandler;
  constructor(discord: DiscordManager, command: CommandHandler) {
    this.discord = discord;
    this.command = command;
  }

  async onMessage(message: Message) {
    try {
      if (message.author.id === message.client.user.id || !this.shouldBroadcastMessage(message)) {
        return;
      }

      const content = this.stripDiscordContent(message).trim();
      if (content.length === 0) {
        return;
      }

      const messageData = {
        member: message.author,
        channel: message.channel.id,
        username: message.author.displayName.replaceAll(' ', ''),
        message: content,
        replyingTo: await this.fetchReply(message),
        discord: message,
      };

      const images = content.split(' ').filter((line: string) => line.startsWith('http'));
      for (const attachment of message.attachments.values()) {
        images.push(attachment.url);
      }

      if (images.length > 0) {
        for (const attachment of images) {
          const imgurLink = await uploadImage(attachment);

          messageData.message = messageData.message.replace(attachment, imgurLink.data.link);

          if (messageData.message.includes(imgurLink.data.link) === false) {
            messageData.message += ` ${imgurLink.data.link}`;
          }
        }
      }

      if (messageData.message.length === 0) {
        return;
      }

      this.discord.broadcastMessage(messageData);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchReply(message: Message) {
    try {
      if (message.reference?.messageId === undefined || message.mentions === undefined) {
        return null;
      }

      const reference = await message.channel.messages.fetch(message.reference.messageId);

      const mentionedUserName =
        (message.mentions.repliedUser as User).globalName ?? (message.mentions.repliedUser as User).username;

      if (discordConfig.other.messageMode === 'bot' && reference.embeds !== null) {
        const name = reference.embeds[0]?.author?.name;
        if (name === undefined) {
          return mentionedUserName;
        }

        return name;
      }

      if (discordConfig.other.messageMode === 'minecraft' && reference.attachments !== null) {
        const name = reference.attachments.values()?.next()?.value?.name;
        if (name === undefined) {
          return mentionedUserName;
        }

        return name.split('.')[0];
      }

      if (discordConfig.other.messageMode === 'webhook') {
        if (reference.author.username === undefined) {
          return mentionedUserName;
        }

        return reference.author.username;
      }

      return mentionedUserName ?? null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  stripDiscordContent(message: Message) {
    let output = message.content
      .split('\n')
      .map((part: string) => {
        part = part.trim();
        return part.length === 0 ? '' : part.replace(/@(everyone|here)/gi, '').trim() + ' ';
      })
      .join('');

    const hasMentions = /<@|<#|<:|<a:/.test(message.content);
    if (hasMentions) {
      // Replace <@486155512568741900> with @DuckySoLucky
      const userMentionPattern = /<@(\d+)>/g;
      const replaceUserMention = (match: string, mentionedUserId: string) => {
        const mentionedUser = (message.guild as Guild).members.cache.get(mentionedUserId) as GuildMember;

        return `@${mentionedUser.displayName}`;
      };
      output = output.replace(userMentionPattern, replaceUserMention);

      // Replace <#1072863636596465726> with #💬・guild-chat
      const channelMentionPattern = /<#(\d+)>/g;
      const replaceChannelMention = (match: string, mentionedChannelId: string) => {
        const mentionedChannel = (message.guild as Guild).channels.cache.get(mentionedChannelId) as TextChannel;

        return `#${mentionedChannel.name}`;
      };
      output = output.replace(channelMentionPattern, replaceChannelMention);

      // Replace <:KEKW:628249422253391902> with :KEKW: || Replace <a:KEKW:628249422253391902> with :KEKW:
      const emojiMentionPattern = /<a?:(\w+):\d+>/g;
      output = output.replace(emojiMentionPattern, ':$1:');
    }

    // Replace IP Adresses with [IP Address Removed]
    const IPAddressPattern = /(?:\d{1,3}\s*\s\s*){3}\d{1,3}/g;
    output = output.replaceAll(IPAddressPattern, '[IP Address Removed]');

    // ? demojify() function has a bug. It throws an error when it encounters channel with emoji in its name. Example: #💬・guild-chat
    try {
      return demojify(output);
    } catch (e) {
      return output;
    }
  }

  shouldBroadcastMessage(message: Message) {
    const isBot =
      message.author.bot && discordConfig.channels.allowedBots.includes(message.author.id) === false ? true : false;
    const isValid = !isBot && message.content.length > 0;
    const validChannelIds = [
      discordConfig.channels.officerChannel,
      discordConfig.channels.guildChatChannel,
      discordConfig.channels.debugChannel,
    ];

    return isValid && validChannelIds.includes(message.channel.id);
  }
}
