import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { HypixelDiscordChatBridgeError } from '../../contracts/errorHandler';
import { discord } from '../../../config.json';
import app from '../../Application';

export const data = new SlashCommandBuilder().setName('restart').setDescription('Restarts the bot.');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const memberRoles = (interaction.member as GuildMember).roles.cache.map((role) => role.id);
  if (
    (discord.commands.checkPerms &&
      !memberRoles.some((role) => (discord.commands.commandRoles as string[]).includes(role))) ||
    !discord.commands.users.includes(interaction.user.id)
  ) {
    throw new HypixelDiscordChatBridgeError('You do not have permission to use this command', interaction.commandName);
  }
  const restartEmbed = new EmbedBuilder()
    .setColor(15548997)
    .setTitle('Restarting...')
    .setDescription('The bot is restarting. This might take few seconds.')
    .setFooter({
      text: `by @george_filos | /help [command] for more information`,
      iconURL: 'https://cdn.discordapp.com/avatars/177083022305263616/4ee1d5f278a36a61aa9164b9263c8722.webp',
    });

  interaction.followUp({ embeds: [restartEmbed] });

  await bot.end('restart');
  await client.destroy();

  app.register().then(() => {
    app.connect();
  });

  const successfulRestartEmbed = new EmbedBuilder()
    .setColor(2067276)
    .setTitle('Restart Successful!')
    .setDescription('The bot has been restarted successfully.')
    .setFooter({
      text: `by @george_filos | /help [command] for more information`,
      iconURL: 'https://cdn.discordapp.com/avatars/177083022305263616/4ee1d5f278a36a61aa9164b9263c8722.webp',
    });

  interaction.followUp({ embeds: [successfulRestartEmbed] });
};
