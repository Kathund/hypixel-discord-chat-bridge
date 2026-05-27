import Button from '../../Private/Buttons/Button.js';
import ButtonData from '../../Private/Buttons/ButtonData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import LinkedCommand from '../../Commands/Verification/LinkedCommand.js';
import { type ButtonInteraction, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ButtonResponse, CommandFlags, type DiscordManagerWithClient } from '../../../Types/Discord.js';

class KickUserButton extends Button {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new ButtonData('kickUser');
    this.response = ButtonResponse.None;
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = linkedCommand.getLinked(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError('Unable to find the linked user');
    const username = await linked.getUsername();

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId('kickUser')
        .setTitle(`Kick ${username}`)
        .addLabelComponents(
          new LabelBuilder()
            .setLabel(`Reason for kicking ${username}`)
            .setTextInputComponent(
              new TextInputBuilder().setCustomId('kickUserReason').setStyle(TextInputStyle.Short).setPlaceholder(`Reason for kicking ${username}`).setRequired(true)
            )
        )
    );
  }
}

export default KickUserButton;
