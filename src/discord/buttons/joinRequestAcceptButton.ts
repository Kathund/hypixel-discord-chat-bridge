import DiscordButton from "../private/buttons/DiscordButton.js";
import DiscordButtonData from "../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { ActionRowBuilder, ButtonBuilder, type ButtonInteraction, ButtonStyle } from "discord.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../types/discord.js";
import { SuccessEmbed } from "../private/Embed.js";

class JoinRequestAcceptButton extends DiscordButton<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordButtonData("joinRequestAccept");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ButtonInteraction) {
    const username = this.getUsernameFromJoinRequest(interaction.message);
    if (!username) throw new HypixelDiscordChatBridgeError("Unable to find username");
    this.discord.application.minecraft.bot.chat(`/g accept ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully accepted \`${username}\` into the guild.`)] });
    await interaction.message.edit({
      embeds: interaction.message.embeds,
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId("joinRequestAccept").setLabel("Accept Request").setStyle(ButtonStyle.Success).setDisabled(true)
        )
      ]
    });
  }
}

export default JoinRequestAcceptButton;
