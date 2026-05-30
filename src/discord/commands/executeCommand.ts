import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../types/discord.js";
import { SuccessEmbed } from "../private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class ExecuteCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("execute")
      .setDescription("Executes commands as the minecraft bot.")
      .addStringOption((option) => option.setName("command").setDescription("Minecraft Command").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = interaction.options.getString("command");
    if (!command) throw new HypixelDiscordChatBridgeError("The `command` option is missing?");
    this.discord.application.minecraft.bot.chat(`/${command}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully executed \`/${command}\``)] });
  }
}

export default ExecuteCommand;
