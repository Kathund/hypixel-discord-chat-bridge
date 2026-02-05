import { formatNumber, formatError, titleCase } from "../../contracts/helperFunctions.js";
import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import HypixelAPI from "../../contracts/API/HypixelAPI.js";

class GuildCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "guild";
    this.aliases = ["g"];
    this.description = "View information of a guild";
    this.options = [
      {
        name: "guild",
        description: "Guild name",
        required: true
      }
    ];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const guildName = this.getArgs(message)
        .map((arg) => titleCase(arg))
        .join(" ");

      const guild = await HypixelAPI.getGuild("name", guildName, { noCaching: false });
      if (!guild) {
        return this.send(`Guild ${guildName} not found.`);
      }

      this.send(
        `Guild ${guildName} | Tag: [${guild.tag}] | Members: ${guild.members.length} | Level: ${guild.level} | Weekly GEXP: ${formatNumber(guild.totalWeeklyGexp)}`
      );
    } catch (error) {
      this.send(formatError(error));
    }
  }
}

export default GuildCommand;
