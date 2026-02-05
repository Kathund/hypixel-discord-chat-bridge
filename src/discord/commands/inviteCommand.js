import { SuccessEmbed } from "../../contracts/embedHandler.js";
import DiscordCommand from "../../contracts/DiscordCommand.js";
import { SlashCommandBuilder } from "discord.js";

class InviteCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("invite")
      .setDescription("Invites the given user to the guild.")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.moderatorOnly = true;
    this.requiresBot = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const name = interaction.options.getString("username");
    bot.chat(`/g invite ${name}`);

    const embed = new SuccessEmbed(`Successfully invited **${name}** to the guild.`);

    await interaction.followUp({ embeds: [embed] });
  }
}

export default InviteCommand;
