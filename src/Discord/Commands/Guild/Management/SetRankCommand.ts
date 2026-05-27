import Command from '../../../Private/Commands/Command.js';
import CommandData from '../../../Private/Commands/CommandData.js';
import HypixelDiscordChatBridgeError from '../../../../Private/Error.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../../Types/Discord.js';
import { SuccessEmbed } from '../../../Private/Embed.js';
import type { ChatInputCommandInteraction } from 'discord.js';

class SetRankCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName('set-rank')
      .setDescription('Set rank of the given user.')
      .addStringOption((option) => option.setName('guild-member-username').setDescription('Minecraft Username').setRequired(true).setAutocomplete(true))
      .addStringOption((option) => option.setName('guild-rank').setDescription('In game rank').setRequired(true).setAutocomplete(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString('guild-member-username');
    if (!username) throw new HypixelDiscordChatBridgeError('The `guild-member-username` option is missing?');
    const rank = interaction.options.getString('guild-rank');
    if (!rank) throw new HypixelDiscordChatBridgeError('The `guild-rank` option is missing?');
    this.discord.Application.minecraft.bot.chat(`/g setrank ${username} ${rank}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully set **${username}'s** rank to **${rank}**.`)] });
  }
}

export default SetRankCommand;
