import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class UnmuteCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("unmute")
      .setDescription("Unmute the given user.")
      .addStringOption((option) => option.setName("guild-member-username").setDescription("Minecraft Username").setRequired(true).setAutocomplete(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString("guild-member-username");
    if (!username) throw new HypixelDiscordChatBridgeError("The `guild-member-username` option is missing?");
    this.discord.application.minecraft.bot.chat(`/g unmute ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully unmuted **${username}**.`)] });
  }
}

export default UnmuteCommand;
