import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import { discord } from "../../../config.json";
import { EmbedBuilder } from "discord.js";

export const name = "execute";
export const description = "Executes commands as the minecraft bot.";
export const options = [
  {
    name: "command",
    description: "Minecraft Command",
    type: 3,
    required: true,
  },
];
export async function execute(interaction) {
  const user = interaction.member;
  if (
    discord.commands.checkPerms === true &&
    !(user.roles.cache.has(discord.commands.commandRole) || discord.commands.users.includes(user.id))
  ) {
    throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
  }

  const command = interaction.options.getString("command");
  bot.chat(`/${command}`);

  const commandMessage = new EmbedBuilder()
    .setColor(2067276)
    .setTitle("Command has been executed successfully")
    .setDescription(`\`/${command}\`\n`)
    .setFooter({
      text: "by @duckysolucky",
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

  await interaction.followUp({ embeds: [commandMessage], ephemeral: true });
}
