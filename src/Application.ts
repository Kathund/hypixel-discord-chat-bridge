import DiscordManager from "./Discord/DiscordManager.js";
import LinkedManager from "./Linked/LinkedManager.js";
import MinecraftManager from "./Minecraft/MinecraftManager.js";
import config from "../config.json" with { type: "json" };
import messages from "../messages.json" with { type: "json" };
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

class Application {
  readonly config: typeof config;
  readonly messages: typeof messages;
  readonly discord: DiscordManager;
  readonly linked: LinkedManager;
  readonly minecraft: MinecraftManager;
  constructor() {
    this.config = config;
    this.messages = messages;
    this.discord = new DiscordManager(this);
    this.linked = new LinkedManager(this);
    this.minecraft = new MinecraftManager(this);

    if (!existsSync("./data/")) mkdirSync("./data/", { recursive: true });
    if (!existsSync("./data/linked.json")) writeFileSync("./data/linked.json", JSON.stringify({}));
    if (!existsSync("./data/inactivity.json")) writeFileSync("./data/inactivity.json", JSON.stringify({}));
  }

  connect() {
    this.discord.connect();
    // this.minecraft.connect();
  }
}

export default Application;
