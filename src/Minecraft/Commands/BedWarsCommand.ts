import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatError } from "../../Utils/MiscUtils.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getPlayer } from "../../Utils/HypixelUtils.js";
import type { BedWarsMode, Player } from "hypixel-api-reborn";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

type BedWarsModeNames = "solo" | "doubles" | "threes" | "fours" | "4v4" | "overall";
type BedWarsInternalName = "eightOne" | "eightTwo" | "fourThree" | "fourFour" | "twoFour";

class BedwarsCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("bedwars")
      .setAliases(["bw", "bws"])
      .setOptions([new CommandDataOption().setName("username").setRequired(false)]);
  }

  convertMode(mode: BedWarsModeNames): BedWarsInternalName {
    switch (mode) {
      case "solo":
        return "eightOne";
      case "doubles":
        return "eightTwo";
      case "threes":
        return "fourThree";
      case "fours":
        return "fourFour";
      case "4v4":
        return "twoFour";
      default:
        return "eightOne";
    }
  }

  getStats(hypixelPlayer: Player, mode: BedWarsModeNames) {
    let stats: BedWarsMode;
    if (mode === "overall") {
      stats = hypixelPlayer.stats.BedWars;
    } else {
      const internalMode = this.convertMode(mode);
      stats = hypixelPlayer.stats.BedWars[internalMode];
    }
    const { finals, wins, winstreak } = stats;
    const { broken, ratio } = stats.beds;
    return { finalKills: finals.total.kills, wins, winstreak, broken, BLRatio: ratio };
  }

  override async execute(player: string, message: string) {
    const msg = this.getArgs(message).map((arg) => arg.replaceAll("/", ""));
    const modes = ["solo", "doubles", "threes", "fours", "4v4"];

    const mode: BedWarsModeNames = (msg[0] ? (modes.includes(msg[0]) ? msg[0] : "overall") : "overall") as BedWarsModeNames;
    player = msg[0] ? (modes.includes(msg[0]) ? (msg[1] ? msg[1] : player) : msg[0] || player) : player;

    const hypixelPlayer = await getPlayer(player);

    const { finalKills, wins, winstreak, broken, BLRatio } = this.getStats(hypixelPlayer, mode);
    this.send(
      `[${Math.floor(hypixelPlayer.stats.BedWars.level)}✫] ${hypixelPlayer.nickname} ${mode} FK: ${FormatNumber(finalKills)} W: ${FormatNumber(wins)} BB: ${FormatNumber(
        broken
      )} BLR: ${BLRatio} WS: ${winstreak}`
    );
  }
}

export default BedwarsCommand;
