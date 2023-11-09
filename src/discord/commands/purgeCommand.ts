import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, TextChannel } from 'discord.js';
import { HypixelDiscordChatBridgeError } from '../../contracts/errorHandler';
import { discord } from '../../../config.json';
const data = new SlashCommandBuilder()
  .setName('purge')
  .setDescription('Purges the given amount of messages.')
  .addNumberOption((option) =>
    option.setName('amount').setDescription('Amount of messages to purge').setMinValue(1).setMaxValue(100)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const memberRoles = (interaction.member as GuildMember).roles.cache.map((role) => role.id);
  if (
    (discord.commands.checkPerms &&
      !memberRoles.some((role) => (discord.commands.commandRoles as string[]).includes(role))) ||
    !discord.commands.users.includes(interaction.user.id)
  ) {
    throw new HypixelDiscordChatBridgeError('You do not have permission to use this command', interaction.commandName);
  }

  const amount = interaction.options.getNumber('amount') ?? 5;
  if (amount < 1 || amount > 100) {
    throw new HypixelDiscordChatBridgeError('You can only purge between 1 and 100 messages.', interaction.commandName);
  }

  await (interaction.channel as TextChannel).bulkDelete(amount);
};
