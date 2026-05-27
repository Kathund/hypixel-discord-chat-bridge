import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import { BasicInteractionResponse } from '../../Types/Discord.js';
import { Collection, MessageFlags, type ModalSubmitInteraction } from 'discord.js';
import { readdirSync } from 'node:fs';
import type DiscordManager from '../DiscordManager.js';
import type Modal from '../Private/Modals/Modal.js';

class ModalHandler {
  constructor(private readonly discord: DiscordManager) {}

  async onSubmit(interaction: ModalSubmitInteraction): Promise<void> {
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
      if (error instanceof Error || error instanceof HypixelDiscordChatBridgeError) this.discord.utils.handleError(error, interaction);
    }
  }

  async loadModals(): Promise<void> {
    if (!this.discord.client) return;
    this.discord.client.modals = new Collection<string, Modal>();
    const buttonFiles = readdirSync('./src/Discord/Modals/', { recursive: true, encoding: 'utf-8' }).filter((file) => file.endsWith('.ts'));
    for (const file of buttonFiles) {
      const modal: Modal = new (await import(`../Modals/${file}`)).default(this.discord);
      this.discord.client.modals.set(modal.data.id, modal);
    }
    console.discord(`Successfully loaded ${this.discord.client.modals.size} modal(s).`);
  }
}

export default ModalHandler;
