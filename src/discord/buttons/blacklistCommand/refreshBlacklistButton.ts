import BlacklistCommand from "../../commands/blacklistCommand.ts";
import DiscordButton from "../../private/buttons/DiscordButton.ts";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.ts";
import HypixelDiscordChatBridgeError from "../../../private/error.ts";
import { type ButtonInteractionWithGuild, ButtonResponse, CommandFlags, CommandPermission } from "../../../types/discord.ts";

class RefreshBlacklistButton extends DiscordButton {
  override readonly data = new DiscordButtonData("refreshBlacklist");
  override readonly response = ButtonResponse.Ephemeral;
  override readonly flags = [CommandFlags.BlacklistCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const blacklistCommand = new BlacklistCommand(this.discord);
    const blacklistUser = await blacklistCommand.getBlacklistedFromBlacklistEmbed(interaction.message);
    if (!blacklistUser) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");
    await blacklistUser.refreshMessage();
    await interaction.deleteReply();
  }
}

export default RefreshBlacklistButton;
