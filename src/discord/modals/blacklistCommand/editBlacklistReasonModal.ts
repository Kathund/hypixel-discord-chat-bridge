import BlacklistCommand from "../../commands/blacklistCommand.ts";
import DiscordModal from "../../private/modals/DiscordModal.ts";
import DiscordModalData from "../../private/modals/DiscordModalData.ts";
import HypixelDiscordChatBridgeError from "../../../private/error.ts";
import { CommandFlags, CommandPermission, type ModalSubmitInteractionWithGuild } from "../../../types/discord.ts";
import { SuccessEmbed } from "../../private/EmbedHelper.ts";

class EditBlacklistReasonModal extends DiscordModal {
  override readonly data = new DiscordModalData("editBlacklistReason");
  override readonly flags = [CommandFlags.BlacklistCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ModalSubmitInteractionWithGuild) {
    const blacklistCommand = new BlacklistCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");
    const blacklistUser = await blacklistCommand.getBlacklistedFromBlacklistEmbed(interaction.message);
    if (!blacklistUser) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");
    const reason = interaction.fields.getTextInputValue("editBlacklistReasonReason") ?? "No reason provided";
    await blacklistUser.updateReason(reason, { alertUser: false, shareUser: false, user: interaction.user });
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription("Reason updated").setDevFooter("Amber")] });
  }
}

export default EditBlacklistReasonModal;
