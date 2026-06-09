import BlacklistUser from "./BlacklistUser.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { ActionRowBuilder, type BaseMessageOptions, ButtonStyle } from "discord.js";
import { ButtonBuilder } from "discord.js";
import { SuccessEmbed } from "../../discord/private/Embed.js";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import type DataManager from "../DataManager.js";
import type { BlacklistData } from "../../types/blacklist.js";

class BlacklistManager {
  constructor(readonly data: DataManager) {
    this.init();
  }

  private async init() {
    try {
      await mkdir("./data/", { recursive: true });
      await access("./data/blacklist.json");
    } catch {
      await writeFile("./data/blacklist.json", JSON.stringify([]));
    }
  }

  async getBlacklistFile(): Promise<BlacklistData> {
    const blacklistData = await readFile("data/blacklist.json");
    if (!blacklistData) throw new HypixelDiscordChatBridgeError("The blacklist data file does not exist. Please contact an administrator.");
    const blacklist = JSON.parse(blacklistData.toString());
    if (!blacklist) throw new HypixelDiscordChatBridgeError("The blacklist data file is malformed. Please contact an administrator.");
    return blacklist;
  }

  parseBlacklistData(data: BlacklistData): BlacklistUser[] {
    return data.map((user) => new BlacklistUser(user, this));
  }

  async getBlacklistUsers(): Promise<BlacklistUser[]> {
    return this.parseBlacklistData(await this.getBlacklistFile());
  }

  async writeBlacklistUsers(data: BlacklistData): Promise<BlacklistUser[]> {
    await writeFile("data/blacklist.json", JSON.stringify(data, null, 2), "utf-8");
    return this.parseBlacklistData(data);
  }

  async writeBlacklistUsersParsed(users: BlacklistUser[]): Promise<BlacklistUser[]> {
    return await this.writeBlacklistUsers(users.map((user) => user.toJSON()));
  }

  async getUser(blacklistUser: BlacklistUser): Promise<BlacklistUser | undefined> {
    const users = await this.getBlacklistUsers();
    return users.find((user) => user === blacklistUser);
  }

  async getUserByDiscordId(discordId: string): Promise<BlacklistUser | undefined> {
    const users = await this.getBlacklistUsers();
    return users.find((user) => user.discordId === discordId);
  }

  async getUserByUsername(username: string): Promise<BlacklistUser | undefined> {
    const UUID = await MowojangAPI.getUUID(username);
    if (UUID === null) throw new HypixelDiscordChatBridgeError("User doesn't exist");
    return this.getUserByUUID(UUID);
  }

  async getUserByUUID(UUID: string): Promise<BlacklistUser | undefined> {
    const users = await this.getBlacklistUsers();
    return users.find((user) => user.uuid === UUID);
  }

  async getBlacklistDataResponse(blacklistUser: BlacklistUser): Promise<BaseMessageOptions> {
    const [player, guildMember] = await Promise.all([blacklistUser.getHypixelPlayer(), blacklistUser.isUserInHypixelGuild()]);
    return {
      embeds: [
        new SuccessEmbed()
          .setAuthor({ name: "Found Blacklist" })
          .setFields(
            { name: "Reason", value: `\`\`\`${blacklistUser.reason}\`\`\`` },
            { name: "Blacklisted By", value: `<@${blacklistUser.by}>` },
            { name: "Timestamp", value: `<t:${blacklistUser.timestamp}:F> (<t:${blacklistUser.timestamp}:R>)` },
            { name: "Discord", value: `<@${blacklistUser.discordId ?? "UNKNOWN"}>` },
            { name: "Discord ID", value: `\`\`\`${blacklistUser.discordId ?? "UNKNOWN"}\`\`\`` },
            { name: "UUID", value: `\`\`\`${player?.uuid ?? "UNKNOWN"}\`\`\`` },
            { name: "Username", value: `\`\`\`${player?.nickname ?? "UNKNOWN"}\`\`\`` },
            { name: "Formatted Username", value: `\`\`\`${player?.formattedNickname ?? "UNKNOWN"}\`\`\`` },
            { name: "Is in Guild", value: guildMember ? ":white_check_mark: Yes" : ":x: No" }
          )
          .setDevFooter("Kathund")
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId("editReason").setLabel("Edit Reason").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("getLinked").setLabel("Get Linked Data").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("unblacklist").setLabel("Unblacklist").setStyle(ButtonStyle.Danger)
        )
      ]
    };
  }
}

export default BlacklistManager;
