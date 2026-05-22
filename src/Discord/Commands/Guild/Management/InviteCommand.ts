import Command from "../../../Private/Commands/Command.js";
import CommandData from "../../../Private/Commands/CommandData.js";
import HypixelDiscordChatBridgeError from "../../../../Private/Error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../../Types/Discord.js";
import { SuccessEmbed } from "../../../Private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class InviteCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName("invite")
      .setDescription("Invites the given user to the guild.")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString("username");
    if (!username) throw new HypixelDiscordChatBridgeError("The \`username\` option is missing?");
    this.discord.Application.minecraft.bot.chat(`/g invite ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully invited \`${username}\` to the guild.`)] });
  }
}

export default InviteCommand;
