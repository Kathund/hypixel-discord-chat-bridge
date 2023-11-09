import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import { discord } from "../../../config.json";
import { EmbedBuilder } from "discord.js";

export const name = "blacklist";
export const description = "Demotes the given user by one guild rank.";
export const options = [
  {
    name: "arg",
    description: "Add or Remove",
    type: 3,
    required: true,
    choices: [
      {
        name: "Add",
        value: "add",
      },
      {
        name: "Remove",
        value: "remove",
      },
    ],
  },
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
  const arg = interaction.options.getString("arg").toLowerCase();

  if (arg == "add") {
    bot.chat(`/ignore add ${name}`);
  } else if (arg == "remove") {
    bot.chat(`/ignore remove ${name}`);
  } else {
    throw new HypixelDiscordChatBridgeError("Invalid Usage: `/ignore [add/remove] [name]`.");
  }

  const embed = new EmbedBuilder()
    .setColor(5763719)
    .setAuthor({ name: "Blacklist" })
    .setDescription(`Successfully executed \`/ignore ${arg} ${name}\``)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

  await interaction.followUp({
    embeds: [embed],
  });
}
