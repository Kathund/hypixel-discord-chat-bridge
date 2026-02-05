import { Collection } from "discord.js";
import config from "../../config.json" with { type: "json" };
import { readdirSync } from "fs";
import axios from "axios";

class CommandHandler {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    this.minecraft = minecraft;

    this.prefix = config.minecraft.bot.prefix;
    this.commands = new Collection();
  }

  async loadCommands() {
    this.commands = new Collection();
    const commandFiles = readdirSync("./src/minecraft/commands").filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = new (await import(`./commands/${file}`)).default(this.minecraft);
      this.commands.set(command.name, command);
    }
    console.minecraft(`Successfully loaded ${this.commands.size} command(s).`);
  }

  handle(player, message, officer) {
    if (message.startsWith(this.prefix)) {
      if (config.minecraft.commands.normal === false) {
        return;
      }

      const args = message.slice(this.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = this.commands.get(commandName) ?? this.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

      if (command === undefined) {
        return;
      }

      console.minecraft(`${player} - [${command.name}] ${message}`);
      command.officer = officer;
      command.onCommand(player, message);
    } else if (message.startsWith("-") && message.startsWith("- ") === false) {
      if (config.minecraft.commands.soopy === false || message.at(1) === "-") {
        return;
      }

      const command = message.slice(1).split(" ")[0];
      if (isNaN(parseInt(command.replace(/[^-()\d/*+.]/g, ""))) === false) {
        return;
      }

      const chat = officer ? "oc" : "gc";

      bot.chat(`/${chat} [SOOPY V2] ${message}`);

      console.minecraft(`${player} - [${command}] ${message}`);
      (async () => {
        try {
          const URI = encodeURI(`https://soopy.dev/api/guildBot/runCommand?user=${player}&cmd=${message.slice(1)}`);
          const response = await axios.get(URI);

          if (response?.data?.msg === undefined) {
            return bot.chat(`/${chat} [SOOPY V2] An error occured while running the command`);
          }

          bot.chat(`/${chat} [SOOPY V2] ${response.data.msg}`);
        } catch (e) {
          bot.chat(`/${chat} [SOOPY V2] ${e.cause ?? e.message ?? "Unknown error"}`);
        }
      })();
    }
  }
}

export default CommandHandler;
