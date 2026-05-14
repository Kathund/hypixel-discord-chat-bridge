import type MinecraftManager from "../Minecraft/MinecraftManager.js";
import type { Bot } from "mineflayer";
import type { DiscordManagerWithBot } from "./Discord.js";

export type GuildChannels = "Guild" | "Officer";

export type MinecraftManagerWithBot = MinecraftManager & { bot: Bot };
export type MinecraftManagerWithClient = MinecraftManagerWithBot & { app: { discord: DiscordManagerWithBot } };
