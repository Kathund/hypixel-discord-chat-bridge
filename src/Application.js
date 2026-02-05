import MinecraftManager from "./minecraft/MinecraftManager.js";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import DiscordManager from "./discord/DiscordManager.js";
import WebManager from "./web/WebManager.js";

class Application {
  constructor() {
    if (!existsSync("./data/")) mkdirSync("./data/", { recursive: true });
    if (!existsSync("./data/linked.json")) writeFileSync("./data/linked.json", JSON.stringify({}));
    if (!existsSync("./data/inactivity.json")) writeFileSync("./data/inactivity.json", JSON.stringify({}));
  }

  async register() {
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.web = new WebManager(this);

    this.discord.setBridge(this.minecraft);
    this.minecraft.setBridge(this.discord);
  }

  async connect() {
    await this.discord.connect();
    this.minecraft.connect();
    await this.web.connect();
  }
}

export default Application;
