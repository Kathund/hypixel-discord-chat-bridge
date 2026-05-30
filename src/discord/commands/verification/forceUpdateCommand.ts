import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import UpdateCommand from "./updateCommand.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class ForceUpdateCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("force-update")
      .setDescription("Update user's roles")
      .addUserOption((option) => option.setName("user").setDescription("Discord Username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.options.getUser("user");
    if (!user) throw new HypixelDiscordChatBridgeError("The `user` option is missing?");
    const updateCommand = new UpdateCommand(this.discord);
    updateCommand.isSelf = false;
    updateCommand.discordId = user.id;
    await updateCommand.execute(interaction);
  }
}

export default ForceUpdateCommand;
