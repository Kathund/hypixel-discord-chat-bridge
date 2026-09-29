import DiscordButton from "../private/buttons/DiscordButton.ts";
import DiscordButtonData from "../private/buttons/DiscordButtonData.ts";
import HypixelDiscordChatBridgeError from "../../private/error.ts";
import LinkedCommand from "../commands/verification/linkedCommand.ts";
import { type ButtonInteractionWithGuild, CommandPermission } from "../../types/discord.ts";

class GetLinkedButton extends DiscordButton {
  override readonly data = new DiscordButtonData("getLinked");
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    await linkedCommand.followUp(interaction, linked);
  }
}

export default GetLinkedButton;
