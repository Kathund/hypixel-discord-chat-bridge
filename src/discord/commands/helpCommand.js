import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import DiscordCommand from "../../contracts/DiscordCommand.js";
import { Embed } from "../../contracts/embedHandler.js";
import { SlashCommandBuilder } from "discord.js";
import { getCommands } from "./infoCommand.js";
import config from "../../../config.json" with { type: "json" };

class HelpCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("help")
      .setDescription("Shows the help menu.")
      .addStringOption((option) => option.setName("command").setDescription("Bot information about a specific command"));
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    try {
      const commandName = interaction.options.getString("command") || undefined;
      const { discordCommands, minecraftCommands } = getCommands(interaction.client.commands);

      if (commandName === undefined) {
        const helpMenu = new Embed()
          .setColor(0x0099ff)
          .setTitle("Hypixel Discord Chat Bridge Commands")
          .setDescription("`()` = **required** argument, `[]` = **optional** argument\n`u` = Minecraft Username")
          .addFields(
            {
              name: "**Minecraft**: ",
              value: `${minecraftCommands}`,
              inline: true
            },
            {
              name: "**Discord**: ",
              value: `${discordCommands}`,
              inline: true
            }
          )
          .setFooter({
            text: "by @duckysolucky | /help [command] for more information",
            iconURL: "https://imgur.com/tgwQJTX.png"
          });

        await interaction.followUp({ embeds: [helpMenu] });
      } else {
        // TODO: i brokie :3 - kat
        // TODO: @DuckySoLucky Please fix :3
        // const minecraftCommand = readdirSync("./src/minecraft/commands")
        //  .filter((file) => file.endsWith(".js"))
        //  .map((file) => new (require(`../../minecraft/commands/${file}`))())
        //  .find((command) => command.name === commandName || command.aliases.includes(commandName));
        const minecraftCommand = undefined;

        const type = minecraftCommand ? "minecraft" : "discord";

        const command = interaction.client.commands.find((command) => command.name === commandName) ?? minecraftCommand;
        if (command === undefined) {
          throw new HypixelDiscordChatBridgeError(`Command ${commandName} not found.`);
        }

        const description = `${
          command.aliases
            ? `\nAliases: ${command.aliases
                .map((aliase) => {
                  return `\`${config.minecraft.bot.prefix}${aliase}\``;
                })
                .join(", ")}\n\n`
            : ""
        }${command.description}\n\n${
          command.options
            ?.map(({ name, required, description }) => {
              const optionString = required ? `(${name})` : `[${name}]`;
              return `\`${optionString}\`: ${description}\n`;
            })
            .join("") || ""
        }`;

        const embed = new Embed()
          .setTitle(`**${type === "discord" ? "/" : config.minecraft.bot.prefix}${command.name}**`)
          .setDescription(description + "\n")
          .setFooter({
            text: "by @duckysolucky | () = required, [] = optional",
            iconURL: "https://imgur.com/tgwQJTX.png"
          });

        await interaction.followUp({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default HelpCommand;
