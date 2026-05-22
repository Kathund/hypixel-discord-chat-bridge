import { type AutocompleteInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { CommandFlags, CommandResponse, type DiscordManagerWithClient } from '../../../Types/Discord.js';
import type CommandData from './CommandData.js';
import type DiscordManager from '../../DiscordManager.js';

class Command<T extends DiscordManager = DiscordManagerWithClient> {
  data!: CommandData;
  flags: CommandFlags[];
  response: CommandResponse;
  constructor(protected readonly discord: T) {
    this.flags = [];
    this.response = CommandResponse.Public;
  }

  execute(interaction: ChatInputCommandInteraction): Promise<void> | void {
    throw new Error('Execute Method not implemented!');
  }

  autocomplete(interaction: AutocompleteInteraction): Promise<void> | void {
    throw new Error('Auto Complete Method not implemented!');
  }
}

export default Command;
