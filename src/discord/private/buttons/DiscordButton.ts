import BasicInteractionData from "../BasicInteractionData.js";
import { ButtonResponse, type DiscordManagerWithClient } from "../../../types/discord.js";
import type DiscordButtonData from "./DiscordButtonData.js";
import type DiscordManager from "../../DiscordManager.js";
import type { ButtonInteraction } from "discord.js";

class DiscordButton<T extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<T> {
  data!: DiscordButtonData;
  response: ButtonResponse;
  constructor(discord: T) {
    super(discord);
    this.response = ButtonResponse.Ephemeral;
  }

  execute(interaction: ButtonInteraction): Promise<void> | void {
    throw new Error("Execute Method not implemented!");
  }
}

export default DiscordButton;
