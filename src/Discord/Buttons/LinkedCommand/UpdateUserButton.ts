import Button from '../../Private/Buttons/Button.js';
import ButtonData from '../../Private/Buttons/ButtonData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import LinkedCommand from '../../Commands/Verification/LinkedCommand.js';
import UpdateCommand from '../../Commands/Verification/UpdateCommand.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../Types/Discord.js';
import type { ButtonInteraction } from 'discord.js';

class UpdateUserButton extends Button<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new ButtonData('updateUser');
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = linkedCommand.getLinked(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError('Unable to find the linked user');
    const updateCommand = new UpdateCommand(this.discord);
    updateCommand.isSelf = false;
    updateCommand.discordId = linked.discordId;
    await updateCommand.execute(interaction);
  }
}

export default UpdateUserButton;
