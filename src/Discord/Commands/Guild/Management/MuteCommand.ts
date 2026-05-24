import Command from '../../../Private/Commands/Command.js';
import CommandData from '../../../Private/Commands/CommandData.js';
import HypixelDiscordChatBridgeError from '../../../../Private/Error.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../../Types/Discord.js';
import { SuccessEmbed } from '../../../Private/Embed.js';
import type { ChatInputCommandInteraction } from 'discord.js';

class MuteCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName('mute')
      .setDescription('Mutes the given user for a given amount of time.')
      .addStringOption((option) => option.setName('guild-member-username').setDescription('Minecraft Username').setRequired(true).setAutocomplete(true))
      .addStringOption((option) => option.setName('time').setDescription('Time').setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString('guild-member-username');
    if (!username) throw new HypixelDiscordChatBridgeError('The `guild-member-username` option is missing?');
    const time = interaction.options.getString('time');
    if (!time) throw new HypixelDiscordChatBridgeError('The `time` option is missing?');
    this.discord.Application.minecraft.bot.chat(`/g mute ${username} ${time}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully muted **${username}** for ${time}.`)] });
  }
}

export default MuteCommand;
