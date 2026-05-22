import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import config from '../../../config.json' with { type: 'json' };
import {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  GuildMember,
  MessageFlags,
  Role,
  type SendableChannels,
  Team
} from 'discord.js';
import { ErrorEmbed } from './Embed.js';
import type DiscordManager from '../DiscordManager.js';

class DiscordUtils {
  constructor(private readonly discord: DiscordManager) {}

  static async getApplicationOwners(client: Client): Promise<string[]> {
    if (!client.application) return [];
    const app = await client.application.fetch();
    if (app.owner instanceof Team) return app.owner.members.map((member) => member.id);
    return app.owner?.id ? [app.owner.id] : [];
  }

  async getOwners(): Promise<string[]> {
    if (!this.discord.isClientOnline()) return [];
    return await DiscordUtils.getApplicationOwners(this.discord.client);
  }

  async checkMessagePermissionsInChannel(channel: SendableChannels): Promise<boolean> {
    try {
      await channel.sendTyping();
      return true;
    } catch (error: any) {
      if (error?.code === 50001) return false;
      throw error;
    }
  }

  private getErrorEmbed(error: Error | HypixelDiscordChatBridgeError): ErrorEmbed {
    const errorStack = error instanceof Error ? (error.stack ?? error.message) : String(error ?? 'Unknown');
    return new ErrorEmbed().setDescription(`\`\`\`${errorStack}\`\`\``);
  }

  private async logError(error: Error | HypixelDiscordChatBridgeError): Promise<void> {
    if (error instanceof HypixelDiscordChatBridgeError) return;
    if (!this.discord.client?.application) return;

    try {
      const channel = await this.discord.client.channels.fetch(this.discord.Application.config.discord.channels.loggingChannel);
      if (!channel || !channel.isSendable()) return;

      const hasPermission = await this.checkMessagePermissionsInChannel(channel);
      if (!hasPermission) return;

      const owners = await this.getOwners();
      await channel.send({
        content: `${owners.map((id) => `<@${id}>`).join(' ')} <@&${this.discord.Application.config.discord.commands.commandRole}>`,
        embeds: [this.getErrorEmbed(error)]
      });
    } catch (e) {
      console.error(e);
    }
  }

  async handleError(
    error: Error | HypixelDiscordChatBridgeError,
    interaction: ChatInputCommandInteraction | ButtonInteraction | AutocompleteInteraction | null = null
  ): Promise<void> {
    console.error(error);
    await this.logError(error);

    if (!interaction || interaction.isAutocomplete()) return;

    const embed = new ErrorEmbed();
    if (error instanceof HypixelDiscordChatBridgeError) {
      embed.setDescription(`\`\`\`${error.message}\`\`\``);
    } else {
      embed.setDescription('This error has been reported to the owner. Please try again later.');
    }

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      }

      if (!(error instanceof HypixelDiscordChatBridgeError)) {
        await interaction.followUp({ embeds: [this.getErrorEmbed(error)], flags: MessageFlags.Ephemeral });
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async getAdminUsers(client: Client): Promise<string[]> {
    const applicationOwners = await this.getApplicationOwners(client);
    return [...new Set([...config.discord.commands.users, ...applicationOwners])];
  }

  static async getRoles(member: GuildMember): Promise<Role[]> {
    member = await member.fetch();
    return member.roles.cache.map((role) => role);
  }

  static async isStaffMember(member: GuildMember): Promise<boolean> {
    const userRoles = await this.getRoles(member).then((roles) => roles.map((role) => role.id));
    const adminUsers = await this.getAdminUsers(member.client);

    if (config.discord.commands.checkPerms === true && !(userRoles.includes(config.discord.commands.commandRole) || adminUsers.includes(member.user.id))) {
      return false;
    }

    return true;
  }

  static async isGuildMember(member: GuildMember): Promise<boolean> {
    const userRoles = await this.getRoles(member).then((roles) => roles.map((role) => role.id));
    const adminUsers = await this.getAdminUsers(member.client);

    if (config.discord.commands.checkPerms === true && !(userRoles.includes(config.verification.roles.guildMember.roleId) || adminUsers.includes(member.user.id))) {
      return false;
    }

    return true;
  }

  static async isVerifiedMember(member: GuildMember): Promise<boolean> {
    const userRoles = await this.getRoles(member).then((roles) => roles.map((role) => role.id));
    const adminUsers = await this.getAdminUsers(member.client);

    if (config.discord.commands.checkPerms === true && !(userRoles.includes(config.verification.roles.verified.roleId) || adminUsers.includes(member.user.id))) {
      return false;
    }

    return true;
  }
}

export default DiscordUtils;
