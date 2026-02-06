import DiscordCommand from "../../contracts/DiscordCommand.js";
import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { SuccessEmbed } from "../../contracts/embedHandler.js";

class ExecuteCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("execute")
      .setDescription("Executes commands as the minecraft bot.")
      .addStringOption((option) => option.setName("command").setDescription("Minecraft Command").setRequired(true));
    this.moderatorOnly = true;
    this.requiresBot = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const command = interaction.options.getString("command");
    bot.chat(`/${command}`);
    const commandMessage = new SuccessEmbed(`Successfully executed \`/${command}\``);
    await interaction.followUp({ embeds: [commandMessage], flags: MessageFlags.Ephemeral });
  }
}

export default ExecuteCommand;
