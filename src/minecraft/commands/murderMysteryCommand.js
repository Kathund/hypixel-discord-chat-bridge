import { formatNumber, formatError } from "../../contracts/helperFunctions.js";
import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import HypixelAPI from "../../contracts/API/HypixelAPI.js";

class MurderMysteryCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "murdermystery";
    this.aliases = ["mm"];
    this.description = "Get Murder Mystery Player Stats";
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
      // CREDITS: by @Kathund (https://github.com/Kathund)
      player = this.getArgs(message)[0] || player;
      const hypixelPlayer = await HypixelAPI.getPlayer(player);
      if (hypixelPlayer === undefined) {
        return this.send(`Couldn't find player ${player}.`);
      }

      if (hypixelPlayer?.stats?.murdermystery === undefined) {
        return this.send(`${player} has no BedWars Stats.`);
      }
      const { wins, kills, deaths, playedGames } = hypixelPlayer.stats.murdermystery;
      const wlr = (wins / playedGames).toFixed(2);
      const kdr = (kills / deaths).toFixed(2);

      this.send(`${hypixelPlayer.nickname}'s Murder Mystery Wins: ${formatNumber(wins)} | WLR: ${wlr} | Kills: ${formatNumber(kills)} | KDR: ${kdr}`);
    } catch (error) {
      console.error(error);
      this.send(formatError(error));
    }
  }
}

export default MurderMysteryCommand;
