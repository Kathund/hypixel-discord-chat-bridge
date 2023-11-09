import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import { discord } from "../../../config.json";

export const name = "purge";
export const description = "Purge x messages from a channel.";
export const options = [
  {
    name: "amount",
    description: "The amount of messages to purge. (5 by default)",
    type: 4,
    required: false,
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

  const amount = interaction.options.getInteger("amount") ?? 5;
  if (amount < 1 || amount > 100) {
    throw new HypixelDiscordChatBridgeError("You can only purge between 1 and 100 messages.");
  }

  await interaction.channel.bulkDelete(amount);
}
