import zod from "zod";
import { PlayerVariableStatsKeysNumber, PlayerVariableStatsKeysString } from "../private/constants.js";

export enum ConfigChangeType {
  Move,
  Delete,
  Transform
}

export type TransformFunction = (value: any, config: any) => any;

export interface MigrationRule {
  key?: string;
  change: ConfigChangeType;
  transform?: TransformFunction;
}

export type MigrationMap = Record<string, MigrationRule>;

export const ConfigAPIHypixel = zod.object({ key: zod.string(), baseURL: zod.url().nullish() });
export const ConfigAPIMowojang = zod.object({ baseURL: zod.url().nullish() });
export const ConfigAPI = zod.object({ hypixel: ConfigAPIHypixel, mowojang: ConfigAPIMowojang });

export const ConfigBridgeMinecraft = zod.object({ format: zod.string() });
export const ConfigBridgeDiscord = zod.object({ allowedBots: zod.array(zod.string()), mode: zod.string(), format: zod.string() });
export const ConfigBridgeChannel = zod.object({ enabled: zod.boolean(), channel: zod.string() });
export const ConfigBridgeChannels = zod.object({ debug: ConfigBridgeChannel, guild: ConfigBridgeChannel, officer: ConfigBridgeChannel, logging: ConfigBridgeChannel });
export const ConfigBridgeFilter = zod.object({ enabled: zod.boolean(), customWords: zod.array(zod.string()) });
export const ConfigBridge = zod.object({
  minecraft: ConfigBridgeMinecraft,
  discord: ConfigBridgeDiscord,
  channels: ConfigBridgeChannels,
  filter: ConfigBridgeFilter,
  stripEmojisFromUsernames: zod.boolean()
});

export const ConfigMinecraftCommand = zod.object({ enabled: zod.boolean(), prefix: zod.string() });
export const ConfigMinecraftCommands = zod.object({
  messageRepeatBypassLength: zod.number(),
  maxMessageLength: zod.number(),
  normal: ConfigMinecraftCommand,
  soopy: ConfigMinecraftCommand
});
export const ConfigMinecraftGuildRequirements = zod.object({
  enabled: zod.boolean(),
  autoAccept: zod.boolean(),
  requiredToHave: zod.number(),
  requirements: zod
    .record(zod.string(), zod.number().int().positive())
    .refine((obj) => Object.keys(obj).every((key) => PlayerVariableStatsKeysNumber.includes(key as any)), { message: "Invalid requirement key" })
});
export const ConfigMinecraftGuild = zod.object({ requirements: ConfigMinecraftGuildRequirements });
export const ConfigMinecraftHypixelAlertsAlert = zod.object({ enabled: zod.boolean(), interval: zod.string() });
export const ConfigMinecraftHypixelAlertsAlphaPlayerCountTracker = zod.object({
  enabled: zod.boolean(),
  interval: zod.string(),
  messageCooldown: zod.string(),
  playerThreshold: zod.number()
});
export const ConfigMinecraftHypixelAlerts = zod.object({
  hypixelNews: ConfigMinecraftHypixelAlertsAlert,
  statusUpdates: ConfigMinecraftHypixelAlertsAlert,
  skyblockVersion: ConfigMinecraftHypixelAlertsAlert,
  alphaPlayerCountTracker: ConfigMinecraftHypixelAlertsAlphaPlayerCountTracker
});
export const ConfigMinecraft = zod.object({
  autoLimbo: zod.boolean(),
  commands: ConfigMinecraftCommands,
  guild: ConfigMinecraftGuild,
  hypixelAlerts: ConfigMinecraftHypixelAlerts
});

export const ConfigDiscordCommands = zod.object({ checkPermissions: zod.boolean(), staffRole: zod.string(), adminUsers: zod.array(zod.string()) });
export const ConfigDiscord = zod.object({ serverId: zod.string(), token: zod.string(), commands: ConfigDiscordCommands });

export const ConfigVerificationRolesAutoUpdater = zod.object({ enabled: zod.boolean(), interval: zod.string() });
export const ConfigVerificationRole = zod.object({ enabled: zod.boolean(), roleId: zod.string() });
export const ConfigVerificationRolesCustomRequirementString = zod.object({ type: zod.enum(PlayerVariableStatsKeysString), value: zod.string() });
export const ConfigVerificationRolesCustomRequirementNumber = zod.object({ type: zod.enum(PlayerVariableStatsKeysNumber), value: zod.number().int().positive() });
export const ConfigVerificationRolesCustomRequirement = zod.union([ConfigVerificationRolesCustomRequirementString, ConfigVerificationRolesCustomRequirementNumber]);
export const ConfigVerificationRolesCustom = zod.object({
  enabled: zod.boolean(),
  roleId: zod.string(),
  requirements: zod.array(ConfigVerificationRolesCustomRequirement)
});
export const ConfigVerificationRoles = zod.object({
  verified: ConfigVerificationRole,
  guildMember: ConfigVerificationRole,
  custom: zod.array(ConfigVerificationRolesCustom),
  autoUpdater: ConfigVerificationRolesAutoUpdater
});
export const ConfigVerificationNickname = zod.object({ enabled: zod.boolean(), nickname: zod.string(), removeCommas: zod.boolean() });
export const ConfigVerification = zod.object({ enabled: zod.boolean(), nickname: ConfigVerificationNickname, roles: ConfigVerificationRoles });

export const ConfigStatsChannelsAutoUpdater = zod.object({ enabled: zod.boolean(), interval: zod.string() });
export const ConfigStatsChannelsChannel = zod.object({ id: zod.string(), name: zod.string() });
export const ConfigStatsChannels = zod.object({ enabled: zod.boolean(), autoUpdater: ConfigStatsChannelsAutoUpdater, channels: zod.array(ConfigStatsChannelsChannel) });

export const ConfigCodeUpdater = zod.object({ enabled: zod.boolean(), interval: zod.string() });

export const Config = zod.object({
  configVersion: zod.number().int().positive(),
  API: ConfigAPI,
  bridge: ConfigBridge,
  minecraft: ConfigMinecraft,
  discord: ConfigDiscord,
  verification: ConfigVerification,
  statsChannels: ConfigStatsChannels,
  codeUpdater: ConfigCodeUpdater
});
export type Config = zod.infer<typeof Config>;
