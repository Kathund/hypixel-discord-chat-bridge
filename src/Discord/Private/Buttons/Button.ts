import BasicInteractionData from '../BasicInteractionData.js';
import { ButtonResponse, type DiscordManagerWithClient } from '../../../Types/Discord.js';
import type ButtonData from './ButtonData.js';
import type DiscordManager from '../../DiscordManager.js';
import type { ButtonInteraction } from 'discord.js';

class Button<T extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<T> {
  data!: ButtonData;
  response: ButtonResponse;
  constructor(discord: T) {
    super(discord);
    this.response = ButtonResponse.Ephemeral;
  }

  execute(interaction: ButtonInteraction): Promise<void> | void {
    throw new Error('Execute Method not implemented!');
  }
}

export default Button;
