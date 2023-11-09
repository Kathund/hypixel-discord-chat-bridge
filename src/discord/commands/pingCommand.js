import { EmbedBuilder } from 'discord.js';

export const name = 'ping';
export const description = 'Shows the latency of the bot.';

export async function execute(interaction) {
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
}
