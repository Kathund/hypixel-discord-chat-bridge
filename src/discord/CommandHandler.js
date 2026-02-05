import { REST, Routes, Collection } from "discord.js";
import config from "../../config.json" with { type: "json" };
import { readdirSync } from "fs";

class CommandHandler {
  constructor(discord) {
    this.discord = discord;
  }

  async loadCommands() {
    const commands = [];
    this.discord.client.commands = new Collection();
    const commandFiles = readdirSync("src/discord/commands").filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = new (await import(`./commands/${file}`)).default(this.discord);
      if (command.inactivityCommand === true && config.verification.inactivity.enabled == false) {
        continue;
      }

      if (command.verificationCommand === true && config.verification.enabled === false) {
        continue;
      }

      if (command.channelsCommand === true && config.statsChannels.enabled === false) {
        continue;
      }
      commands.push(command.data.toJSON());
      this.discord.client.commands.set(command.data.name, command);
    }

    const rest = new REST({ version: "10" }).setToken(config.discord.bot.token);

    const clientID = Buffer.from(config.discord.bot.token.split(".")[0], "base64").toString("ascii");

    await rest.put(Routes.applicationGuildCommands(clientID, config.discord.bot.serverID), { body: commands }).catch((e) => console.error(e));
    console.discord(`Successfully reloaded ${commands.length} application command(s).`);
  }
}

export default CommandHandler;
