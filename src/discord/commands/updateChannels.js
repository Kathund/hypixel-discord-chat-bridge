import DiscordCommand from "../../contracts/DiscordCommand.js";
import HypixelAPI from "../../contracts/API/HypixelAPI.js";
import config from "../../../config.json" with { type: "json" };
import { SlashCommandBuilder } from "discord.js";
import { SuccessEmbed } from "../../contracts/embedHandler.js";
import { replaceVariables } from "../../contracts/helperFunctions.js";

class Command extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder().setName("update-channels").setDescription("Update the stats Channels");
    this.channelsCommand = true;
    this.moderatorOnly = true;
    this.requiresBot = true;
  }

  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {{hidden: boolean}} [extra={hidden: false}]
   */
  async onCommand(interaction, extra = {}) {
    const hypixelGuild = await HypixelAPI.getGuild("player", bot.username);
    const [channels, roles] = await Promise.all([guild.channels.fetch(), guild.roles.fetch()]);

    const stats = {
      guildName: hypixelGuild.name,
      guildLevel: hypixelGuild.level.toFixed(0),
      guildLevelWithProgress: hypixelGuild.level,
      guildXP: hypixelGuild.experience,
      guildWeeklyXP: hypixelGuild.totalWeeklyGexp,
      guildMembers: hypixelGuild.members.length,
      discordMembers: guild.memberCount,
      discordChannels: channels.size,
      discordRoles: roles.size
    };

    config.statsChannels.channels.forEach(async (channelInfo) => {
      const channel = await guild.channels.fetch(channelInfo.id);
      // console.log(`Updating channel ${channel.name} with ID ${channel.id} to ${replaceVariables(channelInfo.name, stats)}`);
      channel.setName(replaceVariables(channelInfo.name, stats), "Updated Channels");
    });

    if (!extra.hidden) {
      const embed = new SuccessEmbed("The channels have been updated successfully.").setFooter({
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });

      await interaction.followUp({ embeds: [embed] });
    }
  }
}

export default Command;
