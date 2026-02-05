import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import DiscordCommand from "../../contracts/DiscordCommand.js";
import { SlashCommandBuilder } from "discord.js";

class PurgeCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("purge")
      .setDescription("Purge x messages from a channel.")
      .addIntegerOption((option) => option.setName("amount").setDescription("The amount of messages to purge. (5 by default)"));
    this.moderatorOnly = true;
    this.requiresBot = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const amount = interaction.options.getInteger("amount") ?? 5;
    if (amount < 1 || amount > 100) {
      throw new HypixelDiscordChatBridgeError("You can only purge between 1 and 100 messages.");
    }

    await interaction.channel.bulkDelete(amount);
  }
}

export default PurgeCommand;
