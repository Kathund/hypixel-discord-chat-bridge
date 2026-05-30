import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { type ButtonInteraction, LabelBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ButtonResponse, CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";

class SetRankUserButton extends DiscordButton {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordButtonData("setRankUser");
    this.response = ButtonResponse.None;
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const linked = new LinkedCommand(this.discord).getLinked(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();
    const modal = new ModalBuilder().setCustomId("setRankUser").setTitle(`Set Rank ${username}`).addLabelComponents(this.createRankLabel());
    await interaction.showModal(modal);
  }

  private createRankLabel(): LabelBuilder {
    const ranks = this.discord.application.botGuild?.ranks;

    if (!ranks?.length) {
      return new LabelBuilder()
        .setLabel("Rank")
        .setTextInputComponent(new TextInputBuilder().setCustomId("setRankUserRank").setStyle(TextInputStyle.Short).setPlaceholder("Rank").setRequired(true));
    }

    return new LabelBuilder().setLabel("Rank").setStringSelectMenuComponent(
      new StringSelectMenuBuilder()
        .setCustomId("setRankUserRank")
        .setPlaceholder("Rank")
        .setRequired(true)
        .addOptions(ranks.map(({ name }) => new StringSelectMenuOptionBuilder().setLabel(name).setValue(name)))
    );
  }
}

export default SetRankUserButton;
