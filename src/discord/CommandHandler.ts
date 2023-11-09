import { Collection, REST, Routes } from 'discord.js';
import { SlashCommand } from '../types/discord';
import { discord } from '../../config.json';
import { discordMessage } from '../Logger';
import { readdirSync } from 'fs';

export class CommandHandler {
  constructor() {
    try {
      (async () => {
        global.client.commands = new Collection<string, SlashCommand>();
        const commandFiles = readdirSync('./src/discord/commands');
        const commands = [];

        for (const file of commandFiles) {
          const command = await import(`../discord/commands/${file}`);
          commands.push(command.data.toJSON());
          if (command.data.name) {
            global.client.commands.set(command.data.name, command);
          }
        }

        const rest = new REST({ version: '10' }).setToken(discord.bot.token);
        const clientID = Buffer.from(discord.bot.token.split('.')[0], 'base64').toString('ascii');

        (async () => {
          try {
            await rest.put(Routes.applicationCommands(clientID), { body: commands });
            discordMessage(`Successfully reloaded ${commands.length} application command(s).`);
          } catch (error: any) {
            console.log(error);
          }
        })();
      })();
    } catch (error: any) {
      console.log(error);
    }
  }
}
