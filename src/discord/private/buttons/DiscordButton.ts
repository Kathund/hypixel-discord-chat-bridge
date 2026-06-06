import BasicInteractionData from "../BasicInteractionData.js";
import { ButtonResponse, type DiscordManagerWithClient } from "../../../types/discord.js";
import type DiscordButtonData from "./DiscordButtonData.js";
import type DiscordManager from "../../DiscordManager.js";
import type { ButtonInteraction, Message } from "discord.js";

class DiscordButton<T extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<T> {
  data!: DiscordButtonData;
  response: ButtonResponse;
  constructor(discord: T) {
    super(discord);
    this.response = ButtonResponse.Ephemeral;
  }

  getUsernameFromJoinRequest(message: Message): string | undefined {
    const embed = message.embeds[0];
    if (embed === undefined) return undefined;
    const description = embed.description;
    if (description === null) return undefined;
    const split = description.split(" ");
    return split[0];
  }

  // eslint-disable-next-line require-await
  async execute(interaction: ButtonInteraction): Promise<unknown> {
    throw new Error("Execute Method not implemented!");
  }
}

export default DiscordButton;
