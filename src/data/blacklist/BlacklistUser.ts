import Embed, { SuccessEmbed } from "../../discord/private/Embed.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type BlacklistManager from "./BlacklistManager.js";
import type { BasicBlacklistedUserData, BlacklistedUserData } from "../../types/blacklist.js";
import type { Guild, GuildMember as HypixelGuildMember, Player } from "hypixel-api-reborn";
import type { GuildMember, User } from "discord.js";

class BlacklistUser {
  readonly blacklistId: string;
  readonly discordId: string | null;
  readonly uuid: string | null;
  readonly reason: string;
  readonly timestamp: number;
  readonly by: string;
  constructor(
    data: BasicBlacklistedUserData,
    private readonly blacklist: BlacklistManager
  ) {
    this.blacklistId = data.blacklistId ?? crypto.randomUUID();
    this.discordId = data.discordId;
    this.uuid = data.uuid;
    this.reason = data.reason;
    this.timestamp = data.timestamp ?? Math.floor(Date.now() / 1000);
    this.by = data.by;
  }

  async getUsername(): Promise<string | null> {
    if (!this.uuid) return null;
    const username = await MowojangAPI.getUsername(this.uuid);
    if (username === null) throw new HypixelDiscordChatBridgeError("User doesn't exist");
    return username;
  }

  async save(data: { alertUser: boolean; shareUser: boolean; user: User }): Promise<BlacklistUser> {
    const blacklisted = await this.blacklist.getBlacklistUsers();
    const user = await this.blacklist.getUser(this);
    if (user) return user;
    blacklisted.push(this);
    await this.blacklist.writeBlacklistUsersParsed(blacklisted);
    return await this.handleSave(data);
  }

  private async handleSave({ alertUser, shareUser, user }: { alertUser: boolean; shareUser: boolean; user: User }): Promise<this> {
    if (!this.blacklist.data.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    const channel = await this.blacklist.data.application.discord.getChannel("Logger");
    if (!channel || !channel.isSendable()) return this;
    const blacklistData = await this.blacklist.getBlacklistDataResponse(this);
    await channel.send({ ...blacklistData, content: "User has been blacklisted" });
    if (this.discordId && alertUser) {
      const embed = new Embed()
        .setColor("Red")
        .setAuthor({ name: "You have been blacklisted" })
        .setDescription(this.reason)
        .setFooter({ text: `Blacklisted by @${user.id}`, iconURL: user.avatarURL({ size: 4096 }) || undefined });
      if (!shareUser) embed.setDevFooter("Kathund");
      const send = await this.blacklist.data.application.discord.client.users.send(this.discordId, { embeds: [embed] }).catch((e: Error) => {
        if (e.name === "DiscordAPIError[50278]") return null;
        throw e;
      });
      if (send === null) throw new HypixelDiscordChatBridgeError("User has DMs off. They have not be alerted about the blacklist");
    }
    return this;
  }

  async delete(data: { alertUser: boolean; shareUser: boolean; user: User; reason: string }): Promise<BlacklistUser[]> {
    const blacklisted = await this.blacklist.getBlacklistUsers();
    const updated = blacklisted.filter((u) => u.blacklistId !== this.blacklistId);
    await this.handleDelete(data);
    return await this.blacklist.writeBlacklistUsersParsed(updated);
  }

  private async handleDelete({ alertUser, shareUser, user, reason }: { alertUser: boolean; shareUser: boolean; user: User; reason: string }): Promise<void> {
    if (!this.blacklist.data.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    const channel = await this.blacklist.data.application.discord.getChannel("Logger");
    if (!channel || !channel.isSendable()) return;
    await channel.send({
      embeds: [
        new Embed()
          .setFields(
            { name: "Discord", value: `<@${this.discordId ?? "UNKNOWN"}>` },
            { name: "Discord ID", value: `\`\`\`${this.discordId ?? "UNKNOWN"}\`\`\`` },
            { name: "UUID", value: `\`\`\`${this.uuid ?? "UNKNOWN"}\`\`\`` },
            { name: "Username", value: `\`\`\`${(await this.getUsername()) ?? "UNKNOWN"}\`\`\`` },
            { name: "\u200B", value: "\u200B" },
            { name: "Blacklisted Reason", value: `\`\`\`${this.reason}\`\`\`` },
            { name: "Blacklisted By", value: `<@${this.by}>` },
            { name: "\u200B", value: "\u200B" },
            { name: "Removed Reason", value: `\`\`\`${reason}\`\`\`` },
            { name: "Removed By", value: `<@${user.id}>` }
          )
          .setDevFooter("Kathund")
      ],
      content: "User has removed from the blacklist"
    });
    if (this.discordId && alertUser) {
      const embed = new SuccessEmbed()
        .setAuthor({ name: "You have been removed from the blacklist" })
        .setDescription(this.reason)
        .setFooter({ text: `Removed by @${user.id}`, iconURL: user.avatarURL({ size: 4096 }) || undefined });
      if (!shareUser) embed.setDevFooter("Kathund");
      const send = await this.blacklist.data.application.discord.client.users.send(this.discordId, { embeds: [embed] }).catch((e: Error) => {
        if (e.name === "DiscordAPIError[50278]") return null;
        throw e;
      });
      if (send === null) throw new HypixelDiscordChatBridgeError("User has DMs off. They have not be alerted about being removed from the blacklist");
    }
  }

  async getDiscordUser(): Promise<GuildMember | null> {
    if (!this.discordId) return null;
    if (!this.blacklist.data.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    if (!this.blacklist.data.application.discord.isGuildReady()) {
      this.blacklist.data.application.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }

    return await this.blacklist.data.application.discord.guild.members.fetch(this.discordId).catch((e) => {
      console.error(e);
      return null;
    });
  }

  async getHypixelPlayer(): Promise<Player | null> {
    if (!this.uuid) return null;
    return await getPlayer(this.uuid);
  }

  async isUserInHypixelGuild(hypixelGuild: Guild | null = null): Promise<HypixelGuildMember | undefined> {
    if (!this.uuid) return undefined;
    const guild = hypixelGuild ?? (await this.blacklist.data.application.getBotGuild());
    return guild.members.find((member) => member.uuid === this.uuid);
  }

  toJSON(): BlacklistedUserData {
    return { blacklistId: this.blacklistId, uuid: this.uuid, discordId: this.discordId, reason: this.reason, timestamp: this.timestamp, by: this.by };
  }
}

export default BlacklistUser;
