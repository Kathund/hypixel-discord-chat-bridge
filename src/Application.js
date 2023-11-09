import { MinecraftManager } from './minecraft/MinecraftManager.js';
import { DiscordManager } from './discord/DiscordManager.js';
import { WebManager } from './web/WebsiteManager.js';

import './Configuration.js';
import './Updater.js';

class Application {
  async register() {
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.web = new WebManager(this);

    this.discord.setBridge(this.minecraft);
    this.minecraft.setBridge(this.discord);
  }

  async connect() {
    this.discord.connect();
    this.minecraft.connect();
    this.web.connect();
  }
}

export default new Application();
