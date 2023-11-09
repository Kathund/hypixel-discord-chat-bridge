import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { minecraft, discord } from '../../../config.json';
import { version } from '../../../package.json';
import { readdirSync } from 'fs';

export const data = new SlashCommandBuilder().setName('info').setDescription('Shows information about the bot.');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { discordCommands, minecraftCommands } = await getCommands(interaction);

  const infoEmbed = new EmbedBuilder()
    .setColor(39423)
    .setTitle('Hypixel Bridge Bot Commands')
    .addFields(
      {
        name: '**Minecraft Commands**: ',
        value: `${minecraftCommands.join('\n')}`,
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
        value: `Bot Username: \`${global.bot.username}\`\nPrefix: \`${minecraft.bot.prefix}\`\nSkyBlock Events: \`${
          minecraft.skyblockEventsNotifications.enabled ? 'enabled' : 'disabled'
        }\`\nAuto Accept: \`${
          minecraft.guildRequirements.autoAccept ? 'enabled' : 'disabled'
        }\`\nGuild Experience Requirement: \`${minecraft.guild.guildExp.toLocaleString()}\`\nUptime: Online since <t:${Math.floor(
          (Date.now() - interaction.client.uptime) / 1000
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
        }\nCommand Roles: ${discord.commands.commandRoles.map((role) => `<@&${role}>`).join(' ')}\nMessage Mode: \`${
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
};

async function getCommands(interaction: ChatInputCommandInteraction) {
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

  return { discordCommands, minecraftCommands };
}
