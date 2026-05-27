import BasicInteractionData from '../BasicInteractionData.js';
import { BasicInteractionResponse, type DiscordManagerWithClient } from '../../../Types/Discord.js';
import type DiscordManager from '../../DiscordManager.js';
import type ModalData from './ModalData.js';
import type { ModalSubmitInteraction } from 'discord.js';

class Modal<T extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<T> {
  data!: ModalData;
  response: BasicInteractionResponse;
  constructor(discord: T) {
    super(discord);
    this.response = BasicInteractionResponse.Ephemeral;
  }

  execute(interaction: ModalSubmitInteraction): Promise<void> | void {
    throw new Error('Execute Method not implemented!');
  }
}

export default Modal;
