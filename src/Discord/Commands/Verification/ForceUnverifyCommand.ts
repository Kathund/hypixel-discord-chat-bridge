import Command from '../../Private/Commands/Command.js';
import CommandData from '../../Private/Commands/CommandData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import UnverifyCommand from './UnverifyCommand.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../Types/Discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

class ForceUnverifyCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName('force-unverify')
      .setDescription('Remove a linked Minecraft account')
      .addUserOption((option) => option.setName('user').setDescription('Discord Username').setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.options.getUser('user');
    if (!user) throw new HypixelDiscordChatBridgeError('The `user` option is missing?');
    const unverifyCommand = new UnverifyCommand(this.discord);
    unverifyCommand.isSelf = false;
    unverifyCommand.discordId = user.id;
    await unverifyCommand.execute(interaction);
  }
}

export default ForceUnverifyCommand;
