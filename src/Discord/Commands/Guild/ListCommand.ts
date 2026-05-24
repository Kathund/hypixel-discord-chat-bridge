import Command from '../../Private/Commands/Command.js';
import CommandData from '../../Private/Commands/CommandData.js';
import Embed from '../../Private/Embed.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import { CommandFlags, type DiscordManagerWithBot, type ListMembers, type ListMembersGroup } from '../../../Types/Discord.js';
import { RemoveColorCodes } from '../../../Utils/StringUtils.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { ChatMessage } from 'prismarine-chat';

class ListCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData().setName('list').setDescription('List of guild members.');
    this.flags = [CommandFlags.RequiresMinecraftBot];
  }

  getMessages(): Promise<string[]> {
    return new Promise<string[]>((resolve) => {
      const cachedMessages: string[] = [];
      const listener = (rawMessage: ChatMessage) => {
        const message = rawMessage.toString();
        cachedMessages.push(rawMessage.toMotd());

        if (message.startsWith('Online Members')) {
          this.discord.Application.minecraft.bot.removeListener('message', listener);
          resolve(cachedMessages);
        }
      };

      this.discord.Application.minecraft.bot.on('message', listener);
      this.discord.Application.minecraft.bot.chat('/g list');

      setTimeout(() => {
        this.discord.Application.minecraft.bot.removeListener('message', listener);
        resolve(cachedMessages);
      }, 5000);
    });
  }

  async getListMembers(): Promise<ListMembers> {
    const messages = await this.getMessages();
    if (messages.length === 0) throw new HypixelDiscordChatBridgeError('Could not retrieve the guild list.');

    let onlineString = messages.map((message) => RemoveColorCodes(message)).find((message) => message.startsWith('Online Members: '));
    if (onlineString === undefined) throw new HypixelDiscordChatBridgeError("The online members message is missing. Is the bot's hypixel language english?");
    const online = Number(onlineString.split('Online Members: ')?.[1] || '0');
    onlineString = `**Online:** ${online}`;

    let totalString = messages.map((message) => RemoveColorCodes(message)).find((message) => message.startsWith('Total Members: '));
    if (totalString === undefined) throw new HypixelDiscordChatBridgeError("The total members message is missing. Is the bot's hypixel language english?");
    const total = Number(totalString.split('Total Members: ')?.[1] || '0');
    totalString = `**Total:** ${total}`;

    const groups: ListMembersGroup[] = [];
    messages.flatMap((item, index) => {
      if (!item.includes('-- ')) return;
      const nextLine = messages[index + 1];
      if (!nextLine) return;
      if (!nextLine.includes('●')) return;
      const rank = RemoveColorCodes(item.replaceAll('--', '')).trim();
      const players = nextLine
        .split('●')
        .map((item) => item.trim())
        .map((item) => {
          if (item.endsWith('§a')) return `● ${item}`;
          return item;
        })
        .map((item) => RemoveColorCodes(item))
        .map((item) => item.trim())
        .filter((item) => item);
      if (rank === undefined || players === undefined) return;
      groups.push({ name: rank, value: players.map((player) => `\`${player}\``).join(', ') });
    });

    return { online, onlineString, total, totalString, groups };
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const { groups, totalString, onlineString } = await this.getListMembers();
    await interaction.followUp({ embeds: [new Embed().setTitle('List Members').setDescription(`${totalString}\n${onlineString}`).setFields(groups)] });
  }
}

export default ListCommand;
