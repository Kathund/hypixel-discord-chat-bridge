import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import { discord } from "../../../config.json";
import { EmbedBuilder } from "discord.js";

export const name = "kick";
export const description = "Kick the given user from the Guild.";
export const options = [
  {
    name: "name",
    description: "Minecraft Username",
    type: 3,
    required: true,
  },
  {
    name: "reason",
    description: "Reason",
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

  const [name, reason] = [interaction.options.getString("name"), interaction.options.getString("reason")];
  bot.chat(`/g kick ${name} ${reason}`);

  const embed = new EmbedBuilder()
    .setColor(5763719)
    .setAuthor({ name: "Kick" })
    .setDescription(`Successfully executed \`/g kick ${name} ${reason}\``)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

  await interaction.followUp({
    embeds: [embed],
  });
}
