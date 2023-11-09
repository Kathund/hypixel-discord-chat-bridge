import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('uptime').setDescription('Shows the uptime of the bot.');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const uptimeEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('🕐 Uptime!')
    .setDescription(`Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: 'https://imgur.com/tgwQJTX.png',
    });

  await interaction.followUp({ embeds: [uptimeEmbed] });
};
