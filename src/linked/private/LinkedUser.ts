import HypixelDiscordChatBridgeError from "../../private/error.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { formatNumber, replaceVariables } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type LinkedManager from "../LinkedManager.js";
import type { Guild, GuildMember as HypixelGuildMember, Player } from "hypixel-api-reborn";
import type { GuildMember } from "discord.js";
import type { LinkedUserData } from "../../types/linked.js";

class LinkedUser {
  discordId: string;
  uuid: string;
  constructor(
    data: LinkedUserData,
    private readonly linked: LinkedManager
  ) {
    this.discordId = data.discordId;
    this.uuid = data.uuid;
  }

  async getUsername(): Promise<string> {
    const username = await MowojangAPI.getUsername(this.uuid);
    if (username === null) throw new HypixelDiscordChatBridgeError("User doesn't exist");
    return username;
  }

  save(): LinkedUser[] {
    const linked = this.linked.getLinkedUsers();
    const user = this.linked.getUser(this);
    if (user) return this.linked.getLinkedUsers();
    linked.push(this);
    return this.linked.writeLinkedUsersParsed(linked);
  }

  private getLinkedRoles(): string[] {
    const verificationRoles = this.linked.application.config.verification.roles;
    return [verificationRoles.verified.roleId, verificationRoles.guildMember.roleId, ...verificationRoles.custom.flatMap((r) => r.roleId)];
  }

  async reset(): Promise<void> {
    if (!this.linked.application.minecraft.isBotOnline()) return;
    if (!this.linked.application.discord.isClientOnline()) return;
    if (!this.linked.application.discord.isGuildReady()) return this.linked.application.discord.stateHandler.loadGuild();

    try {
      const member = await this.linked.application.discord.guild.members.fetch(this.discordId);
      if (!member) return;
      if (this.linked.application.config.verification.nickname.enabled && member.nickname) await member.setNickname(null);
      await member.roles.remove(this.getLinkedRoles(), "Updated Roles");
    } catch (error) {
      console.error(`Failed to completely clean up roles for ${this.discordId}:`, error);
    }
  }

  delete(): LinkedUser[] {
    const linked = this.linked.getLinkedUsers();
    const updated = linked.filter((u) => u.uuid !== this.uuid && u.discordId !== this.discordId);
    return this.linked.writeLinkedUsersParsed(updated);
  }

  async updateRoles(): Promise<this | null> {
    if (!this.linked.application.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError(this.linked.application.messages.minecraftBotOffline);
    if (!this.linked.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    if (!this.linked.application.discord.isGuildReady()) {
      this.linked.application.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }

    const member = await this.getDiscordUser();
    if (!member) {
      this.delete();
      return null;
    }

    if (this.linked.application.discord.guild.ownerId === member.user.id) {
      throw new HypixelDiscordChatBridgeError("This user owns the server thus no one can edit their roles");
    }

    const verificationRoles = this.linked.application.config.verification.roles;
    const rolesToAdd: string[] = [];

    if (verificationRoles.verified.enabled) rolesToAdd.push(verificationRoles.verified.roleId);
    const hypixelGuild = await this.linked.application.getBotGuild();
    const stats = await this.linked.getPlayerVariableStats(this.uuid, hypixelGuild);
    const guildMember = await this.isUserInHypixelGuild(hypixelGuild);
    if (guildMember) {
      if (verificationRoles.guildMember.enabled) rolesToAdd.push(verificationRoles.guildMember.roleId);

      const guildRank = verificationRoles.custom.find((r) =>
        r.requirements
          .filter((req) => r.enabled !== false && req.type === "guildRank")
          .map((req) => req.value)
          .includes(guildMember.rank)
      );
      if (guildRank && guildRank.enabled !== false) rolesToAdd.push(guildRank.roleId);
    }

    if (verificationRoles.custom.length > 0) {
      for (const role of verificationRoles.custom.filter((r) => r.requirements.some((req) => req.type !== "guildRank"))) {
        if (role.enabled === false) continue;
        const meetsRequirements = role.requirements.every((req) => req.value <= (stats[req.type] ?? 0));
        if (meetsRequirements) rolesToAdd.push(role.roleId);
      }
    }

    if (this.linked.application.config.verification.nickname.enabled) {
      member.setNickname(
        replaceVariables(
          this.linked.application.config.verification.nickname.nickname,
          Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, typeof value === "number" ? formatNumber(value) : value]))
        ).replace(/,/g, this.linked.application.config.verification.nickname.removeCommas ? "" : ","),
        "Updated Roles"
      );
    }

    await member.roles.add(rolesToAdd, "Updated Roles");
    await member.roles.remove(
      this.getLinkedRoles().filter((role) => !rolesToAdd.includes(role)),
      "Updated Roles"
    );
    return this;
  }

  async getDiscordUser(): Promise<GuildMember | null> {
    if (!this.linked.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    if (!this.linked.application.discord.isGuildReady()) {
      this.linked.application.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }

    return await this.linked.application.discord.guild.members.fetch(this.discordId).catch((e) => {
      console.error(e);
      return null;
    });
  }

  async getHypixelPlayer(): Promise<Player> {
    return await getPlayer(this.uuid);
  }

  async isUserInHypixelGuild(hypixelGuild: Guild | null = null): Promise<HypixelGuildMember | undefined> {
    const guild = hypixelGuild ?? (await this.linked.application.getBotGuild());
    return guild.members.find((member) => member.uuid === this.uuid);
  }

  toJSON(): LinkedUserData {
    return { uuid: this.uuid, discordId: this.discordId };
  }
}

export default LinkedUser;
