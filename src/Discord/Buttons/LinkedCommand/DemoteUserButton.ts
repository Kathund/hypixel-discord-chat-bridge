import Button from '../../Private/Buttons/Button.js';
import ButtonData from '../../Private/Buttons/ButtonData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import LinkedCommand from '../../Commands/Verification/LinkedCommand.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../Types/Discord.js';
import { SuccessEmbed } from '../../Private/Embed.js';
import type { ButtonInteraction } from 'discord.js';

class DemoteUserButton extends Button<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new ButtonData('demoteUser');
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = linkedCommand.getLinked(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError('Unable to find the linked user');
    const username = await linked.getUsername();
    this.discord.Application.minecraft.bot.chat(`/g demote ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully demoted \`${username}\` by one guild rank.`)] });
  }
}

export default DemoteUserButton;
