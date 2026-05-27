import Button from '../../Private/Buttons/Button.js';
import ButtonData from '../../Private/Buttons/ButtonData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import LinkedCommand from '../../Commands/Verification/LinkedCommand.js';
import { type ButtonInteraction, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ButtonResponse, CommandFlags, type DiscordManagerWithClient } from '../../../Types/Discord.js';

class MuteUserButton extends Button {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new ButtonData('muteUser');
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
        .setCustomId('muteUser')
        .setTitle(`Mute ${username}`)
        .addLabelComponents(
          new LabelBuilder()
            .setLabel(`Length of ${username}'s mute`)
            .setTextInputComponent(new TextInputBuilder().setCustomId('muteUserTime').setStyle(TextInputStyle.Short).setPlaceholder(`Length of ${username}'s mute`))
        )
    );
  }
}

export default MuteUserButton;
