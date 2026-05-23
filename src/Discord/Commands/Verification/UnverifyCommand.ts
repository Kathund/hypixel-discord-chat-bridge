import Command from '../../Private/Commands/Command.js';
import CommandData from '../../Private/Commands/CommandData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../Types/Discord.js';
import { SuccessEmbed } from '../../Private/Embed.js';
import type { ChatInputCommandInteraction } from 'discord.js';

class UnverifyCommand extends Command<DiscordManagerWithBot> {
  discordId: string | null = null;
  isSelf: boolean = false;
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData().setName('unverify').setDescription('Remove your linked Minecraft account');
    this.flags = [CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (this.discordId === null) {
      this.isSelf = true;
      this.discordId = interaction.user.id;
    }
    const linkedUser = this.discord.Application.linked.getUserByDiscordId(this.discordId);
    if (linkedUser === undefined) throw new HypixelDiscordChatBridgeError('User is not verified');
    await linkedUser.reset();
    linkedUser.delete();
    await interaction.followUp({
      embeds: [new SuccessEmbed().setDescription(`${this.isSelf ? 'Your' : `<@${this.discordId}>'s`} account has been successfully unlinked`).setDevFooter('Kathund')]
    });
  }
}

export default UnverifyCommand;
