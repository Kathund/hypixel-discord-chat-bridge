// eslint-disable-next-line import/extensions
import { discord as discordConfig } from '../../config.json';
// eslint-disable-next-line import/extensions
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import { readdirSync } from 'fs';

export class CommandHandler {
  discord: any;
  constructor(discord: any) {
    this.discord = discord;

    const commands = [];
    const commandFiles = readdirSync('src/discord/commands').filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = import(`./commands/${file}`);
      commands.push(command);
    }

    const rest = new REST({ version: '10' }).setToken(discordConfig.bot.token);

    const clientID = Buffer.from(discordConfig.bot.token.split('.')[0], 'base64').toString('ascii');

    rest
      .put(Routes.applicationGuildCommands(clientID, discordConfig.bot.serverID), { body: commands })
      .catch(console.error);
  }
}
