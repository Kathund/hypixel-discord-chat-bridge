import { discord as discordConfig } from "../../../config.json";
import { discordMessage, errorMessage } from "../../Logger.js";

export class StateHandler {
  constructor(discord) {
    this.discord = discord;
  }

  async onReady() {
    discordMessage("Client ready, logged in as " + this.discord.client.user.tag);
    this.discord.client.user.setPresence({
      activities: [{ name: `/help | by @duckysolucky` }],
    });

    const channel = await this.getChannel("Guild");
    if (channel === undefined) {
      return errorMessage(`Channel "Guild" not found!`);
    }

    channel.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Online` },
          color: 2067276,
        },
      ],
    });
  }

  async onClose() {
    const channel = await this.getChannel("Guild");
    if (channel === undefined) {
      return errorMessage(`Channel "Guild" not found!`);
    }

    await channel.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Offline` },
          color: 15548997,
        },
      ],
    });
  }

  async getChannel(type) {
    if (typeof type !== "string" || type === undefined) {
      return errorMessage(`Channel type must be a string!`);
    }

    switch (type.replace(/§[0-9a-fk-or]/g, "").trim()) {
      case "Guild":
        return this.discord.client.channels.cache.get(discordConfig.channels.guildChatChannel);
      case "Officer":
        return this.discord.client.channels.cache.get(discordConfig.channels.officerChannel);
      case "Logger":
        return this.discord.client.channels.cache.get(discordConfig.channels.loggingChannel);
      default:
        return this.discord.client.channels.cache.get(discordConfig.channels.debugChannel);
    }
  }
}
