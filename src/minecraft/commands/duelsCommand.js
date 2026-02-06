import HypixelAPI from "../../contracts/API/HypixelAPI.js";
import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { formatError, formatNumber } from "../../contracts/helperFunctions.js";

class DuelsCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "duels";
    this.aliases = ["duel"];
    this.description = "Duel stats of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      },
      {
        name: "duel",
        description: "Type of a duel",
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
      const duelTypes = ["blitz", "uhc", "parkour", "boxing", "bowspleef", "spleef", "arena", "megawalls", "op", "sumo", "classic", "combo", "bridge", "nodebuff", "bow"];
      const arg = this.getArgs(message);
      let duel;

      if (!arg[0] || arg[0].includes("/")) {
        arg[0] = player;
      }

      if (duelTypes.includes(arg[0].toLowerCase())) {
        duel = arg[0].toLowerCase();
        if (arg[1] && !arg[1].includes("/")) {
          player = arg[1];
        }
      } else {
        player = arg[0];

        if (arg[1] && duelTypes.includes(arg[1].toLowerCase())) {
          duel = arg[1].toLowerCase();
        }
      }

      const hypixelPlayer = await HypixelAPI.getPlayer(player);
      if (!hypixelPlayer) {
        throw new Error("Player not found.");
      }

      if (hypixelPlayer.stats === null || hypixelPlayer.stats.duels === null) {
        throw new Error(`${hypixelPlayer.nickname} has never played duels.`);
      }

      if (!duel) {
        this.send(
          // @ts-ignore
          `[Duels] [${hypixelPlayer.stats.duels?.division ?? "Unknown"}] ${hypixelPlayer.nickname} Wins: ${formatNumber(
            hypixelPlayer.stats.duels.wins
          )} | CWS: ${hypixelPlayer.stats.duels.winstreak} | BWS: ${hypixelPlayer.stats.duels.bestWinstreak} | WLR: ${hypixelPlayer.stats.duels.WLRatio}`
        );
      } else {
        // @ts-ignore
        const duelData = hypixelPlayer.stats.duels?.[duel]?.[Object.keys(hypixelPlayer.stats.duels[duel])[0]];
        // @ts-ignore
        const division = duelData?.division ?? hypixelPlayer.stats.duels?.[duel]?.division ?? "Unknown";
        const wins = formatNumber(duelData?.wins ?? 0);
        const winstreak = duelData?.winstreak ?? 0;
        const bestWinstreak = duelData?.bestWinstreak ?? 0;
        const WLRatio = duelData?.WLRatio ?? 0;

        this.send(
          `[${duel.toUpperCase() ?? "Unknown"}] [${division}] ${hypixelPlayer.nickname} Wins: ${wins} | CWS: ${winstreak} | BWS: ${bestWinstreak} | WLR: ${WLRatio}`
        );
      }
    } catch (error) {
      this.send(formatError(error));
    }
  }
}

export default DuelsCommand;
