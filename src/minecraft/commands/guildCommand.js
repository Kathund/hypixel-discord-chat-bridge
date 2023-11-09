import { capitalize, formatNumber } from "../../contracts/helperFunctions.js";
import { minecraftCommand } from "../../contracts/minecraftCommand.js";
import { hypixel } from "../../contracts/API/HypixelRebornAPI.js";

export class GuildInformationCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "guild";
    this.aliases = ["g"];
    this.description = "View information of a guild";
    this.options = [
      {
        name: "guild",
        description: "Guild name",
        required: true,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      const guildName = this.getArgs(message)
        .map((arg) => capitalize(arg))
        .join(" ");

      const guild = await hypixel.getGuild("name", guildName);

      this.send(
        `/gc Guild ${guildName} | Tag: [${guild.tag}] | Members: ${guild.members.length} | Level: ${
          guild.level
        } | Weekly GEXP: ${formatNumber(guild.totalWeeklyGexp)}`
      );
    } catch (error) {
      this.send(
        `/gc ${error
          .toString()
          .replace("[hypixel-api-reborn] ", "")
          .replace("For help join our Discord Server https://discord.gg/NSEBNMM", "")
          .replace("Error:", "[ERROR]")}`
      );
    }
  }
}
