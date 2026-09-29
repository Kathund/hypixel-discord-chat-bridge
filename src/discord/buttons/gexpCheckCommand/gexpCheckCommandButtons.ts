import DiscordButton from "../../private/buttons/DiscordButton.ts";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.ts";
import GexpCheckCommand from "../../commands/verification/inactivity/gexpCheckCommand.ts";
import HypixelDiscordChatBridgeError from "../../../private/error.ts";
import { type ButtonInteractionWithGuild, ButtonResponse, CommandFlags, CommandPermission } from "../../../types/discord.ts";
import { type GexpCheckOptionsDisplays, GexpDisplays } from "../../../types/inactivity.ts";

class GexpCheckCommandButtons extends DiscordButton {
  override readonly data = new DiscordButtonData([...GexpDisplays]);
  override readonly response = ButtonResponse.Update;
  override readonly flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const gexpCheckCommand = new GexpCheckCommand(this.discord);
    const options = GexpCheckCommand.getOptionsfromMessage(interaction.message);
    if (!options) throw new HypixelDiscordChatBridgeError("Unable to find the requirement gexp");
    options[interaction.customId.replaceAll("gexpcheck_", "") as keyof GexpCheckOptionsDisplays] =
      !options[interaction.customId.replaceAll("gexpcheck_", "") as keyof GexpCheckOptionsDisplays];
    const response = await gexpCheckCommand.getResponse(options);
    await interaction.editReply(response);
  }
}

export default GexpCheckCommandButtons;
