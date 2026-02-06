import DiscordCommand from "../../contracts/DiscordCommand.js";
import { SlashCommandBuilder } from "discord.js";
import { SuccessEmbed } from "../../contracts/embedHandler.js";

class KickCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("kick")
      .setDescription("Kicks the given user to the guild.")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true))
      .addStringOption((option) => option.setName("reason").setDescription("Reason").setRequired(true));
    this.moderatorOnly = true;
    this.requiresBot = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const [name, reason] = [interaction.options.getString("username"), interaction.options.getString("reason")];
    bot.chat(`/g kick ${name} ${reason}`);
    const embed = new SuccessEmbed(`Successfully kicked **${name}** from the guild.`);
    await interaction.followUp({ embeds: [embed] });
  }
}

export default KickCommand;
