import DiscordCommand from "../../contracts/DiscordCommand.js";
import { Embed } from "../../contracts/embedHandler.js";
import { SlashCommandBuilder } from "discord.js";

class UptimeCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder().setName("uptime").setDescription("Shows the uptime of the bot.");
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const uptimeEmbed = new Embed().setDescription(`Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`).setTitle("🕐 Uptime!");
    await interaction.followUp({ embeds: [uptimeEmbed] });
  }
}

export default UptimeCommand;
