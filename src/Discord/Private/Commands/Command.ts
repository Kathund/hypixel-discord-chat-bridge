import BasicInteractionData from '../BasicInteractionData.js';
import DiscordUtils from '../DiscordUtils.js';
import { type AutoComplateOption, BasicInteractionResponse, type DiscordManagerWithClient } from '../../../Types/Discord.js';
import type CommandData from './CommandData.js';
import type DiscordManager from '../../DiscordManager.js';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';

class Command<T extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<T> {
  data!: CommandData;
  response: BasicInteractionResponse;
  constructor(discord: T) {
    super(discord);
    this.response = BasicInteractionResponse.Public;
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
      case 'guild-rank': {
        const ranks = this.discord.Application.botGuild?.ranks;
        if (ranks === undefined) {
          choices = [{ name: "No guild's cached" }];
          break;
        }
        choices = ranks.sort((a, b) => a.name.localeCompare(b.name)).map(({ name }) => ({ name }));
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
