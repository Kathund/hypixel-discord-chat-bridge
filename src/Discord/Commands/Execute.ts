import Command from "../Private/Commands/Command.js";
import CommandData from "../Private/Commands/CommandData.js";
import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import { CommandFlags, CommandType, type DiscordManagerWithBot } from "../../Types/Discord.js";
import { SuccessEmbed } from "../Private/Embed.js";

class ExecuteCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName("execute")
      .setDescription("Executes commands as the minecraft bot.")
      .addStringOption(new SlashCommandStringOption().setName("command").setDescription("Minecraft Command").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot];
    this.type = CommandType.Staff;
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = interaction.options.getString("command");
    if (!command) throw new HypixelDiscordChatBridgeError("The **command** option is missing?");
    this.discord.app.minecraft.bot.chat(`/${command}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully executed \`/${command}\``)] });
  }
}

export default ExecuteCommand;
