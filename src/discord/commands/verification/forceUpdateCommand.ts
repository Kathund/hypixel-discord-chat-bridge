import DiscordCommand from "../../private/commands/DiscordCommand.ts";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.ts";
import UpdateCommand from "./updateCommand.ts";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.ts";

class ForceUpdateCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("force-update")
    .setDescription("Update user's roles")
    .addUserOption((option) => option.setName("user").setDescription("Discord Username").setRequired(true))
    .setAuthors(["Amber"]);
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const user = interaction.options.getUser("user", true);
    const updateCommand = new UpdateCommand(this.discord);
    updateCommand.discordId = user.id;
    await updateCommand.execute(interaction);
  }
}

export default ForceUpdateCommand;
