import DiscordManager from './Discord/DiscordManager.js';
import HypixelAPIReborn from './Private/HypixelAPIReborn.js';
import HypixelDiscordChatBridgeError from './Private/Error.js';
import LinkedManager from './Linked/LinkedManager.js';
import MinecraftManager from './Minecraft/MinecraftManager.js';
import MowojangAPI from './Private/MowojangAPI.js';
import ScriptManager from './Scripts/ScriptsManager.js';
import config from '../config.json' with { type: 'json' };
import messages from '../messages.json' with { type: 'json' };
import { Filter } from 'bad-words';
import type { Guild } from 'hypixel-api-reborn';
import type { ParsedSession } from './Types/MowojangAPI.js';

class Application {
  readonly config: typeof config;
  readonly messages: typeof messages;
  readonly discord: DiscordManager;
  readonly linked: LinkedManager;
  readonly minecraft: MinecraftManager;
  readonly scripts: ScriptManager;
  readonly filter: Filter;
  botGuild?: Guild;
  botGuildMembers?: ParsedSession[];
  constructor() {
    this.config = config;
    this.messages = messages;
    this.discord = new DiscordManager(this);
    this.linked = new LinkedManager(this);
    this.minecraft = new MinecraftManager(this);
    this.scripts = new ScriptManager(this);

    this.filter = new Filter();
    this.filter.addWords(...(this.config.bridge.filter.customWords ?? []));

    this.discord.setBridge(this.minecraft);
    this.minecraft.setBridge(this.discord);
  }

  connect() {
    this.discord.connect();
    this.minecraft.connect();
  }

  async stop(): Promise<void> {
    if (this.discord.isClientOnline()) await this.discord.client.destroy();
    if (this.minecraft.isBotOnline()) this.minecraft.bot.end('Shutting Down');
  }

  async getBotGuild(): Promise<Guild> {
    if (!this.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError(this.messages.minecraftBotOffline);
    this.botGuild = await HypixelAPIReborn.getGuild('player', this.minecraft.bot.username).then((guild) => {
      if (guild === null) throw new HypixelDiscordChatBridgeError('In game Hypixel Guild not found.');
      if (guild.isRaw()) throw new HypixelDiscordChatBridgeError('In game Hypixel Guild not found.');
      return guild;
    });
    this.botGuildMembers = await MowojangAPI.getSessions(this.botGuild.members.map((member) => member.uuid)).then((data) => {
      if (data.data === null) return undefined;
      return data.data.map(({ UUID, username }) => ({ UUID, username }));
    });
    return this.botGuild;
  }
}

export default Application;
