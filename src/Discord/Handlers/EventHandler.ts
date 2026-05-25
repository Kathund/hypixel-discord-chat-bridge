import type DiscordManager from '../DiscordManager.js';
import type { GuildMember, PartialGuildMember } from 'discord.js';

class EventHandler {
  constructor(private readonly discord: DiscordManager) {}

  onGuildMemberRemove(member: GuildMember | PartialGuildMember) {
    const linkedUser = this.discord.Application.linked.getUserByDiscordId(member.user.id);
    if (linkedUser === undefined) return;
    linkedUser.delete();
  }
}

export default EventHandler;
