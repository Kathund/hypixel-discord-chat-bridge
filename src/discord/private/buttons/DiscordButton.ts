import BasicInteractionData from "../BasicInteractionData.ts";
import { type ButtonInteractionWithGuild, ButtonResponse, type DiscordManagerWithClient } from "../../../types/discord.ts";
import type DiscordButtonData from "./DiscordButtonData.ts";
import type DiscordManager from "../../DiscordManager.ts";
import type { Message } from "discord.js";

abstract class DiscordButton<Manager extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<Manager> {
  abstract readonly data: DiscordButtonData;
  response: ButtonResponse = ButtonResponse.Ephemeral;

  getUsernameFromJoinRequest(message: Message): string | undefined {
    if (message.author.id !== message.client.user.id) return undefined;
    const embed = message.embeds[0];
    if (embed === undefined) return undefined;
    const description = embed.description;
    if (description === null) return undefined;
    const split = description.split(" ");
    return split[0];
  }

  abstract execute(interaction: ButtonInteractionWithGuild): Promise<void>;
}

export default DiscordButton;
