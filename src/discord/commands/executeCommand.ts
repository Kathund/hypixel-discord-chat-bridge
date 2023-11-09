import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { HypixelDiscordChatBridgeError } from '../../contracts/errorHandler';
import { discord } from '../../../config.json';

export const data = new SlashCommandBuilder()
  .setName('execute')
  .setDescription('Executes commands as the minecraft bot.')
  .addStringOption((option) => option.setName('command').setDescription('The command to execute.').setRequired(true));

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const memberRoles = (interaction.member as GuildMember).roles.cache.map((role) => role.id);
  if (
    (discord.commands.checkPerms &&
      !memberRoles.some((role) => (discord.commands.commandRoles as string[]).includes(role))) ||
    !discord.commands.users.includes(interaction.user.id)
  ) {
    throw new HypixelDiscordChatBridgeError('You do not have permission to use this command', interaction.commandName);
  }

  const command = interaction.options.getString('command');
  global.bot.chat(`/${command}`);

  const commandMessage = new EmbedBuilder()
    .setColor(2067276)
    .setTitle('Command has been executed successfully')
    .setDescription(`\`/${command}\`\n`)
    .setFooter({
      text: 'by @duckysolucky',
      iconURL: 'https://imgur.com/tgwQJTX.png',
    });

  await interaction.followUp({ embeds: [commandMessage], ephemeral: true });
};
