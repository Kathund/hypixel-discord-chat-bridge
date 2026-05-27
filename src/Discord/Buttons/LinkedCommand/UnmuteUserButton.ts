import Button from '../../Private/Buttons/Button.js';
import ButtonData from '../../Private/Buttons/ButtonData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import LinkedCommand from '../../Commands/Verification/LinkedCommand.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../Types/Discord.js';
import { SuccessEmbed } from '../../Private/Embed.js';
import type { ButtonInteraction } from 'discord.js';

class UnmuteUserButton extends Button<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new ButtonData('unmuteUser');
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = linkedCommand.getLinked(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError('Unable to find the linked user');
    const username = await linked.getUsername();
    this.discord.Application.minecraft.bot.chat(`/g unmute ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully unmuted **${username}**.`)] });
  }
}

export default UnmuteUserButton;
