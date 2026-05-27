import Button from '../../Private/Buttons/Button.js';
import ButtonData from '../../Private/Buttons/ButtonData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import LinkedCommand from '../../Commands/Verification/LinkedCommand.js';
import UnverifyCommand from '../../Commands/Verification/UnverifyCommand.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../Types/Discord.js';
import type { ButtonInteraction } from 'discord.js';

class UnverifyUserButton extends Button<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new ButtonData('unverifyUser');
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = linkedCommand.getLinked(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError('Unable to find the linked user');
    const unverifyCommand = new UnverifyCommand(this.discord);
    unverifyCommand.isSelf = false;
    unverifyCommand.discordId = linked.discordId;
    await unverifyCommand.execute(interaction);
  }
}

export default UnverifyUserButton;
