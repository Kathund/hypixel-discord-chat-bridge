import DiscordButton from "../../private/buttons/DiscordButton.ts";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.ts";
import HypixelDiscordChatBridgeError from "../../../private/error.ts";
import LinkedCommand from "../../commands/verification/linkedCommand.ts";
import { type ButtonInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot, GuildManagementAction } from "../../../types/discord.ts";
import { SuccessEmbed } from "../../private/EmbedHelper.ts";
import { replaceVariables } from "../../../utils/stringUtils.ts";

class PromoteUserButton extends DiscordButton<DiscordManagerWithBot> {
  override readonly data = new DiscordButtonData("promoteUser");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();
    const { action, message } = await this.handleGuildManagementAction("promote", username);
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
    }
  }
}

export default PromoteUserButton;
