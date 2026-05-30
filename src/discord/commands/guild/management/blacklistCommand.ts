import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { delay } from "../../../../utils/miscUtils.js";
import type { ChatInputCommandInteraction } from "discord.js";

class BlacklistCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("blacklist")
      .setDescription("Ignore add or remove the given user.")
      .addStringOption((option) =>
        option.setName("arg").setDescription("Add or Remove").addChoices({ name: "Add", value: "add" }, { name: "Remove", value: "remove" }).setRequired(true)
      )
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString("username");
    if (!username) throw new HypixelDiscordChatBridgeError("The `username` option is missing?");
    const arg = interaction.options.getString("arg");
    if (!arg) throw new HypixelDiscordChatBridgeError("The `arg` option is missing?");
    this.discord.application.minecraft.bot.chat("/lobby megawalls");

    await delay(250);
    if (arg === "add") {
      this.discord.application.minecraft.bot.chat(`/ignore add ${username}`);
    } else if (arg === "remove") {
      this.discord.application.minecraft.bot.chat(`/ignore remove ${username}`);
    } else {
      throw new HypixelDiscordChatBridgeError("Invalid Usage: `/ignore [add/remove] [name]`.");
    }
    await delay(250);
    this.discord.application.minecraft.bot.chat("/limbo");

    await interaction.followUp({
      embeds: [new SuccessEmbed().setDescription(`Successfully ${arg === "add" ? "added" : "removed"} \`${username}\` ${arg === "add" ? "to" : "from"} the blacklist.`)]
    });
  }
}

export default BlacklistCommand;
