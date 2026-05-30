import HypixelDiscordChatBridgeError from "../../private/error.js";
import Script from "../private/script.js";
import { replaceVariables } from "../../utils/stringUtils.js";
import type ScriptManager from "../ScriptsManager.js";

class UpdateStatChannelsScript extends Script {
  constructor(scripts: ScriptManager) {
    super(scripts, {
      enabled: scripts.application.config.statsChannels.enabled,
      id: "updateStatChannels",
      interval: scripts.application.config.statsChannels.autoUpdaterInterval * 60 * 1000
    });
  }

  override async execute(): Promise<void> {
    if (!this.scripts.application.discord.isGuildReady()) {
      this.scripts.application.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }
    const hypixelGuild = await this.scripts.application.discord.application.getBotGuild();
    const [channels, roles] = await Promise.all([this.scripts.application.discord.guild.channels.fetch(), this.scripts.application.discord.guild.roles.fetch()]);

    const stats = {
      guildName: hypixelGuild.name,
      guildLevel: Math.floor(hypixelGuild.level).toFixed(0),
      guildLevelWithProgress: hypixelGuild.level,
      guildXP: hypixelGuild.experience,
      guildWeeklyXP: hypixelGuild.totalWeeklyGEXP,
      guildMembers: hypixelGuild.members.length,
      discordMembers: this.scripts.application.discord.guild.memberCount,
      discordChannels: channels.size,
      discordRoles: roles.size
    };

    for (const channelInfo of this.scripts.application.discord.application.config.statsChannels.channels) {
      const channel = await this.scripts.application.discord.guild.channels.fetch(channelInfo.id);
      await channel?.setName(replaceVariables(channelInfo.name, stats), "Updated Channels");
    }
  }
}

export default UpdateStatChannelsScript;
