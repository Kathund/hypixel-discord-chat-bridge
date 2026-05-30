import BasicInteractionData from "../BasicInteractionData.js";
import { type AutoComplateOption, BasicInteractionResponse, type DiscordManagerWithClient } from "../../../types/discord.js";
import { ParseAutoComplete } from "../../../utils/discordUtils.js";
import type DiscordCommandData from "./DiscordCommandData.js";
import type DiscordManager from "../../DiscordManager.js";
import type { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";

class DiscordCommand<T extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<T> {
  data!: DiscordCommandData;
  response: BasicInteractionResponse;
  constructor(discord: T) {
    super(discord);
    this.response = BasicInteractionResponse.Public;
  }

  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedOption = interaction.options.getFocused(true);
    let choices: AutoComplateOption[];
    switch (focusedOption.name) {
      case "guild-member-username": {
        const members = this.discord.application.botGuildMembers;
        if (members === undefined) {
          choices = [{ name: "No username's cached" }];
          break;
        }
        choices = members.sort((a, b) => a.username.localeCompare(b.username)).map(({ username }) => ({ name: username }));
        break;
      }
      case "guild-rank": {
        const ranks = this.discord.application.botGuild?.ranks;
        if (ranks === undefined) {
          choices = [{ name: "No guild's cached" }];
          break;
        }
        choices = ranks.sort((a, b) => a.name.localeCompare(b.name)).map(({ name }) => ({ name }));
        break;
      }
      default: {
        choices = [{ name: "Something went wrong" }];
        break;
      }
    }

    await interaction.respond(ParseAutoComplete(interaction, choices));
  }

  execute(interaction: ChatInputCommandInteraction): Promise<void> | void {
    throw new Error("Execute Method not implemented!");
  }
}

export default DiscordCommand;
