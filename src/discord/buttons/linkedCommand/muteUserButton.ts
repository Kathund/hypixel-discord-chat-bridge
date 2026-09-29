import DiscordButton from "../../private/buttons/DiscordButton.ts";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.ts";
import HypixelDiscordChatBridgeError from "../../../private/error.ts";
import LinkedCommand from "../../commands/verification/linkedCommand.ts";
import { type ButtonInteractionWithGuild, ButtonResponse, CommandFlags, CommandPermission } from "../../../types/discord.ts";
import { LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

class MuteUserButton extends DiscordButton {
  override readonly data = new DiscordButtonData("muteUser");
  override readonly response = ButtonResponse.None;
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId("muteUser")
        .setTitle(`Mute ${username}`)
        .addLabelComponents(
          new LabelBuilder()
            .setLabel(`Length of ${username}'s mute`)
            .setTextInputComponent(new TextInputBuilder().setCustomId("muteUserTime").setStyle(TextInputStyle.Short).setPlaceholder(`Length of ${username}'s mute`))
        )
    );
  }
}

export default MuteUserButton;
