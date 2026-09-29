import DiscordCommand from "../../private/commands/DiscordCommand.ts";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.ts";
import EmbedHelper from "../../private/EmbedHelper.ts";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission } from "../../../types/discord.ts";

class RestartCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder().setName("restart").setDescription("Restarts the bot.").setAuthors(["GeorgeFilos"]);
  override readonly flags = [CommandFlags.DebugCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    await interaction.followUp({
      embeds: [new EmbedHelper().setAuthor({ name: "Restarting..." }).setDescription("The bot is restarting. This might take few seconds.").setDevFooter("GeorgeFilos")]
    });
    await this.discord.application.stop();
    await this.discord.application.start();
    console.discord(`The application restart requested by ${interaction.user.username} completed successfully.`);
  }
}

export default RestartCommand;
