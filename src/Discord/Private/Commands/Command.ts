import DiscordUtils from '../DiscordUtils.js';
import { type AutoComplateOption, CommandFlags, CommandResponse, type DiscordManagerWithClient } from '../../../Types/Discord.js';
import { type AutocompleteInteraction, type ChatInputCommandInteraction } from 'discord.js';
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

  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedOption = interaction.options.getFocused(true);
    let choices: AutoComplateOption[];
    switch (focusedOption.name) {
      case 'guild-member-username': {
        const members = this.discord.Application.botGuildMembers;
        if (members === undefined) {
          choices = [{ name: "No username's cached" }];
          break;
        }
        choices = members.sort((a, b) => a.username.localeCompare(b.username)).map(({ username }) => ({ name: username }));
        break;
      }
      default: {
        choices = [{ name: 'Something went wrong' }];
        break;
      }
    }

    await interaction.respond(DiscordUtils.ParseAutoComplete(interaction, choices));
  }

  execute(interaction: ChatInputCommandInteraction): Promise<void> | void {
    throw new Error('Execute Method not implemented!');
  }
}

export default Command;
