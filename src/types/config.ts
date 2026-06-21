import zod from "zod";
import { PlayerVariableStatsKeysNumbers, PlayerVariableStatsKeysStrings } from "../private/constants.js";

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

export const ConfigAPIHypixel = zod.object({ key: zod.string(), baseURL: zod.url().nullable() });
export const ConfigAPIMowojang = zod.object({ baseURL: zod.url().nullable() });
export const ConfigAPI = zod.object({ hypixel: ConfigAPIHypixel, mowojang: ConfigAPIMowojang });

export const ConfigBridgeMinecraft = zod.object({ format: zod.string() });
export const ConfigBridgeDiscord = zod.object({ allowedBots: zod.array(zod.string()), mode: zod.string(), format: zod.string() });
export const ConfigBridgeChannelLoggingChannels = zod.object({
  guild: zod.string().nullable(),
  event: zod.string().nullable(),
  error: zod.string().nullable(),
  blacklist: zod.string().nullable(),
  scripts: zod.string().nullable(),
  inactivity: zod.string().nullable()
});
export const ConfigBridgeChannelLogging = zod.object({ enabled: zod.boolean(), channel: zod.string(), channels: ConfigBridgeChannelLoggingChannels });
export const ConfigBridgeChannel = zod.object({ enabled: zod.boolean(), channel: zod.string() });
export type ConfigBridgeChannel = zod.infer<typeof ConfigBridgeChannel>;
export const ConfigBridgeChannels = zod.object({
  debug: ConfigBridgeChannel,
  guild: ConfigBridgeChannel,
  officer: ConfigBridgeChannel,
  logging: ConfigBridgeChannelLogging
});
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
  requirementsNeededToPass: zod.number(),
  requirements: zod
    .record(zod.string(), zod.number().int().positive())
    .refine((obj) => Object.keys(obj).every((key) => PlayerVariableStatsKeysNumbers.includes(key as any)), { message: "Invalid requirement key" })
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
export const ConfigMinecraftBot = zod.object({
  server: zod.string(),
  port: zod.number().positive().max(65535).min(1),
  version: zod.string(),
  accountsLocation: zod.string()
});
export const ConfigMinecraft = zod.object({
  autoLimbo: zod.boolean(),
  commands: ConfigMinecraftCommands,
  guild: ConfigMinecraftGuild,
  hypixelAlerts: ConfigMinecraftHypixelAlerts,
  bot: ConfigMinecraftBot
});

export const ConfigDiscordCommands = zod.object({ checkPermissions: zod.boolean(), staffRole: zod.string(), adminUsers: zod.array(zod.string()) });
export const ConfigDiscord = zod.object({ serverId: zod.string(), token: zod.string(), commands: ConfigDiscordCommands });

export const ConfigVerificationRolesAutoUpdater = zod.object({ enabled: zod.boolean(), interval: zod.string() });
export const ConfigVerificationRole = zod.object({ enabled: zod.boolean(), roleId: zod.string() });
export const ConfigVerificationRolesCustomRequirementString = zod.object({ type: zod.enum(PlayerVariableStatsKeysStrings), value: zod.string() });
export const ConfigVerificationRolesCustomRequirementNumber = zod.object({ type: zod.enum(PlayerVariableStatsKeysNumbers), value: zod.number().int().positive() });
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
export const ConfigVerificationInactivity = zod.object({ enabled: zod.boolean(), maxInactivityTime: zod.string() });
export const ConfigVerification = zod.object({
  enabled: zod.boolean(),
  nickname: ConfigVerificationNickname,
  roles: ConfigVerificationRoles,
  inactivity: ConfigVerificationInactivity
});

export const ConfigBlacklistNotificationsOnBlacklistChange = zod.object({ enabled: zod.boolean(), shareBlacklister: zod.boolean() });
export const ConfigBlacklistNotifications = zod.object({
  onBlacklistChange: ConfigBlacklistNotificationsOnBlacklistChange,
  onJoinRequest: zod.boolean(),
  onUserJoinDiscord: zod.boolean()
});
export const ConfigBlacklistActionsKickFromGuild = zod.object({ enabled: zod.boolean(), reason: zod.string() });
export const ConfigBlacklistActions = zod.object({ blockBotAccess: zod.boolean(), kickFromGuild: ConfigBlacklistActionsKickFromGuild });
export const ConfigBlacklist = zod.object({ enabled: zod.boolean(), notifications: ConfigBlacklistNotifications, actions: ConfigBlacklistActions });

export const ConfigStatsChannelsAutoUpdater = zod.object({ enabled: zod.boolean(), interval: zod.string() });
export const ConfigStatsChannelsChannel = zod.object({ id: zod.string(), name: zod.string() });
export const ConfigStatsChannels = zod.object({ enabled: zod.boolean(), autoUpdater: ConfigStatsChannelsAutoUpdater, channels: zod.array(ConfigStatsChannelsChannel) });

export const ConfigOtherColors = zod.enum(["Blue", "Red", "Green", "Yellow"]);
export type ConfigOtherColors = zod.infer<typeof ConfigOtherColors>;
export const ConfigOtherCodeUpdater = zod.object({ enabled: zod.boolean(), interval: zod.string() });
export const ConfigOther = zod.object({
  codeUpdater: ConfigOtherCodeUpdater,
  colors: zod.record(ConfigOtherColors, zod.string()),
  backupConfigs: zod.boolean(),
  logToFiles: zod.boolean()
});

export const Config = zod.object({
  configVersion: zod.number().int().positive(),
  API: ConfigAPI,
  bridge: ConfigBridge,
  minecraft: ConfigMinecraft,
  discord: ConfigDiscord,
  verification: ConfigVerification,
  blacklist: ConfigBlacklist,
  statsChannels: ConfigStatsChannels,
  other: ConfigOther
});
export type Config = zod.infer<typeof Config>;
