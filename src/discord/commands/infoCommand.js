import { minecraft, discord } from '../../../config.json';
import { version } from '../../../package.json';
import { EmbedBuilder } from 'discord.js';
// const fs = require("fs");

export const name = 'info';
export const description = 'Shows information about the bot.';
export async function execute(interaction) {
  const commands = interaction.client.commands;

  const { discordCommands, minecraftCommands } = getCommands(commands);

  const infoEmbed = new EmbedBuilder()
    .setColor(39423)
    .setTitle('Hypixel Bridge Bot Commands')
    .addFields(
      {
        name: '**Minecraft Commands**: ',
        value: `${minecraftCommands}`,
        inline: true,
      },
      {
        name: '**Discord Commands**: ',
        value: `${discordCommands}`,
        inline: true,
      },
      { name: '\u200B', value: '\u200B' },
      {
        name: '**Minecraft Information**:',
        value: `Bot Username: \`${bot.username}\`\nPrefix: \`${minecraft.bot.prefix}\`\nSkyBlock Events: \`${
          minecraft.skyblockEventsNotifications.enabled ? 'enabled' : 'disabled'
        }\`\nAuto Accept: \`${
          minecraft.guildRequirements.autoAccept ? 'enabled' : 'disabled'
        }\`\nGuild Experience Requirement: \`${minecraft.guild.guildExp.toLocaleString()}\`\nUptime: Online since <t:${Math.floor(
          (Date.now() - client.uptime) / 1000
        )}:R>\nVersion: \`${version}\`\n`,
        inline: true,
      },
      {
        name: `**Discord Information**`,
        value: `Guild Channel: ${
          discord.channels.guildChatChannel ? `<#${discord.channels.guildChatChannel}>` : 'None'
        }\nOfficer Channel: ${
          discord.channels.officerChannel ? `<#${discord.channels.officerChannel}>` : 'None'
        }\nGuild Logs Channel: ${
          discord.channels.loggingChannel ? `<#${discord.channels.loggingChannel}>` : 'None'
        }\nDebugging Channel: ${
          discord.channels.debugChannel ? `<#${discord.channels.debugChannel}>` : 'None'
        }\nCommand Role: <@&${discord.commands.commandRole}>\nMessage Mode: \`${
          discord.other.messageMode
        }\`\nFilter: \`${discord.other.filterMessages ? 'enabled' : 'disabled'}\`\nJoin Messages: \`${
          discord.other.joinMessage ? 'enabled' : 'disabled'
        }\``,
        inline: true,
      }
    )
    .setFooter({
      text: 'by @duckysolucky | /help [command] for more information',
      iconURL: 'https://imgur.com/tgwQJTX.png',
    });
  await interaction.followUp({ embeds: [infoEmbed] });
}

function getCommands(commands) {
  const discordCommands = commands
    .map(({ name, options }) => {
      const optionsString = options?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`)).join('');
      return `- \`${name}${optionsString ? optionsString : ''}\`\n`;
    })
    .join('');

  // todo fix this
  // const minecraftCommands = fs
  //   .readdirSync("./src/minecraft/commands")
  //   .filter((file) => file.endsWith(".js"))
  //   .map((file) => {
  //     const command = new (require(`../../minecraft/commands/${file}`))();
  //     const optionsString = command.options
  //       ?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`))
  //       .join("");

  //     return `- \`${command.name}${optionsString}\`\n`;
  //   })
  //   .join("");

  return { discordCommands /*minecraftCommands*/ };
}
