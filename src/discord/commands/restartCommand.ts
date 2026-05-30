import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../types/discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class RestartCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData().setName("restart").setDescription("Restarts the bot.");
    this.flags = [CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.followUp({
      embeds: [new Embed().setTitle("Restarting...").setDescription("The bot is restarting. This might take few seconds.").setDevFooter("GeorgeFilos")]
    });
    this.discord.application.stop().then(() => this.discord.application.connect());
    await interaction.followUp({ embeds: [new Embed().setTitle("Success").setDescription("The bot has been restarted successfully.").setDevFooter("GeorgeFilos")] });
  }
}

export default RestartCommand;
