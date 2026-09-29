import DiscordButton from "../../private/buttons/DiscordButton.ts";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.ts";
import HypixelDiscordChatBridgeError from "../../../private/error.ts";
import { type ButtonInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.ts";
import { MessageFlags } from "discord.js";
import { SuccessEmbed } from "../../private/EmbedHelper.ts";
import { delay } from "../../../utils/miscUtils.ts";

class GexpCheckGenerateKickExecuteButton extends DiscordButton<DiscordManagerWithBot> {
  override readonly data = new DiscordButtonData("gexpCheckGenerateKickExecute");
  override readonly flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand, CommandFlags.RequiresMinecraftBot];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    if (!interaction.message) return;
    const attachment = interaction.message.attachments.first();
    if (!attachment) throw new HypixelDiscordChatBridgeError("No commands file found on the message?");

    const res = await this.discord.application.request<string>(attachment.url);
    const commands = res.data
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!commands.length) throw new HypixelDiscordChatBridgeError("The commands file is empty?");

    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Found ${commands.length} kick command(s)`).setDevFooter("Amber")] });

    for (const command of commands) {
      this.discord.application.minecraft.bot.chat(command);
      await delay(500);
    }

    await interaction.followUp({
      embeds: [new SuccessEmbed().setDescription(`Executed ${commands.length} kick command(s)`).setDevFooter("Amber")],
      flags: MessageFlags.Ephemeral
    });
  }
}

export default GexpCheckGenerateKickExecuteButton;
