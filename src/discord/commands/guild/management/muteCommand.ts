import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class MuteCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("mute")
      .setDescription("Mutes the given user for a given amount of time.")
      .addStringOption((option) => option.setName("guild-member-username").setDescription("Minecraft Username").setRequired(true).setAutocomplete(true))
      .addStringOption((option) => option.setName("time").setDescription("Time").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString("guild-member-username");
    if (!username) throw new HypixelDiscordChatBridgeError("The `guild-member-username` option is missing?");
    const time = interaction.options.getString("time");
    if (!time) throw new HypixelDiscordChatBridgeError("The `time` option is missing?");
    this.discord.application.minecraft.bot.chat(`/g mute ${username} ${time}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully muted **${username}** for ${time}.`)] });
  }
}

export default MuteCommand;
