import DiscordButton from "../../private/buttons/DiscordButton.ts";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.ts";
import HypixelDiscordChatBridgeError from "../../../private/error.ts";
import LinkedCommand from "../../commands/verification/linkedCommand.ts";
import UnverifyCommand from "../../commands/verification/unverifyCommand.ts";
import { type ButtonInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.ts";

class UnverifyUserButton extends DiscordButton<DiscordManagerWithBot> {
  override readonly data = new DiscordButtonData("unverifyUser");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const unverifyCommand = new UnverifyCommand(this.discord);
    unverifyCommand.discordId = linked.discordId;
    await unverifyCommand.execute(interaction);
  }
}

export default UnverifyUserButton;
