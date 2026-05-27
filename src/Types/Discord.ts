import { Client, Collection, Guild } from 'discord.js';
import type Button from '../Discord/Private/Buttons/Button.js';
import type Command from '../Discord/Private/Commands/Command.js';
import type DiscordManager from '../Discord/DiscordManager.js';
import type Modal from '../Discord/Private/Modals/Modal.js';
import type { MinecraftManagerWithBot } from './Minecraft.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    buttons: Collection<string, Button>;
    modals: Collection<string, Modal>;
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

export type ChannelNames = 'Guild' | 'Officer' | 'Logger' | 'Debug';
export type DiscordManagerWithClient = DiscordManager & { client: Client };
export type DiscordManagerWithGuild = DiscordManagerWithClient & { guild: Guild };
export type DiscordManagerWithBot = DiscordManagerWithClient & { Application: { minecraft: MinecraftManagerWithBot } };

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
