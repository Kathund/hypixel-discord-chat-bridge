import Command from "../../../Private/Commands/Command.js";
import CommandData from "../../../Private/Commands/CommandData.js";
import HypixelDiscordChatBridgeError from "../../../../Private/Error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../../Types/Discord.js";
import { SuccessEmbed } from "../../../Private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class UnmuteCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName("unmute")
      .setDescription("Unmute the given user.")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString("username");
    if (!username) throw new HypixelDiscordChatBridgeError("The \`username\` option is missing?");
    this.discord.Application.minecraft.bot.chat(`/g unmute ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully unmuted **${username}**.`)] });
  }
}

export default UnmuteCommand;
