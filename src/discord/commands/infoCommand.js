import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import { replaceVariables } from "../../contracts/helperFunctions.js";
import DiscordCommand from "../../contracts/DiscordCommand.js";
import { Embed } from "../../contracts/embedHandler.js";
import { SlashCommandBuilder } from "discord.js";
import packageJSON from "../../../package.json" with { type: "json" };
import config from "../../../config.json" with { type: "json" };
import { readdirSync } from "fs";

function formatOptions(name, required) {
  return replaceVariables(required ? ` ({${name}})` : ` [{${name}}]`, { username: "u" })
    .replaceAll("{", "")
    .replaceAll("}", "");
}

export async function getCommands(commands) {
  const discordCommands = commands
    .map(({ data }) => {
      const { name, options } = data.toJSON();
      const optionsString = options?.map(({ name, required }) => formatOptions(name, required)).join("");
      return `- \`${name}${optionsString ? optionsString : ""}\`\n`;
    })
    .join("");

  const minecraftCommandsFiles = readdirSync("./src/minecraft/commands").filter((file) => file.endsWith(".js"));
  const minecraftCommands = [];
  for (const file of minecraftCommandsFiles) {
    const command = new (await import(`../../minecraft/commands/${file}`)).default();
    const optionsString = command.options?.map(({ name, required }) => formatOptions(name, required)).join("");

    minecraftCommands.push(`- \`${command.name}${optionsString}\`\n`);
  }

  return { discordCommands, minecraftCommands: minecraftCommands.join("") };
}

class InfoCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder().setName("info").setDescription("Shows information about the bot.");
    this.requiresBot = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    try {
      if (bot === undefined || bot._client.chat === undefined) {
        throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
      }

      const { discordCommands, minecraftCommands } = getCommands(interaction.client.commands);

      const infoEmbed = new Embed().setTitle("Hypixel Bridge Bot Commands").addFields(
        {
          name: "**Minecraft Commands**: ",
          value: `${minecraftCommands}`,
          inline: true
        },
        {
          name: "**Discord Commands**: ",
          value: `${discordCommands}`,
          inline: true
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "**Minecraft Information**:",
          value: `Bot Username: \`${bot.username}\`\nPrefix: \`${config.minecraft.bot.prefix}\`\nSkyBlock Events: \`${
            config.minecraft.skyblockEventsNotifications.enabled ? "enabled" : "disabled"
          }\`\nAuto Accept: \`${config.minecraft.guildRequirements.autoAccept ? "enabled" : "disabled"}\`\nUptime: Online since <t:${Math.floor(
            (Date.now() - client.uptime) / 1000
          )}:R>\nVersion: \`${packageJSON.version}\`\n`,
          inline: true
        },
        {
          name: `**Discord Information**`,
          value: `Guild Channel: ${config.discord.channels.guildChatChannel ? `<#${config.discord.channels.guildChatChannel}>` : "None"}\nOfficer Channel: ${
            config.discord.channels.officerChannel ? `<#${config.discord.channels.officerChannel}>` : "None"
          }\nGuild Logs Channel: ${config.discord.channels.loggingChannel ? `<#${config.discord.channels.loggingChannel}>` : "None"}\nDebugging Channel: ${
            config.discord.channels.debugChannel ? `<#${config.discord.channels.debugChannel}>` : "None"
          }\nCommand Role: <@&${config.discord.commands.commandRole}>\nMessage Mode: \`${
            config.discord.other.messageMode
          }\`\nFilter: \`${config.discord.other.filterMessages ? "enabled" : "disabled"}\`\nJoin Messages: \`${
            config.discord.other.joinMessage ? "enabled" : "disabled"
          }\``,
          inline: true
        }
      );
      await interaction.followUp({ embeds: [infoEmbed] });
    } catch (e) {
      console.error(e);
    }
  }
}

export default InfoCommand;
