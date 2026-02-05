import DiscordCommand from "../../contracts/DiscordCommand.js";
import { SuccessEmbed } from "../../contracts/embedHandler.js";
import { SlashCommandBuilder } from "discord.js";

class DemoteCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("demote")
      .setDescription("Demotes the given user by one guild rank.")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.moderatorOnly = true;
    this.requiresBot = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const name = interaction.options.getString("username");
    bot.chat(`/g demote ${name}`);
    const embed = new SuccessEmbed(`Successfully demoted \`${name}\` by one guild rank.`);
    await interaction.followUp({ embeds: [embed] });
  }
}

export default DemoteCommand;
