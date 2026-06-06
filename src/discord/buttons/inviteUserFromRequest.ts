import DiscordButton from "../private/buttons/DiscordButton.js";
import DiscordButtonData from "../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../types/discord.js";
import { SuccessEmbed } from "../private/Embed.js";
import type { ButtonInteraction } from "discord.js";

class InviteUserFromRequestButton extends DiscordButton<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordButtonData("inviteUserFromRequest");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ButtonInteraction) {
    const username = this.getUsernameFromJoinRequest(interaction.message);
    if (!username) throw new HypixelDiscordChatBridgeError("Unable to find username");
    this.discord.application.minecraft.bot.chat(`/g invite ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully invited \`${username}\` to the guild.`)] });
  }
}

export default InviteUserFromRequestButton;
