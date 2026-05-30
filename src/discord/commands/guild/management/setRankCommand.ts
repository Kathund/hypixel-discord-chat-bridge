import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class SetRankCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("set-rank")
      .setDescription("Set rank of the given user.")
      .addStringOption((option) => option.setName("guild-member-username").setDescription("Minecraft Username").setRequired(true).setAutocomplete(true))
      .addStringOption((option) => option.setName("guild-rank").setDescription("In game rank").setRequired(true).setAutocomplete(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString("guild-member-username");
    if (!username) throw new HypixelDiscordChatBridgeError("The `guild-member-username` option is missing?");
    const rank = interaction.options.getString("guild-rank");
    if (!rank) throw new HypixelDiscordChatBridgeError("The `guild-rank` option is missing?");
    this.discord.application.minecraft.bot.chat(`/g setrank ${username} ${rank}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully set **${username}'s** rank to **${rank}**.`)] });
  }
}

export default SetRankCommand;
