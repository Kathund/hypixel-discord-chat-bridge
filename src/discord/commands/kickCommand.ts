import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { HypixelDiscordChatBridgeError } from '../../contracts/errorHandler';
import { discord } from '../../../config.json';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kicks the given user from the guild.')
  .addStringOption((option) => option.setName('name').setDescription('Minecraft Username').setRequired(true))
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason for kicking the user').setRequired(true)
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

  const [name, reason] = [interaction.options.getString('name'), interaction.options.getString('reason')];
  global.bot.chat(`/g kick ${name} ${reason}`);

  const embed = new EmbedBuilder()
    .setColor(5763719)
    .setAuthor({ name: 'Kick' })
    .setDescription(`Successfully executed \`/g kick ${name} ${reason}\``)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: 'https://imgur.com/tgwQJTX.png',
    });

  await interaction.followUp({
    embeds: [embed],
  });
};
