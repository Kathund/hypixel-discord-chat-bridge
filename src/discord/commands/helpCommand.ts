import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { HypixelDiscordChatBridgeError } from '../../contracts/errorHandler';
import { minecraft } from '../../../config.json';
import { readdirSync } from 'fs';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Shows help menu.')
  .addStringOption((option) =>
    option.setName('command').setDescription('Get information about a specific command').setRequired(false)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const commandName = interaction.options.getString('command') || undefined;

  if (commandName === undefined) {
    const discordCommands = interaction.client.commands
      .map((command) => {
        const optionsString = command.data.options
          ?.map(({ name, required }: { name: string; required: boolean }) => (required ? ` (${name})` : ` [${name}]`))
          .join('');
        return `- \`${command.data.name}${optionsString ? optionsString : ''}\`\n`;
      })
      .join('');

    const minecraftCommands = await Promise.all(
      readdirSync('./src/minecraft/commands').map(async (file) => {
        const command = new (await import(`../../minecraft/commands/${file}`)).default(minecraft);
        const optionsString = command.options
          ?.map(({ name, required }: { name: string; required: boolean }) => (required ? ` (${name})` : ` [${name}]`))
          .join('');

        return `- \`${command.name}${optionsString}\``;
      })
    );

    const helpMenu = new EmbedBuilder()
      .setColor(39423)
      .setTitle('Hypixel Discord Chat Bridge Commands')
      .setDescription('() = required argument, [] = optional argument')
      .addFields(
        {
          name: '**Minecraft**: ',
          value: `${minecraftCommands.join('\n')}`,
          inline: true,
        },
        {
          name: '**Discord**: ',
          value: `${discordCommands}`,
          inline: true,
        }
      )
      .setFooter({
        text: 'by @duckysolucky | /help [command] for more information',
        iconURL: 'https://imgur.com/tgwQJTX.png',
      });

    await interaction.followUp({ embeds: [helpMenu] });
  } else {
    // TODO fix this
    const minecraftCommand = readdirSync('./src/minecraft/commands')
      .map(async (file) => new (await import(`../../minecraft/commands/${file}`))())
      .find((command: any) => command.name === commandName || command.aliases.includes(commandName));

    const type = minecraftCommand ? 'minecraft' : 'discord';

    const command = interaction.client.commands.find(
      (command) => command.data.name === commandName
    ); /*?? minecraftCommand*/
    if (command === undefined) {
      throw new HypixelDiscordChatBridgeError(`Command ${commandName} not found.`, interaction.commandName);
    }

    const description = `${command.data.description}\n\n${
      command.data.options
        ?.map(({ name, required, description }: any) => {
          const optionString = required ? `(${name})` : `[${name}]`;
          return `\`${optionString}\`: ${description}\n`;
        })
        .join('') || ''
    }`;

    const embed = new EmbedBuilder()
      .setColor(39423)
      .setTitle(`**${type === 'discord' ? '/' : minecraft.bot.prefix}${command.data.name}**`)
      .setDescription(description + '\n')
      .setFooter({
        text: 'by @duckysolucky | () = required, [] = optional',
        iconURL: 'https://imgur.com/tgwQJTX.png',
      });

    await interaction.followUp({ embeds: [embed] });
  }
};
