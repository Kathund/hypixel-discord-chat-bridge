import Command from '../../Private/Commands/Command.js';
import CommandData from '../../Private/Commands/CommandData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import UpdateCommand from './UpdateCommand.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../Types/Discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

class ForceUpdateCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName('force-update')
      .setDescription("Update user's roles")
      .addUserOption((option) => option.setName('user').setDescription('Discord Username').setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.options.getUser('user');
    if (!user) throw new HypixelDiscordChatBridgeError('The `user` option is missing?');
    const updateCommand = new UpdateCommand(this.discord);
    updateCommand.isSelf = false;
    updateCommand.discordId = user.id;
    await updateCommand.execute(interaction);
  }
}

export default ForceUpdateCommand;
