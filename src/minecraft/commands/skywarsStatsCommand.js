import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { formatError } from "../../contracts/helperFunctions.js";
import HypixelAPI from "../../contracts/API/HypixelAPI.js";

class SkywarsCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
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

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      player = this.getArgs(message)[0] || player;

      const hypixelPlayer = await HypixelAPI.getPlayer(player);
      if (hypixelPlayer.stats?.skywars === undefined) {
        return this.send(`${player} has no Skywars stats.`);
      }

      const { wins, kills, level, KDRatio, WLRatio, coins } = hypixelPlayer.stats.skywars;

      this.send(`[${level}✫] ${hypixelPlayer.nickname} | Kills: ${kills} KDR: ${KDRatio} | Wins: ${wins} WLR: ${WLRatio} | Coins: ${coins}`);
    } catch (error) {
      this.send(formatError(error));
    }
  }
}

export default SkywarsCommand;
