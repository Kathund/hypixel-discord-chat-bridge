import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class ForceUpdateStatsChannelsCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData().setName("force-update-stats-channels").setDescription("Update the stats Channels");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.StatChannelsCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const script = this.discord.application.scripts.scripts.get("updateStatChannels");
    if (!script) throw new HypixelDiscordChatBridgeError("Unable to find the update stat channels script? Please restart the Application");
    await script.execute();
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription("The channels have been updated successfully.").setDevFooter("Kathund")] });
  }
}

export default ForceUpdateStatsChannelsCommand;
