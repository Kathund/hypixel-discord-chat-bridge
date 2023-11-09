import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import { discord } from "../../../config.json";
import { EmbedBuilder } from "discord.js";

export const name = "promote";
export const description = "Promotes the given user by one guild rank.";
export const options = [
  {
    name: "name",
    description: "Minecraft Username",
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

  const name = interaction.options.getString("name");
  bot.chat(`/g promote ${name}`);

  const embed = new EmbedBuilder()
    .setColor(5763719)
    .setAuthor({ name: "Promote" })
    .setDescription(`Successfully executed \`/g promote ${name}\``)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

  await interaction.followUp({
    embeds: [embed],
  });
}
