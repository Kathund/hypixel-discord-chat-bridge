import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import DiscordCommand from "../../contracts/DiscordCommand.js";
import { SlashCommandBuilder } from "discord.js";
import UpdateCommand from "./updateCommand.js";
import { readFileSync } from "fs";

class ForceUpdateCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("force-update")
      .setDescription("Update user's or everyone's roles")
      .addUserOption((option) => option.setName("user").setDescription("Discord Username"))
      .addBooleanOption((option) => option.setName("everyone").setDescription("Update everyone's roles"));
    this.moderatorOnly = true;
    this.requiresBot = true;
    this.verificationCommand = true;
  }

  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {{everyone: boolean, hidden: boolean}} [extra={everyone: false, hidden: false}]
   */
  async onCommand(interaction, extra = { everyone: false, hidden: false }) {
    const linkedData = readFileSync("data/linked.json");
    if (!linkedData) {
      throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
    }

    const linked = JSON.parse(linkedData.toString("utf8"));
    if (!linked) {
      throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    }

    const user = interaction?.options?.getUser("user");
    const everyone = extra.everyone || interaction?.options?.getBoolean("everyone");
    if (!user && !everyone) {
      throw new HypixelDiscordChatBridgeError("You must specify a user or everyone.");
    }

    if (user && everyone) {
      throw new HypixelDiscordChatBridgeError("You cannot specify both user and everyone.");
    }

    const updateCommand = new UpdateCommand();

    if (user) {
      await updateCommand.onCommand(interaction, { discordId: user.id, hidden: extra.hidden });
    }

    if (everyone) {
      const discordIds = Object.values(linked);
      for (const discordId of discordIds) {
        await updateCommand.onCommand(interaction, { discordId, hidden: extra.hidden });
        console.log(`Updated roles for ${discordId}`);
      }
    }
  }
}

export default ForceUpdateCommand;
