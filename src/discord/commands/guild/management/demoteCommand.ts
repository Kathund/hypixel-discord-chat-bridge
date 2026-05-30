import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class DemoteCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("demote")
      .setDescription("Demotes the given user by one guild rank.")
      .addStringOption((option) => option.setName("guild-member-username").setDescription("Minecraft Username").setRequired(true).setAutocomplete(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString("guild-member-username");
    if (!username) throw new HypixelDiscordChatBridgeError("The `guild-member-username` option is missing?");
    this.discord.application.minecraft.bot.chat(`/g demote ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully demoted \`${username}\` by one guild rank.`)] });
  }
}

export default DemoteCommand;
