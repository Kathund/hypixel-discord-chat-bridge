import HypixelDiscordChatBridgeError from '../../contracts/errorHandler.js';
import { discord } from '../../../config.json';
import { EmbedBuilder } from 'discord.js';

export const name = 'mute';
export const description = 'Mutes the given user for a given amount of time.';
export const options = [
  {
    name: 'name',
    description: 'Minecraft Username',
    type: 3,
    required: true,
  },
  {
    name: 'time',
    description: 'Time',
    type: 3,
    required: true,
  },
];

export async function execute(interaction) {
  const user = interaction.member;
  if (
    discord.commands.checkPerms === true &&
    !(user.roles.cache.has(discord.commands.commandRole) || discord.commands.users.includes(user.id))
  ) {
    throw new HypixelDiscordChatBridgeError('You do not have permission to use this command.');
  }

  const [name, time] = [interaction.options.getString('name'), interaction.options.getString('time')];
  bot.chat(`/g mute ${name} ${time}`);

  const embed = new EmbedBuilder()
    .setColor(5763719)
    .setAuthor({ name: 'Mute' })
    .setDescription(`Successfully executed \`/g mute ${name} ${time}\``)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: 'https://imgur.com/tgwQJTX.png',
    });

  await interaction.followUp({
    embeds: [embed],
  });
}
