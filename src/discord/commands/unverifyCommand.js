import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import { SuccessEmbed, ErrorEmbed } from "../../contracts/embedHandler.js";
import { getUsername } from "../../contracts/API/mowojangAPI.js";
import { MessageFlags, SlashCommandBuilder } from "discord.js";
import DiscordCommand from "../../contracts/DiscordCommand.js";
import { writeFileSync, readFileSync } from "fs";
import UpdateCommand from "./updateCommand.js";

class UnverifyCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder().setName("unverify").setDescription("Remove your linked Minecraft account");
    this.requiresBot = true;
    this.verificationCommand = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    try {
      const linkedData = readFileSync("data/linked.json");
      if (!linkedData) {
        throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
      }

      const linked = JSON.parse(linkedData);
      if (!linked) {
        throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
      }

      const uuid = linked[interaction.user.id];
      if (uuid === undefined) {
        throw new HypixelDiscordChatBridgeError(`You are not verified. Please run /verify to continue.`);
      }

      delete linked[interaction.user.id];
      writeFileSync("data/linked.json", JSON.stringify(linked, null, 2));

      const updateRole = new SuccessEmbed(`You have successfully unlinked \`${await getUsername(uuid)}\`. Run \`/verify\` to link a new account.`, {
        text: `by @.kathund | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });
      await interaction.followUp({ embeds: [updateRole] });
      await new UpdateCommand().onCommand(interaction, { hidden: true });
    } catch (error) {
      const errorEmbed = new ErrorEmbed(`\`\`\`${error}\`\`\``).setFooter({
        text: `by @.kathund | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });

      await interaction.editReply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
    }
  }
}

export default UnverifyCommand;
