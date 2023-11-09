import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { HypixelDiscordChatBridgeError } from '../../contracts/errorHandler';
import { discord } from '../../../config.json';

export const data = new SlashCommandBuilder()
  .setName('blacklist')
  .setDescription('Blacklist a user from the bot.')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('add')
      .setDescription('Add a user to the blacklist.')
      .addStringOption((option) =>
        option.setName('name').setDescription('The name of the user to blacklist.').setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('remove')
      .setDescription('Remove a user from the blacklist.')
      .addStringOption((option) =>
        option.setName('name').setDescription('The name of the user to remove from the blacklist.').setRequired(true)
      )
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

  const arg = interaction.options.getSubcommand();
  const name = interaction.options.getString('name');

  bot.chat(`/ignore ${arg} ${name}`);

  const embed = new EmbedBuilder()
    .setColor(5763719)
    .setAuthor({ name: 'Blacklist' })
    .setDescription(`Successfully executed \`/ignore ${arg} ${name}\``)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: 'https://imgur.com/tgwQJTX.png',
    });

  await interaction.followUp({
    embeds: [embed],
  });
};
