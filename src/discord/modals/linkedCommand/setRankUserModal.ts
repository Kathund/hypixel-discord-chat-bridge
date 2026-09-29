import DiscordModal from "../../private/modals/DiscordModal.ts";
import DiscordModalData from "../../private/modals/DiscordModalData.ts";
import HypixelDiscordChatBridgeError from "../../../private/error.ts";
import LinkedCommand from "../../commands/verification/linkedCommand.ts";
import { CommandFlags, CommandPermission, type DiscordManagerWithBot, GuildManagementAction, type ModalSubmitInteractionWithGuild } from "../../../types/discord.ts";
import { SuccessEmbed } from "../../private/EmbedHelper.ts";
import { replaceVariables } from "../../../utils/stringUtils.ts";

class SetRankUserModal extends DiscordModal<DiscordManagerWithBot> {
  override readonly data = new DiscordModalData("setRankUser");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ModalSubmitInteractionWithGuild) {
    const linkedCommand = new LinkedCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();
    const rank = interaction.fields.getRadioGroup("setRankUserRank", true);
    const { action, message } = await this.handleGuildManagementAction("setrank", username, rank);
    if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(replaceVariables(this.discord.application.messages.notInGuildMessage, { username }));
    } else if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError("The bot doesn't have perms to promote");
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError("Command timed out. Please try again");
    } else if (!message) {
      throw new HypixelDiscordChatBridgeError("No response message received");
    } else if (action === GuildManagementAction.Promote) {
      const rank =
        message
          .replace(/\[(.*?)\]/g, "")
          .trim()
          .split(" to ")
          .pop()
          ?.trim() ?? "";
      await interaction.followUp({
        embeds: [
          new SuccessEmbed()
            .setDescription(replaceVariables(this.discord.application.messages.promotionMessage, { username, rank }))
            .setAuthor({ name: "Member Promoted", iconURL: `${this.discord.application.config.API.nmsr.baseURL}/face/${username}` })
        ]
      });
    } else if (action === GuildManagementAction.Demote) {
      const rank =
        message
          .replace(/\[(.*?)\]/g, "")
          .trim()
          .split(" to ")
          .pop()
          ?.trim() ?? "";
      await interaction.followUp({
        embeds: [
          new SuccessEmbed()
            .setDescription(replaceVariables(this.discord.application.messages.demotionMessage, { username, rank }))
            .setAuthor({ name: "Member Demote", iconURL: `${this.discord.application.config.API.nmsr.baseURL}/face/${username}` })
        ]
      });
    }
  }
}

export default SetRankUserModal;
