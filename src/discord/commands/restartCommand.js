import DiscordCommand from "../../contracts/DiscordCommand.js";
import { Embed } from "../../contracts/embedHandler.js";
import { SlashCommandBuilder } from "discord.js";

class RestartCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder().setName("restart").setDescription("Restarts the bot.");
    this.moderatorOnly = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const restartEmbed = new Embed().setTitle("Restarting...").setDescription("The bot is restarting. This might take few seconds.");

    interaction.followUp({ embeds: [restartEmbed] });

    await bot.end("restart");
    await client.destroy();

    this.discord.app.register().then(() => {
      this.discord.app.connect();
    });

    const successfulRestartEmbed = new Embed().setTitle("Success").setDescription("The bot has been restarted successfully.");

    interaction.followUp({ embeds: [successfulRestartEmbed] });
  }
}

export default RestartCommand;
