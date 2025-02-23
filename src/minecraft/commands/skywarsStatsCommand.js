const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { formatError } = require("../../contracts/helperFunctions.js");
class SkywarsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "skywars";
    this.aliases = ["sw"];
    this.description = "Skywars stats of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      }
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const player = await hypixel.getPlayer(username);

      const { wins, kills, level, KDRatio, WLRatio, winstreak } = player.stats.skywars;

      this.send(
        `[${level}✫] ${player.nickname} | Kills: ${kills} KDR: ${KDRatio} | Wins: ${wins} WLR: ${WLRatio} | WS: ${winstreak}`
      );
    } catch (error) {
      this.send(formatError(error));
    }
  }
}

module.exports = SkywarsCommand;
