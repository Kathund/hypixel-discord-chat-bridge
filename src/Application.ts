import { MinecraftManager } from './minecraft/MinecraftManager';
import { DiscordManager } from './discord/DiscordManager';
import { WebManager } from './web/WebsiteManager';

import './Configuration';
import './Updater';

class Application {
  discord: any;
  minecraft: any;
  web: any;
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
