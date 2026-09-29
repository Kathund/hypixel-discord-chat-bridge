import BlacklistCommand from "../../commands/blacklistCommand.ts";
import DiscordModal from "../../private/modals/DiscordModal.ts";
import DiscordModalData from "../../private/modals/DiscordModalData.ts";
import HypixelDiscordChatBridgeError from "../../../private/error.ts";
import { CommandFlags, CommandPermission, type ModalSubmitInteractionWithGuild } from "../../../types/discord.ts";
import { SuccessEmbed } from "../../private/EmbedHelper.ts";

class UnblacklistModal extends DiscordModal {
  override readonly data = new DiscordModalData("unblacklist");
  override readonly flags = [CommandFlags.BlacklistCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ModalSubmitInteractionWithGuild) {
    const blacklistCommand = new BlacklistCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");
    const blacklistUser = await blacklistCommand.getBlacklistedFromBlacklistEmbed(interaction.message);
    if (!blacklistUser) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");
    const reason = interaction.fields.getTextInputValue("unblacklistReason") ?? "No reason provided";
    const alertUser = this.discord.application.config.blacklist.notifications.onBlacklistChange.enabled;
    const shareUser = this.discord.application.config.blacklist.notifications.onBlacklistChange.shareBlacklister;
    await blacklistUser.delete({ alertUser, shareUser, user: interaction.user, reason });
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription("User has been unblacklisted").setDevFooter("Amber")] });
  }
}

export default UnblacklistModal;
