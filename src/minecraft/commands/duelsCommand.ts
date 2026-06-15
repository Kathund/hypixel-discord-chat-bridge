import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { type DuelsInternalName, type DuelsModeName, type MinecraftManagerWithBot, type ParsedDuelsStats, isDuelsModeName } from "../../types/minecraft.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type { Player } from "hypixel-api-reborn";

class DuelsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("duels")
      .setDescription("Duel stats of specified user.")
      .setAliases(["d"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  convertMode(mode: DuelsModeName): DuelsInternalName {
    switch (mode) {
      case "uhc":
        return "uhc";
      case "skywars":
      case "sw":
        return "skywars";
      case "blitz":
      case "bsg":
        return "blitz";
      case "op":
        return "op";
      case "classic":
        return "classic";
      case "bow":
        return "bow";
      case "nodebuff":
      case "nb":
        return "noDebuff";
      case "combo":
        return "combo";
      case "bowspleef":
      case "bs":
        return "bowSpleef";
      case "sumo":
        return "sumo";
      case "bridge":
        return "bridge";
      case "parkour":
        return "parkour";
      default:
        return "parkour";
    }
  }

  getStats(hypixelPlayer: Player, mode: DuelsModeName): ParsedDuelsStats {
    let stats;
    if (mode === "overall") stats = hypixelPlayer.stats.Duels;
    else stats = hypixelPlayer.stats.Duels[this.convertMode(mode)];
    const { title, kills, KDR, wins, WLR, winStreak, bestWinStreak } = stats;
    return { title, kills, KDR, wins, WLR, winStreak, bestWinStreak };
  }

  override async execute(player: string, message: string) {
    const msg = this.getArgs(message).map((arg) => arg.replaceAll("/", ""));

    const arg0 = msg[0];
    const arg1 = msg[1];

    let mode: DuelsModeName = "overall";

    if (arg0 && isDuelsModeName(arg0)) {
      mode = arg0;
      if (arg1) player = arg1;
    } else if (arg0) {
      player = arg0;
    }

    const hypixelPlayer = await getPlayer(player);
    const { title, kills, KDR, wins, WLR, winStreak, bestWinStreak } = this.getStats(hypixelPlayer, mode);
    const parsedTitle = title ? `[${title}] ` : "";
    this.send(
      `${parsedTitle}${hypixelPlayer.nickname}'s ${mode} Kills: ${formatNumber(kills)} KDR: ${KDR} | Wins: ${formatNumber(wins)} WLR: ${WLR} | WS: ${winStreak} BWS: ${
        bestWinStreak
      }`
    );
  }
}

export default DuelsCommand;
