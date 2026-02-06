import DiscordCommand from "../../contracts/DiscordCommand.js";
import { SlashCommandBuilder } from "discord.js";
import { SuccessEmbed } from "../../contracts/embedHandler.js";

class MuteCommande extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("mute")
      .setDescription("Mutes the given user for a given amount of time.")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true))
      .addStringOption((option) => option.setName("time").setDescription("Time").setRequired(true));
    this.moderatorOnly = true;
    this.requiresBot = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const [name, time] = [interaction.options.getString("username"), interaction.options.getString("time")];
    bot.chat(`/g mute ${name} ${time}`);

    const embed = new SuccessEmbed(`Successfully muted **${name}** for ${time}.`);

    await interaction.followUp({ embeds: [embed] });
  }
}

export default MuteCommande;
