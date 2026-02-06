class DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    this.discord = discord;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  // eslint-disable-next-line no-unused-vars
  onCommand(interaction) {
    throw new Error("Command onCommand method is not implemented yet!");
  }
}

export default DiscordCommand;
