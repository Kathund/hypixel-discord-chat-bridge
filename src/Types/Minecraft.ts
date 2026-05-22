import type MinecraftManager from '../Minecraft/MinecraftManager.js';
import type { Bot } from 'mineflayer';
import type { DiscordManagerWithBot } from './Discord.js';
import type { SkyBlockProfile, SkyBlockProfileName, SkyblockProfileWithMe, WithSelectedProfile } from 'hypixel-api-reborn';

export type MinecraftManagerWithBot = MinecraftManager & { bot: Bot };
export type MinecraftManagerWithClient = MinecraftManagerWithBot & { Application: { discord: DiscordManagerWithBot } };

export interface CommandDataOptionJSON {
  name: string;
  description: string | null;
  required: boolean;
}

export interface CommandDataJSON {
  name: string;
  description: string | null;
  aliases: string[];
  options: CommandDataOptionJSON[];
}

export interface ParsedForgeSlot {
  item: string;
  slot: number;
  finished: boolean;
  end: number;
  timeLeft: string;
}

export interface FloorData {
  id: string;
  timesPlayed: number;
  fastestTimeS: number;
  fastestTimeSPlus: number;
}

export interface SelectedProfileData {
  username: string;
  rawUsername: string;
  uuid: string;
  profile: SkyblockProfileWithMe;
  profiles: WithSelectedProfile<Map<SkyBlockProfileName | 'UNKNOWN', SkyBlockProfile>>;
}
