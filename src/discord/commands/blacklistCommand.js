import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import { SuccessEmbed } from "../../contracts/embedHandler.js";
import DiscordCommand from "../../contracts/DiscordCommand.js";
import { delay } from "../../contracts/helperFunctions.js";
import { SlashCommandBuilder } from "discord.js";

class BlacklistCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("blacklist")
      .setDescription("Ignore add or remove the given user.")
      .addStringOption((option) =>
        option
          .setName("arg")
          .setDescription("Add or Remove")
          .addChoices(
            {
              name: "Add",
              value: "add"
            },
            {
              name: "Remove",
              value: "remove"
            }
          )
          .setRequired(true)
      )
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.moderatorOnly = true;
    this.requiresBot = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const name = interaction.options.getString("username");
    const arg = interaction.options.getString("arg").toLowerCase();

    bot.chat("/lobby megawalls");
    await delay(250);
    if (arg == "add") {
      bot.chat(`/ignore add ${name}`);
    } else if (arg == "remove") {
      bot.chat(`/ignore remove ${name}`);
    } else {
      throw new HypixelDiscordChatBridgeError("Invalid Usage: `/ignore [add/remove] [name]`.");
    }
    await delay(250);
    bot.chat("/limbo");

    const embed = new SuccessEmbed(`Successfully ${arg == "add" ? "added" : "removed"} \`${name}\` ${arg == "add" ? "to" : "from"} the blacklist.`);

    await interaction.followUp({
      embeds: [embed]
    });
  }
}

export default BlacklistCommand;
