import BridgeEventBus from "./private/BridgeEventBus.ts";
import CacheHandler from "./private/CacheHandler.ts";
import DataManager from "./data/DataManager.ts";
import DiscordManager from "./discord/DiscordManager.ts";
import HypixelDiscordChatBridgeError from "./private/error.ts";
import MinecraftManager from "./minecraft/MinecraftManager.ts";
import MowojangAPI from "./private/MowojangAPI.ts";
import PluginManager from "./plugins/PluginManager.ts";
import ScriptManager from "./scripts/ScriptsManager.ts";
import axios, { AxiosHeaders, type AxiosRequestConfig, type AxiosResponse } from "axios";
import messages from "./messages.json" with { type: "json" };
import packageJson from "../package.json" with { type: "json" };
import { Filter } from "bad-words";
import { canSendMessages, getApplicationOwners } from "./utils/discordUtils.ts";
import { execSync } from "node:child_process";
import { getErrorEmbed, getErrorTypeName } from "./utils/miscUtils.ts";
import { getGuild } from "./utils/hypixelUtils.ts";
import type { Config } from "./types/config.ts";
import type { EmbedHelperField } from "./types/discord.ts";
import type { Guild } from "hypixel-api-reborn";
import type { Lifecycle, LifecycleState } from "./core/Lifecycle.ts";
import type { MowojangProfile } from "mowojang";
import type { RuntimeInformation, ValidErrors } from "./types/application.ts";

class Application implements Lifecycle {
  static readonly package: typeof packageJson = packageJson;
  static readonly runtimeInformation = Object.freeze({ commit: this.getGitCommit(), dirty: this.getGitDirty() });
  static readonly cache: CacheHandler = new CacheHandler();
  readonly messages: typeof messages;
  readonly data: DataManager;
  readonly events: BridgeEventBus;
  readonly discord: DiscordManager;
  readonly minecraft: MinecraftManager;
  readonly plugins: PluginManager;
  readonly scripts: ScriptManager;
  readonly filter: Filter;
  private state: LifecycleState = "idle";
  private extensionsLoaded: boolean = false;
  botGuild?: Guild;
  botGuildMembers?: MowojangProfile[];
  constructor(
    readonly config: Config,
    deployScripts: boolean = true
  ) {
    this.messages = messages;
    this.data = new DataManager(this);
    this.events = new BridgeEventBus();
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.scripts = new ScriptManager(this, deployScripts);
    this.plugins = new PluginManager(this);

    this.filter = new Filter();
    this.filter.addWords(...(this.config.bridge.filter.customWords ?? []));
  }

  async start(): Promise<void> {
    if (this.state === "running" || this.state === "starting") return;
    this.state = "starting";
    try {
      await this.data.start();
      if (!this.extensionsLoaded) {
        await Promise.all([
          this.discord.commandHandler.loadCommands(),
          this.discord.buttonHandler.loadButtons(),
          this.discord.modalHandler.loadModals(),
          this.discord.stringSelectMenuHandler.loadStringSelectMenus(),
          this.minecraft.commandHandler.deployCommands()
        ]);
        await this.plugins.load();
        this.extensionsLoaded = true;
      }
      await this.discord.start();
      await this.minecraft.start();
      await this.plugins.start();
      await this.scripts.start();
      this.state = "running";
    } catch (error: unknown) {
      try {
        await this.stop();
      } catch (shutdownError: unknown) {
        console.error(shutdownError);
      }
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.state === "stopping" || this.state === "idle") return;
    this.state = "stopping";
    const errors: unknown[] = [];
    for (const stop of [() => this.scripts.stop(), () => this.plugins.stop(), () => this.minecraft.stop(), () => this.discord.stop(), () => this.data.stop()]) {
      try {
        await stop();
      } catch (error: unknown) {
        errors.push(error);
      }
    }
    this.state = "idle";
    if (errors.length > 0) throw new AggregateError(errors, "Application shutdown failed.");
  }

  async getBotGuild(): Promise<Guild> {
    if (!this.minecraft.hasBot()) throw new HypixelDiscordChatBridgeError(this.messages.minecraftBotOffline);
    this.botGuild = await getGuild("player", this.minecraft.bot.username).then((guild) => {
      if (guild === null) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
      return guild;
    });
    this.botGuildMembers = await MowojangAPI.getProfiles(this.botGuild.members.map((member) => member.uuid)).then((data) => {
      if (data.data === null) return undefined;
      return data.data;
    });
    if (this.config.blacklist.enabled && this.config.blacklist.actions.kickFromGuild.enabled) {
      await Promise.all(
        this.botGuild.members.map(async (user) => {
          if (!this.minecraft.hasBot()) return;
          const blacklistUser = await this.data.blacklist.getUserByUUID(user.uuid);
          if (blacklistUser) this.minecraft.bot.chat(`/g kick ${await blacklistUser.getUsername()} ${this.config.blacklist.actions.kickFromGuild.reason}`);
        })
      );
    }
    return this.botGuild;
  }

  async logError(error: ValidErrors, extraData: EmbedHelperField[] = []) {
    console.error(error);
    if (!this.discord.isClientOnline()) return;

    try {
      const channel = await this.discord.getChannel("Logger-Error");
      if (!channel) return;
      const hasPermission = await canSendMessages(channel);
      if (!hasPermission) return;
      const owners = await getApplicationOwners(this.discord.client);
      await channel.send({
        content: getErrorTypeName(error) === "Generic Error" ? owners.map((id) => `<@${id}>`).join(" ") : "",
        embeds: [getErrorEmbed(error, extraData)]
      });
    } catch (e) {
      console.error(e);
    }
  }

  private static getGitCommit(): RuntimeInformation["commit"] {
    try {
      return process.env.GIT_COMMIT ?? execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    } catch (error) {
      console.error(error);
      return "UNKNOWN";
    }
  }

  private static getGitDirty(): RuntimeInformation["dirty"] {
    try {
      return process.env.GIT_DIRTY !== undefined ? process.env.GIT_DIRTY === "true" : execSync("git status --porcelain", { encoding: "utf8" }).trim().length > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static get startTime(): RuntimeInformation["startTime"] {
    return Math.floor(Date.now() / 1000) - Math.floor(process.uptime());
  }

  static getRuntimeInformation(): RuntimeInformation {
    return { commit: this.runtimeInformation.commit, dirty: this.runtimeInformation.dirty, startTime: this.startTime, docker: process.env.RUNNING_IN_DOCKER === "true" };
  }

  static getUserAgent() {
    return `${this.package.name}/git:${this.runtimeInformation.commit} (github:Kathund/hypixel-discord-chat-bridge)`;
  }

  static async request<T>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    const headers = new AxiosHeaders(config.headers as AxiosHeaders | undefined);
    if (!headers.has("User-Agent")) headers.set("User-Agent", this.getUserAgent());
    return await axios.request<T>({ ...config, url, method: config.method ?? "GET", headers });
  }
}

export default Application;
