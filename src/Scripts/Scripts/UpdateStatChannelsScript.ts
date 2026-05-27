import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import Script from '../Private/Script.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type ScriptManager from '../ScriptsManager.js';

class UpdateStatChannelsScript extends Script {
  constructor(scripts: ScriptManager) {
    super(scripts, {
      enabled: scripts.Application.config.statsChannels.enabled,
      id: 'updateStatChannels',
      interval: scripts.Application.config.statsChannels.autoUpdaterInterval * 60 * 1000
    });
  }

  override async execute(): Promise<void> {
    if (!this.scripts.Application.discord.isGuildReady()) {
      this.scripts.Application.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }
    const hypixelGuild = await this.scripts.Application.discord.Application.getBotGuild();
    const [channels, roles] = await Promise.all([this.scripts.Application.discord.guild.channels.fetch(), this.scripts.Application.discord.guild.roles.fetch()]);

    const stats = {
      guildName: hypixelGuild.name,
      guildLevel: Math.floor(hypixelGuild.level).toFixed(0),
      guildLevelWithProgress: hypixelGuild.level,
      guildXP: hypixelGuild.experience,
      guildWeeklyXP: hypixelGuild.totalWeeklyGEXP,
      guildMembers: hypixelGuild.members.length,
      discordMembers: this.scripts.Application.discord.guild.memberCount,
      discordChannels: channels.size,
      discordRoles: roles.size
    };

    for (const channelInfo of this.scripts.Application.discord.Application.config.statsChannels.channels) {
      const channel = await this.scripts.Application.discord.guild.channels.fetch(channelInfo.id);
      await channel?.setName(ReplaceVariables(channelInfo.name, stats), 'Updated Channels');
    }
  }
}

export default UpdateStatChannelsScript;
