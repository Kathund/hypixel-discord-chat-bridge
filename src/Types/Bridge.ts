import type { GuildChannels } from "./Minecraft.js";
import type { Message, User } from "discord.js";

export interface BroadcastEvent {
  fullMessage?: string;
  chat?: string;
  chatType?: GuildChannels | "Debug";
  username?: string;
  rank?: string | null;
  guildRank?: string;
  message?: string;
  color?: number;
  title?: string;
  icon?: string;
  discordUser?: User;
  channelId?: string;
  replyingTo?: string | null;
  discordMessage?: Message;
}
