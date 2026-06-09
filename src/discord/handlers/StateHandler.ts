import Embed from "../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import type DiscordManager from "../DiscordManager.js";

class StateHandler {
  constructor(private readonly discord: DiscordManager) {}

  async loadGuild() {
    if (!this.discord.isClientOnline()) throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    this.discord.guild = await this.discord.client.guilds.fetch(this.discord.application.config.discord.serverId);
    console.discord(`Guild ready, successfully fetched ${this.discord.guild.name}`);
  }

  async onReady() {
    if (!this.discord.isClientOnline() || !this.discord.client.user) return;
    console.discord(`Client ready, logged in as ${this.discord.client.user?.username} (${this.discord.client.user?.id})!`);
    this.discord.client.user.setPresence({ activities: [{ name: "/help | by @duckysolucky" }] });

    await this.loadGuild();
    await this.discord.buttonHandler.loadButtons();
    await this.discord.modalHandler.loadModals();

    const channel = await this.discord.getChannel("Guild");
    if (channel === null || !channel.isSendable()) return console.error('Channel "Guild" not found!');
    await channel.send({ embeds: [new Embed().setAuthor({ name: "Chat Bridge is Online" }).setColor("Green")] });

    console.discord("Client is fully ready!");
  }

  async onClose() {
    const channel = await this.discord.getChannel("Guild");
    if (channel === null || !channel.isSendable()) return console.error('Channel "Guild" not found!');
    await channel.send({ embeds: [new Embed().setAuthor({ name: "Chat Bridge is Offline" }).setColor("Red")] });
  }
}

export default StateHandler;
