import Button from '../../Private/Buttons/Button.js';
import ButtonData from '../../Private/Buttons/ButtonData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import LinkedCommand from '../../Commands/Verification/LinkedCommand.js';
import { type ButtonInteraction, LabelBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ButtonResponse, CommandFlags, type DiscordManagerWithClient } from '../../../Types/Discord.js';

class SetRankUserButton extends Button {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new ButtonData('setRankUser');
    this.response = ButtonResponse.None;
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const linked = new LinkedCommand(this.discord).getLinked(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError('Unable to find the linked user');
    const username = await linked.getUsername();
    const modal = new ModalBuilder().setCustomId('setRankUser').setTitle(`Set Rank ${username}`).addLabelComponents(this.createRankLabel());
    await interaction.showModal(modal);
  }

  private createRankLabel(): LabelBuilder {
    const ranks = this.discord.Application.botGuild?.ranks;

    if (!ranks?.length) {
      return new LabelBuilder()
        .setLabel('Rank')
        .setTextInputComponent(new TextInputBuilder().setCustomId('setRankUserRank').setStyle(TextInputStyle.Short).setPlaceholder('Rank').setRequired(true));
    }

    return new LabelBuilder().setLabel('Rank').setStringSelectMenuComponent(
      new StringSelectMenuBuilder()
        .setCustomId('setRankUserRank')
        .setPlaceholder('Rank')
        .setRequired(true)
        .addOptions(ranks.map(({ name }) => new StringSelectMenuOptionBuilder().setLabel(name).setValue(name)))
    );
  }
}

export default SetRankUserButton;
