import { EmbedBuilder } from "discord.js";

export const name = "uptime";
export const description = "Shows the uptime of the bot.";
export async function execute(interaction) {
  const uptimeEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("🕐 Uptime!")
    .setDescription(`Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

  interaction.followUp({ embeds: [uptimeEmbed] });
}
