import DiscordButton from "../../private/buttons/DiscordButton.ts";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.ts";
import GexpCheckCommand from "../../commands/verification/inactivity/gexpCheckCommand.ts";
import HypixelDiscordChatBridgeError from "../../../private/error.ts";
import { type ButtonInteractionWithGuild, ButtonResponse, CommandFlags, CommandPermission } from "../../../types/discord.ts";
import { CheckboxGroupBuilder, CheckboxGroupOptionBuilder, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { type GexpCheckOptionsDisplays, gexpCheckData } from "../../../types/inactivity.ts";

class GexpCheckFiltersButton extends DiscordButton {
  override readonly data = new DiscordButtonData("gexpCheckFilters");
  override readonly response = ButtonResponse.None;
  override readonly flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const options = GexpCheckCommand.getOptionsfromMessage(interaction.message);
    if (!options) throw new HypixelDiscordChatBridgeError("Unable to find the requirement gexp");
    const guild = this.discord.application.botGuild ? this.discord.application.botGuild : await this.discord.application.getBotGuild();

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId("gexpCheckFilters")
        .setTitle("Gexp Check Filters")
        .addLabelComponents(
          new LabelBuilder()
            .setLabel("Amount")
            .setDescription("Change the required amount of gexp")
            .setTextInputComponent(
              new TextInputBuilder()
                .setCustomId("gexpCheckFiltersAmount")
                .setStyle(TextInputStyle.Short)
                .setMinLength(1)
                .setMaxLength(6)
                .setPlaceholder(String(options.requirement))
                .setRequired(false)
            ),
          new LabelBuilder()
            .setLabel("Hidden Ranks")
            .setDescription("People with these ranks are hidden")
            .setCheckboxGroupComponent(
              new CheckboxGroupBuilder()
                .setCustomId("gexpCheckFiltersRank")
                .setOptions(
                  new CheckboxGroupOptionBuilder().setLabel("Guild Master").setValue("Guild Master").setDefault(options.hiddenRanks.includes("Guild Master")),
                  ...guild.ranks
                    .reverse()
                    .map(({ name }) => new CheckboxGroupOptionBuilder().setLabel(name).setValue(name).setDefault(options.hiddenRanks.includes(name)))
                )
                .setRequired(false)
            ),
          new LabelBuilder().setLabel("Filters").setCheckboxGroupComponent(
            new CheckboxGroupBuilder()
              .setCustomId("gexpCheckFiltersMain")
              .setRequired(false)
              .setOptions(
                Object.entries(gexpCheckData).map(([id, { label, description }]) =>
                  new CheckboxGroupOptionBuilder()
                    .setValue(id)
                    .setLabel(label)
                    .setDescription(description)
                    .setDefault(options[id.replaceAll("gexpcheck_", "") as keyof GexpCheckOptionsDisplays] ?? false)
                )
              )
          )
        )
    );
  }
}

export default GexpCheckFiltersButton;
