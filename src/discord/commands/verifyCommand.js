import { Embed, ErrorEmbed, SuccessEmbed } from "../../contracts/embedHandler.js";
import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import { formatError } from "../../contracts/helperFunctions.js";
import { MessageFlags, SlashCommandBuilder } from "discord.js";
import DiscordCommand from "../../contracts/DiscordCommand.js";
import HypixelAPI from "../../contracts/API/HypixelAPI.js";
import { writeFileSync, readFileSync } from "fs";
import UpdateCommand from "./updateCommand.js";
import config from "../../../config.json" with { type: "json" };

class VerifyCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("verify")
      .setDescription("Connect your Discord account to Minecraft")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.verificationCommand = true;
    this.requiresBot = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction, extra = {}) {
    try {
      const linkedData = readFileSync("data/linked.json");
      if (!linkedData) {
        throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
      }

      const linked = JSON.parse(linkedData.toString("utf8"));
      if (!linked) {
        throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
      }

      const linkedRole = guild.roles.cache.get(config.verification.roles.verified.roleId);
      if (!linkedRole) {
        throw new HypixelDiscordChatBridgeError("The verified role does not exist. Please contact an administrator.");
      }

      const username = interaction.options.getString("username");
      const { socialMedia, nickname, uuid } = await HypixelAPI.getPlayer(username);

      const discordUsername = socialMedia.find((media) => media.id === "DISCORD")?.link;
      if (!discordUsername) {
        throw new HypixelDiscordChatBridgeError(`The player '${nickname}' has not linked their Discord account. Please follow the instructions below.`);
      }

      if (discordUsername.toLowerCase() !== interaction.user.username) {
        throw new HypixelDiscordChatBridgeError(
          `The player '${nickname}' has linked their Discord account to a different account ('${discordUsername}'). Please follow the instructions below.`
        );
      }

      linked[uuid] = interaction.user.id;
      writeFileSync("data/linked.json", JSON.stringify(linked, null, 2));

      const embed = new SuccessEmbed(`${extra.user ? `<@${extra.user.id}>'s` : "Your"} account has been successfully linked to \`${nickname}\``)
        .setAuthor({ name: "Successfully linked!" })
        .setFooter({
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png"
        });

      await interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });

      await new UpdateCommand().onCommand(interaction);
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line no-ex-assign
      error = formatError(error);

      const errorEmbed = new ErrorEmbed(`\`\`\`${error}\`\`\``).setFooter({
        text: `by @.kathund | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });

      await interaction.editReply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
      if (error.includes("Please follow the instructions below.")) {
        const verificationTutorialEmbed = new Embed()
          .setAuthor({ name: "Link with Hypixel Social Media" })
          .setDescription(
            `**Instructions:**\n1) Use your Minecraft client to connect to Hypixel.\n2) Once connected, and while in the lobby, right click "My Profile" in your hotbar. It is option #2.\n3) Click "Social Media" - this button is to the left of the Redstone block (the Status button).\n4) Click "Discord" - it is the second last option.\n5) Paste your Discord username into chat and hit enter. For reference: \`${interaction.user.username ?? interaction.user.tag}\`\n6) You're done! Wait around 30 seconds and then try again.\n\n**Getting "The URL isn't valid!"?**\nHypixel has limitations on the characters supported in a Discord username. Try changing your Discord username temporarily to something without special characters, updating it in-game, and trying again.`
          )
          .setImage("https://media.discordapp.net/attachments/922202066653417512/1066476136953036800/tutorial.gif")
          .setFooter({
            text: `by @.kathund | /help [command] for more information`,
            iconURL: "https://i.imgur.com/uUuZx2E.png"
          });

        await interaction.followUp({ embeds: [verificationTutorialEmbed], flags: MessageFlags.Ephemeral });
      }
    }
  }
}

export default VerifyCommand;
