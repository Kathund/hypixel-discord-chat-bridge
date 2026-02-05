class DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    this.discord = discord;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  onCommand(interaction) {
    throw new Error("Command onCommand method is not implemented yet!");
  }
}

export default DiscordCommand;
