import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import { discord } from "./../../../config.json";
import { EmbedBuilder } from "discord.js";
import app from "./../../Application.js";

export const name = "restart";
export const description = "Restarts the bot.";
export async function execute(interaction) {
  const user = interaction.member;
  if (
    discord.commands.checkPerms === true &&
    !(user.roles.cache.has(discord.commands.commandRole) || discord.commands.users.includes(user.id))
  ) {
    throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
  }
  const restartEmbed = new EmbedBuilder()
    .setColor(15548997)
    .setTitle("Restarting...")
    .setDescription("The bot is restarting. This might take few seconds.")
    .setFooter({
      text: `by @george_filos | /help [command] for more information`,
      iconURL: "https://cdn.discordapp.com/avatars/177083022305263616/4ee1d5f278a36a61aa9164b9263c8722.webp",
    });

  interaction.followUp({ embeds: [restartEmbed] });

  await bot.end("restart");
  await client.destroy();

  app.register().then(() => {
    app.connect();
  });

  const successfulRestartEmbed = new EmbedBuilder()
    .setColor(2067276)
    .setTitle("Restart Successful!")
    .setDescription("The bot has been restarted successfully.")
    .setFooter({
      text: `by @george_filos | /help [command] for more information`,
      iconURL: "https://cdn.discordapp.com/avatars/177083022305263616/4ee1d5f278a36a61aa9164b9263c8722.webp",
    });

  interaction.followUp({ embeds: [successfulRestartEmbed] });
}
