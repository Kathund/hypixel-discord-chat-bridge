import type DiscordManager from "../DiscordManager.js";
import type { GuildMember, PartialGuildMember } from "discord.js";

class EventHandler {
  constructor(private readonly discord: DiscordManager) {}

  async onGuildMemberRemove(member: GuildMember | PartialGuildMember) {
    const linkedUser = await this.discord.application.linked.getUserByDiscordId(member.user.id);
    if (linkedUser === undefined) return;
    await linkedUser.delete();
  }
}

export default EventHandler;
