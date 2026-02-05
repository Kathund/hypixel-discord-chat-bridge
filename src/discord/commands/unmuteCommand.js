import { SuccessEmbed } from "../../contracts/embedHandler.js";
import DiscordCommand from "../../contracts/DiscordCommand.js";
import { SlashCommandBuilder } from "discord.js";

class UnmuteCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("unmute")
      .setDescription("Unmute the given user.")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.moderatorOnly = true;
    this.requiresBot = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const name = interaction.options.getString("username");
    bot.chat(`/g unmute ${name}`);

    const embed = new SuccessEmbed(`Successfully executed \`/g unmute ${name}\``).setAuthor({ name: "Unmute" });

    await interaction.followUp({ embeds: [embed] });
  }
}

export default UnmuteCommand;
