import DiscordModal from "../../private/modals/DiscordModal.ts";
import DiscordModalData from "../../private/modals/DiscordModalData.ts";
import HypixelDiscordChatBridgeError from "../../../private/error.ts";
import LinkedCommand from "../../commands/verification/linkedCommand.ts";
import { CommandFlags, CommandPermission, type DiscordManagerWithBot, GuildManagementAction, type ModalSubmitInteractionWithGuild } from "../../../types/discord.ts";
import { SuccessEmbed } from "../../private/EmbedHelper.ts";
import { replaceVariables } from "../../../utils/stringUtils.ts";

class MuteUserModal extends DiscordModal<DiscordManagerWithBot> {
  override readonly data = new DiscordModalData("muteUser");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ModalSubmitInteractionWithGuild) {
    const linkedCommand = new LinkedCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();
    const time = interaction.fields.getTextInputValue("muteUserTime");
    const { action } = await this.handleGuildManagementAction("mute", username, time);
    if (action === GuildManagementAction.MuteTooLong) {
      throw new HypixelDiscordChatBridgeError(this.discord.application.messages.cannotMuteMoreThanOneMonthMessage);
    } else if (action === GuildManagementAction.AlreadyMuted) {
      throw new HypixelDiscordChatBridgeError(this.discord.application.messages.alreadyMutedMessage);
    } else if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError("The bot doesn't have perms to mute");
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError("Command timed out. Please try again");
    } else if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(replaceVariables(this.discord.application.messages.notInGuildMessage, { username }));
    } else if (action === GuildManagementAction.UserMute) {
      await interaction.followUp({
        embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.userMuteMessage, { username, time }))]
      });
    } else if (action === GuildManagementAction.GuildMute) {
      await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.guildMuteMessage, { time }))] });
    }
  }
}

export default MuteUserModal;
