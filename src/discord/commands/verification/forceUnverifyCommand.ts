import DiscordCommand from "../../private/commands/DiscordCommand.ts";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.ts";
import UnverifyCommand from "./unverifyCommand.ts";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.ts";

class ForceUnverifyCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("force-unverify")
    .setDescription("Remove a linked Minecraft account")
    .addUserOption((option) => option.setName("user").setDescription("Discord Username").setRequired(true))
    .setAuthors(["Amber"]);
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const user = interaction.options.getUser("user", true);
    const unverifyCommand = new UnverifyCommand(this.discord);
    unverifyCommand.discordId = user.id;
    await unverifyCommand.execute(interaction);
  }
}

export default ForceUnverifyCommand;
