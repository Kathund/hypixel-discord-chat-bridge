import type DiscordManager from "../DiscordManager.js";
import type { CommandFlags, DiscordManagerWithClient } from "../../types/discord.js";

class BasicInteractionData<T extends DiscordManager = DiscordManagerWithClient> {
  flags: CommandFlags[];
  constructor(protected readonly discord: T) {
    this.flags = [];
  }
}

export default BasicInteractionData;
