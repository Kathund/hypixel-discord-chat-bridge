import { minecraft as minecraftConfig } from "../../config.json";
import { minecraftMessage } from "../Logger.js";
import { Collection } from "discord.js";
// import { readdirSync } from "fs";
import axios from "axios";

export class CommandHandler {
  constructor(minecraft) {
    this.minecraft = minecraft;

    this.prefix = minecraftConfig.bot.prefix;
    this.commands = new Collection();

    // todo fix
    // const commandFiles = readdirSync("./src/minecraft/commands").filter((file) => file.endsWith(".js"));
    // for (const file of commandFiles) {
    //   const command = new (require(`./commands/${file}`))(minecraft);

    //   this.commands.set(command.name, command);
    // }
  }

  handle(player, message) {
    if (message.startsWith(this.prefix)) {
      if (minecraftConfig.commands.normal === false) {
        return;
      }

      const args = message.slice(this.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command =
        this.commands.get(commandName) ?? this.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

      if (command === undefined) {
        return;
      }

      minecraftMessage(`${player} - [${command.name}] ${message}`);
      command.onCommand(player, message);
    } else if (message.startsWith("-") && message.startsWith("- ") === false) {
      if (minecraftConfig.commands.soopy === false || message.at(1) === "-") {
        return;
      }

      bot.chat(`/gc [SOOPY V2] ${message}`);

      const command = message.slice(1).split(" ")[0];

      minecraftMessage(`${player} - [${command}] ${message}`);

      (async () => {
        try {
          const URI = encodeURI(`https://soopy.dev/api/guildBot/runCommand?user=${player}&cmd=${message.slice(1)}`);
          const response = await axios.get(URI);

          if (response?.data?.msg === undefined) {
            return bot.chat(`/gc [SOOPY V2] An error occurred while running the command`);
          }

          bot.chat(`/gc [SOOPY V2] ${response.data.msg}`);
        } catch (e) {
          bot.chat(`/gc [SOOPY V2] ${e.cause ?? e.message ?? "Unknown error"}`);
        }
      })();
    }
  }
}
