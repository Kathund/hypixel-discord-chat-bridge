import HypixelDiscordChatBridgeError from "../../private/error.js";
import { BasicInteractionResponse } from "../../types/discord.js";
import { Collection, MessageFlags, type ModalSubmitInteraction } from "discord.js";
import { readdir } from "node:fs/promises";
import type DiscordManager from "../DiscordManager.js";
import type DiscordModal from "../private/modals/DiscordModal.js";

class ModalHandler {
  constructor(private readonly discord: DiscordManager) {}

  async onSubmit(interaction: ModalSubmitInteraction) {
    const modal = interaction.client.modals.get(interaction.customId);
    if (!modal) return;

    try {
      if (modal.response !== BasicInteractionResponse.None) {
        await interaction.deferReply({ flags: modal.response === BasicInteractionResponse.Ephemeral ? MessageFlags.Ephemeral : undefined });
      }
      console.discord(`Modal submitted ${interaction.user.username} (${interaction.user.id}) modal ${interaction.customId}`);

      await this.discord.interactionHandler.checkPerms(interaction, modal);

      await modal.execute(interaction);
    } catch (error: unknown) {
      if (error instanceof Error || error instanceof HypixelDiscordChatBridgeError) this.discord.handleError(error, interaction);
    }
  }

  async loadModals() {
    if (!this.discord.client) return;
    this.discord.client.modals = new Collection<string, DiscordModal>();
    const modalFiles = await readdir("./src/discord/modals/", { recursive: true, encoding: "utf-8" }).then((files) => files.filter((file) => file.endsWith(".ts")));
    for (const file of modalFiles) {
      const modal: DiscordModal = new (await import(`../modals/${file}`)).default(this.discord);
      this.discord.client.modals.set(modal.data.id, modal);
    }
    console.discord(`Successfully loaded ${this.discord.client.modals.size} modal(s).`);
  }
}

export default ModalHandler;
