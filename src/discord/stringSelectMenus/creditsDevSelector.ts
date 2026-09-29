import CreditsCommand from "../commands/creditsCommand.ts";
import DiscordStringSelectMenu from "../private/stringSelectMenu/DiscordStringSelectMenu.ts";
import DiscordStringSelectMenuData from "../private/stringSelectMenu/DiscordStringSelectMenuData.ts";
import { ButtonResponse, type StringSelectMenuInteractionWithGuild } from "../../types/discord.ts";
import type { DevName } from "../../types/application.ts";

class CreditsDevSelector extends DiscordStringSelectMenu {
  override readonly data = new DiscordStringSelectMenuData("creditsDevSelector");
  override response: ButtonResponse = ButtonResponse.Update;

  override async execute(interaction: StringSelectMenuInteractionWithGuild) {
    const creditsCommand = new CreditsCommand(this.discord);
    await interaction.editReply(creditsCommand.getDevInfoResponse(interaction.values[0] as DevName));
  }
}

export default CreditsDevSelector;
