import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { HypixelDiscordChatBridgeError } from '../../contracts/errorHandler';
import { discord } from '../../../config.json';

export const data = new SlashCommandBuilder()
  .setName('demote')
  .setDescription('Demote a user from the guild.')
  .addStringOption((option) =>
    option.setName('name').setDescription('The name of the user to demote.').setRequired(true)
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

  const name = interaction.options.getString('name');
  bot.chat(`/g demote ${name}`);

  const embed = new EmbedBuilder()
    .setColor(5763719)
    .setAuthor({ name: 'Demote' })
    .setDescription(`Successfully executed \`/g demote ${name}\``)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: 'https://imgur.com/tgwQJTX.png',
    });

  await interaction.followUp({
    embeds: [embed],
  });
};
