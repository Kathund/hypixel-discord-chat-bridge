import { type BaseInteraction } from 'discord.js';
import type DiscordManager from '../DiscordManager.js';

class InteractionHandler {
  constructor(private readonly discord: DiscordManager) {}

  onInteraction(interaction: BaseInteraction) {
    if (interaction.isChatInputCommand()) this.discord.commandHandler.onCommand(interaction);
    if (interaction.isAutocomplete()) this.discord.commandHandler.onAutoComplete(interaction);
  }
}

export default InteractionHandler;
