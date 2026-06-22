import type MinecraftManager from "../minecraft/MinecraftManager.js";
import type { Client } from "minecraft-protocol";
import type { DiscordManagerWithBot } from "./discord.js";
import type { SkyBlockProfile, SkyBlockProfileName, SkyblockProfileWithMe, WithSelectedProfile } from "hypixel-api-reborn";

export type MinecraftManagerWithBot = MinecraftManager & { bot: Client };
export type MinecraftManagerWithClient = MinecraftManagerWithBot & { application: { discord: DiscordManagerWithBot } };

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
  profiles: WithSelectedProfile<Map<SkyBlockProfileName | "UNKNOWN", SkyBlockProfile>>;
}

export const BedWarsModeNames = ["overall", "solo", "doubles", "threes", "fours", "4v4"] as const;
export type BedWarsModeName = (typeof BedWarsModeNames)[number];
export type BedWarsInternalName = "eightOne" | "eightTwo" | "fourThree" | "fourFour" | "twoFour";

export function isBedWarsModeName(value: string): value is BedWarsModeName {
  return (BedWarsModeNames as readonly string[]).includes(value);
}

export const DuelsModeNames = [
  "overall",
  "uhc",
  "skywars",
  "sw",
  "blitz",
  "bsg",
  "op",
  "classic",
  "bow",
  "nodebuff",
  "nb",
  "combo",
  "bowspleef",
  "bs",
  "sumo",
  "bridge",
  "parkour"
] as const;
export type DuelsModeName = (typeof DuelsModeNames)[number];
export type DuelsInternalName = "uhc" | "skywars" | "blitz" | "op" | "classic" | "bow" | "noDebuff" | "combo" | "bowSpleef" | "sumo" | "bridge" | "parkour";

export function isDuelsModeName(value: string): value is DuelsModeName {
  return (DuelsModeNames as readonly string[]).includes(value);
}

export interface ParsedDuelsStats {
  title: string | null;
  kills: number;
  KDR: number;
  wins: number;
  WLR: number;
  winStreak: number;
  bestWinStreak: number;
}
