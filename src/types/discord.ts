import config from "../../config.json" with { type: "json" };
import { Client, Collection, Guild } from "discord.js";
import type DiscordButton from "../discord/private/buttons/DiscordButton.js";
import type DiscordCommand from "../discord/private/commands/DiscordCommand.js";
import type DiscordManager from "../discord/DiscordManager.js";
import type DiscordModal from "../discord/private/modals/DiscordModal.js";
import type { MinecraftManagerWithBot } from "./minecraft.js";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, DiscordCommand>;
    buttons: Collection<string, DiscordButton>;
    modals: Collection<string, DiscordModal>;
    config: typeof config;
  }
}

export enum CommandFlags {
  GuildMemberOnly,
  RequiresMinecraftBot,
  StaffOnly,
  StatChannelsCommand,
  VerificationCommand,
  VerifiedOnly
}

export enum BasicInteractionResponse {
  Public,
  Ephemeral,
  None
}

export enum ButtonResponse {
  Public = BasicInteractionResponse.Public,
  Ephemeral = BasicInteractionResponse.Ephemeral,
  None = BasicInteractionResponse.None,
  Update
}

export type ChannelNames = "Guild" | "Officer" | "Logger" | "Debug";
export type DiscordManagerWithClient = DiscordManager & { client: Client };
export type DiscordManagerWithGuild = DiscordManagerWithClient & { guild: Guild };
export type DiscordManagerWithBot = DiscordManagerWithClient & { application: { minecraft: MinecraftManagerWithBot } };

export interface ListMembersGroup {
  name: string;
  value: string;
}

export interface ListMembers {
  online: number;
  onlineString: string;
  total: number;
  totalString: string;
  groups: ListMembersGroup[];
}

export interface Requirement {
  key: string;
  required: number;
  has: string | number;
  passed: boolean;
}

export interface Requirements {
  username: string;
  uuid: string;
  guildName: string;
  passed: boolean;
  requirementsPassed: number;
  requirements: Requirement[];
}

export interface AutoComplateOption {
  name: string;
  value?: string;
}
