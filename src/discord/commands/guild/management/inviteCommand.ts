import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class InviteCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("invite")
      .setDescription("Invites the given user to the guild.")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString("username");
    if (!username) throw new HypixelDiscordChatBridgeError("The `username` option is missing?");
    this.discord.application.minecraft.bot.chat(`/g invite ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully invited \`${username}\` to the guild.`)] });
  }
}

export default InviteCommand;
