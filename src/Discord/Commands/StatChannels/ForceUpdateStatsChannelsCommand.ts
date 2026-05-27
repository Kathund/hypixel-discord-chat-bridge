import Command from '../../Private/Commands/Command.js';
import CommandData from '../../Private/Commands/CommandData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../Types/Discord.js';
import { SuccessEmbed } from '../../Private/Embed.js';
import type { ChatInputCommandInteraction } from 'discord.js';

class ForceUpdateStatsChannelsCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData().setName('force-update-stats-channels').setDescription('Update the stats Channels');
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.StatChannelsCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const script = this.discord.Application.scripts.scripts.get('updateStatChannels');
    if (!script) throw new HypixelDiscordChatBridgeError('Unable to find the update stat channels script? Please restart the Application');
    await script.execute();
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription('The channels have been updated successfully.').setDevFooter('Kathund')] });
  }
}

export default ForceUpdateStatsChannelsCommand;
