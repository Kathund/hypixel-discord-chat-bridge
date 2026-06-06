import HypixelDiscordChatBridgeError from "../../private/error.js";
import { type AutocompleteInteraction, type ChatInputCommandInteraction, Collection, MessageFlags, REST, Routes } from "discord.js";
import { BasicInteractionResponse, CommandFlags } from "../../types/discord.js";
import { readdirSync } from "node:fs";
import type DiscordCommand from "../private/commands/DiscordCommand.js";
import type DiscordManager from "../DiscordManager.js";

class CommandHandler {
  constructor(private readonly discord: DiscordManager) {}

  async onCommand(interaction: ChatInputCommandInteraction) {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (command.response !== BasicInteractionResponse.None) {
        await interaction.deferReply({ flags: command.response === BasicInteractionResponse.Ephemeral ? MessageFlags.Ephemeral : undefined });
      }
      console.discord(`Interaction Event trigged by ${interaction.user.username} (${interaction.user.id}) ran command ${interaction.commandName}`);

      await this.discord.interactionHandler.checkPerms(interaction, command);

      await command.execute(interaction);
    } catch (error: unknown) {
      if (error instanceof Error || error instanceof HypixelDiscordChatBridgeError) this.discord.handleError(error, interaction);
    }
  }

  async onAutoComplete(interaction: AutocompleteInteraction) {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.autocomplete(interaction);
    } catch (error: unknown) {
      if (error instanceof Error || error instanceof HypixelDiscordChatBridgeError) this.discord.handleError(error, interaction);
    }
  }

  async deployCommands() {
    if (!this.discord.isClientOnline()) return;
    this.discord.client.commands = new Collection<string, DiscordCommand>();
    const commandFiles = readdirSync("./src/discord/commands/", { recursive: true, encoding: "utf-8" }).filter((file) => file.endsWith(".ts"));

    const commands = [];
    for (const file of commandFiles) {
      const command: DiscordCommand = new (await import(`../commands/${file}`)).default(this.discord);
      if (command.data.name) {
        if (command.flags.includes(CommandFlags.StatChannelsCommand) && !this.discord.application.config.statsChannels.enabled) continue;
        if (command.flags.includes(CommandFlags.VerificationCommand) && !this.discord.application.config.verification.enabled) continue;

        commands.push(command.data.toJSON());
        this.discord.client.commands.set(command.data.name, command);
      }
    }

    const rest = new REST({ version: "10" }).setToken(this.discord.application.config.discord.token);
    const clientId = Buffer.from(this.discord.application.config.discord.token.split(".")?.[0] || "UNKNOWN", "base64").toString("ascii");

    await rest
      .put(Routes.applicationGuildCommands(clientId, this.discord.application.config.discord.serverId), { body: commands })
      .then(() => console.discord(`Successfully reloaded ${commands.length} application command(s).`));
  }
}

export default CommandHandler;
