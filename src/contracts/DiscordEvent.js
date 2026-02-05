import { Events } from "discord.js";

class DiscordEvent {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    this.discord = discord;
    this.event = Events.ClientReady;
  }

  onEvent() {
    throw new Error("Event onEvent method is not implemented yet!");
  }
}

export default DiscordEvent;
