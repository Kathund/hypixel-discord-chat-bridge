import Command from '../../Private/Commands/Command.js';
import CommandData from '../../Private/Commands/CommandData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../Types/Discord.js';
import { ReplaceVariables } from '../../../Utils/StringUtils.js';
import { SuccessEmbed } from '../../Private/Embed.js';
import type { ChatInputCommandInteraction } from 'discord.js';

class ForceUpdateStatsChannelsCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData().setName('force-update-stats-channels').setDescription('Update the stats Channels');
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.StatChannelsCommand];
  }

  async updateChannels() {
    if (!this.discord.isGuildReady()) {
      this.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }
    const hypixelGuild = await this.discord.Application.getBotGuild();
    const [channels, roles] = await Promise.all([this.discord.guild.channels.fetch(), this.discord.guild.roles.fetch()]);

    const stats = {
      guildName: hypixelGuild.name,
      guildLevel: Math.floor(hypixelGuild.level).toFixed(0),
      guildLevelWithProgress: hypixelGuild.level,
      guildXP: hypixelGuild.experience,
      guildWeeklyXP: hypixelGuild.totalWeeklyGEXP,
      guildMembers: hypixelGuild.members.length,
      discordMembers: this.discord.guild.memberCount,
      discordChannels: channels.size,
      discordRoles: roles.size
    };

    for (const channelInfo of this.discord.Application.config.statsChannels.channels) {
      const channel = await this.discord.guild.channels.fetch(channelInfo.id);
      await channel?.setName(ReplaceVariables(channelInfo.name, stats), 'Updated Channels');
    }
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await this.updateChannels();
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription('The channels have been updated successfully.').setDevFooter('Kathund')] });
  }
}

export default ForceUpdateStatsChannelsCommand;
