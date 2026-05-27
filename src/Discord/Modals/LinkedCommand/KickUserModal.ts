import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import LinkedCommand from '../Commands/Verification/LinkedCommand.js';
import Modal from '../Private/Modals/Modal.js';
import ModalData from '../Private/Modals/ModalData.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../Types/Discord.js';
import { SuccessEmbed } from '../Private/Embed.js';
import type { ModalSubmitInteraction } from 'discord.js';

class KickUserModal extends Modal<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new ModalData('kickUser');
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ModalSubmitInteraction): Promise<void> {
    const linkedCommand = new LinkedCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError('Unable to find the linked user');
    const linked = linkedCommand.getLinked(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError('Unable to find the linked user');
    const username = await linked.getUsername();
    const reason = interaction.fields.getTextInputValue('kickUserReason');
    this.discord.Application.minecraft.bot.chat(`/g kick ${username} ${reason}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully kicked \`${username}\` from the guild.`)] });
  }
}

export default KickUserModal;
