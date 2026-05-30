import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class DuelsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("duels")
      .setDescription("Duel stats of specified user.")
      .setAliases(["d"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { wins, kills, KDR, WLR } = hypixelPlayer.stats.Duels;
    this.send(`${hypixelPlayer.nickname}'s Duels Kills: ${formatNumber(kills)} KDR: ${KDR} | Wins: ${formatNumber(wins)} WLR: ${WLR}`);
  }
}

export default DuelsCommand;
