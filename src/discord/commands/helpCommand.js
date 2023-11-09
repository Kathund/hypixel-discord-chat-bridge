import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import { minecraft } from "../../../config.json";
import { EmbedBuilder } from "discord.js";
// import { readdirSync } from "fs";

export const name = "help";
export const description = "Shows help menu.";
export const options = [
  {
    name: "command",
    description: "Get information about a specific command",
    type: 3,
    required: false,
  },
];

export async function execute(interaction) {
  const commandName = interaction.options.getString("command") || undefined;

  if (commandName === undefined) {
    const discordCommands = interaction.client.commands
      .map(({ name, options }) => {
        const optionsString = options?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`)).join("");
        return `- \`${name}${optionsString ? optionsString : ""}\`\n`;
      })
      .join("");

    // todo fix
    // const minecraftCommands = readdirSync("./src/minecraft/commands")
    //   .filter((file) => file.endsWith(".js"))
    //   .map((file) => {
    //     const command = new (require(`../../minecraft/commands/${file}`))();
    //     const optionsString = command.options
    //       ?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`))
    //       .join("");

    //     return `- \`${command.name}${optionsString}\`\n`;
    //   })
    //   .join("");

    const helpMenu = new EmbedBuilder()
      .setColor(39423)
      .setTitle("Hypixel Discord Chat Bridge Commands")
      .setDescription("() = required argument, [] = optional argument")
      .addFields(
        // {
        //   name: "**Minecraft**: ",
        //   value: `${minecraftCommands}`,
        //   inline: true,
        // },
        {
          name: "**Discord**: ",
          value: `${discordCommands}`,
          inline: true,
        }
      )
      .setFooter({
        text: "by @duckysolucky | /help [command] for more information",
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({ embeds: [helpMenu] });
  } else {
    // todo fix this
    // const minecraftCommand = readdirSync("./src/minecraft/commands")
    //   .filter((file) => file.endsWith(".js"))
    //   .map((file) => new (require(`../../minecraft/commands/${file}`))())
    //   .find((command) => command.name === commandName || command.aliases.includes(commandName));

    const type = /* minecraftCommand ? "minecraft" :*/ "discord";

    const command = interaction.client.commands.find((command) => command.name === commandName); /*?? minecraftCommand*/
    if (command === undefined) {
      throw new HypixelDiscordChatBridgeError(`Command ${commandName} not found.`);
    }

    const description = `${command.description}\n\n${
      command.options
        ?.map(({ name, required, description }) => {
          const optionString = required ? `(${name})` : `[${name}]`;
          return `\`${optionString}\`: ${description}\n`;
        })
        .join("") || ""
    }`;

    const embed = new EmbedBuilder()
      .setColor(39423)
      .setTitle(`**${type === "discord" ? "/" : minecraft.bot.prefix}${command.name}**`)
      .setDescription(description + "\n")
      .setFooter({
        text: "by @duckysolucky | () = required, [] = optional",
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({ embeds: [embed] });
  }
}
