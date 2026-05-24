import Command from '../../../Private/Commands/Command.js';
import CommandData from '../../../Private/Commands/CommandData.js';
import HypixelDiscordChatBridgeError from '../../../../Private/Error.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../../Types/Discord.js';
import { SuccessEmbed } from '../../../Private/Embed.js';
import type { ChatInputCommandInteraction } from 'discord.js';

class DemoteCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName('demote')
      .setDescription('Demotes the given user by one guild rank.')
      .addStringOption((option) => option.setName('guild-member-username').setDescription('Minecraft Username').setRequired(true).setAutocomplete(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString('guild-member-username');
    if (!username) throw new HypixelDiscordChatBridgeError('The `guild-member-username` option is missing?');
    this.discord.Application.minecraft.bot.chat(`/g demote ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully demoted \`${username}\` by one guild rank.`)] });
  }
}

export default DemoteCommand;
