import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Pong!');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const clientLatency = Date.now() - interaction.createdTimestamp;
  const apiLatency = interaction.client.ws.ping;

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('🏓 Pong!')
    .setDescription(`Client Latency: \`${clientLatency}ms\`\nAPI Latency: \`${apiLatency}ms\``)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: 'https://imgur.com/tgwQJTX.png',
    });

  interaction.followUp({ embeds: [embed] });
};
