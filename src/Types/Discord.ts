import { Client, Collection, Guild } from "discord.js";
import type Command from "../Discord/Private/Commands/Command.js";
import type DiscordManager from "../Discord/DiscordManager.js";
import type { GuildChannels, MinecraftManagerWithBot } from "./Minecraft.js";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>;
  }
}

export enum CommandFlags {
  RequiresMinecraftBot,
  VerificationCommand
}

export enum CommandType {
  Global,
  Guild,
  Staff
}

export enum CommandResponse {
  Public,
  Ephemeral
}

export enum ButtonResponse {
  Public,
  Ephemeral,
  Update
}

export type ChannelNames = GuildChannels | "Logger" | "Debug";
export type DiscordManagerWithClient = DiscordManager & { client: Client };
export type DiscordManagerWithGuild = DiscordManagerWithClient & { guild: Guild };
export type DiscordManagerWithBot = DiscordManagerWithClient & { app: { minecraft: MinecraftManagerWithBot } };
